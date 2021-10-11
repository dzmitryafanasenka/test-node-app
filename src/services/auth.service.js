const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const config = require('../config/index');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')('authService');
const UsersRepository = require('../repositories/users.repository').instance();

class AuthService {

	static instance() {
		return authService;
	}

	async signup(res, data) {
		const { email, password } = data;

		const existingUser = await UsersRepository.getUser(email);
		if (existingUser) {
			return res.status(409).send('User Already Exists. Please Login');
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const activationCode = crypto.randomBytes(32).toString('hex');
		const user = await UsersRepository.addUser({
			email: email.toLowerCase(),
			password: encryptedPassword,
			activationCode,
			activated: false
		});

		try {
			await this.sendVerificationMail(user.email, user.userId, activationCode);
		} catch (e) {
			logger.error('Can not send verification email', e);

			return res.status(400).send('Can not send verification email');
		}
		res.send(user);
	}

	async login(res, data) {
		const { email, password } = data;
		const user = await UsersRepository.getUser(email);

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
	}

	async verifyUser(res, user){
		const updateRequest = await UsersRepository.activateUser(user.userId);

		if (!updateRequest) {
			return res.status(500).send('Can\'t verify user');
		}

		//res.redirect(`${process.env.CLIENT_URL}/login`)
		res.send('Email verified successfully');
	}

	async sendVerificationMail(address, id, activationCode) {
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
}

const authService = new AuthService();

module.exports = AuthService;