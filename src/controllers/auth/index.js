const app = require('express')
const nodemailer = require('nodemailer');

const config = require('../../config')

const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const {email, password} = req.body;
		if (!(email && password)) {
			res.status(400).send('All input is required!');
		}

		const existingUser = await getUser(email);
		if (existingUser) {
			return res.status(409).send('User Already Exists. Please Login');
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const activationCode = crypto.randomBytes(32).toString('hex');
		const user = await addUser({
			email: email.toLowerCase(),
			password: encryptedPassword,
			activationCode,
			activated: false
		});

		const token = jwt.sign(
			{id: user.id, email},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.TOKEN_EXPIRE_TIME
			}
		);
		user.token = token;
		try {
			await sendVerificationMail(user.email, user.id, activationCode);
		} catch (e) {
			logger.error('Can not send verification email', e);

			return res.status(400).send('Can not send verification email');
		}
		res.status(201).json(user);
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});

authRouter.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;

		if (!(email && password)) {
			res.status(400).send('All input is required');
		}

		const user = await getUser(email);

		const userStatus = user && (await bcrypt.compare(password, user.password));
		if (userStatus) {
			const token = jwt.sign(
				{id: user.id, email},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: process.env.TOKEN_EXPIRE_TIME
				}
			);

			user.token = token;
			res.status(200).json(user);
		} else {
			res.status(400).send('Invalid Credentials');
		}
	} catch (error) {
		logger.error(error);
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const user = await getUser(null, req.params.id);
		if (!user) return res.status(400).send('Invalid link');

		const token = user.activationCode;
		if (!token) return res.status(400).send('Invalid link');

		const updateRequest = await activateUser(user.id);

		if (!updateRequest) return res.status(500).send('Can\'t verify user');
		//res.redirect(`${process.env.CLIENT_URL}/login`)
		res.send('Email verified successfully');
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});

async function sendVerificationMail(address, id, activationCode) {
	const verificationUrl = `http://${config.app.host}:${config.app.port}/verify/${id}/${activationCode}`;
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: true,
		auth: {
			user: config.mail.user,
			pass: config.mail.password
		}
	});

	return await transporter.sendMail({
		from: `"Test Node App" <${config.mail.user}>`,
		to: address,
		subject: 'Confirm registration ✔',
		text: '',
		html: `<b>Please, click the link below to confirm registration: </b><br><a target="_blank" href='${verificationUrl}'>${verificationUrl}</a>`
	});
}

module.exports = authRouter;