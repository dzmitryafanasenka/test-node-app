const app = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const authValidator = require('./validation/index');
const config = require('../../config');
const logger = require('../../common/logger')('AuthController');
const usersService = require('../../services/users.service').instance();


const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.signUpValidation);
		} catch (validationError) {
			return res.status(400).send(validationError.details);
		}

		const existingUser = await usersService.getUser(email);
		if (existingUser) {
			return res.status(409).send('User Already Exists. Please Login');
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const activationCode = crypto.randomBytes(32).toString('hex');
		const user = await usersService.addUser({
			email: email.toLowerCase(),
			password: encryptedPassword,
			activationCode,
			activated: false
		});

		try {
			await sendVerificationMail(user.email, user.userId, activationCode);
		} catch (e) {
			logger.error('Can not send verification email', e);

			return res.status(400).send('Can not send verification email');
		}
		res.send(user);
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});

authRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.loginValidation);
		} catch (loginError) {
			return res.status(400).send(loginError.details);
		}

		const user = await usersService.getUser(email);

		const userStatus = user && (await bcrypt.compare(password, user.password));
		if (userStatus) {
			user.token = jwt.sign(
				{ userId: user.userId, email },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: process.env.TOKEN_EXPIRE_TIME
				}
			);
			res.send(user);
		} else {
			res.status(400).send('Invalid Credentials');
		}
	} catch (error) {
		logger.error(error);
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const user = await usersService.getUser(null, req.params.id);

		try {
			joi.assert(user, authValidator.verifyValidation);
		} catch (verificationError) {
			logger.error('Validation failed at the verification method', verificationError);

			return res.status(400).send('Invalid link');
		}

		const updateRequest = await usersService.activateUser(user.userId);
		if (!updateRequest) {
			return res.status(500).send('Can\'t verify user');
		}
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
			user: config.mail.username,
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