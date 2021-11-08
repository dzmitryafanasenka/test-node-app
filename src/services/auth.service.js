const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const config = require('../config/index');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')('AuthService');
const ServiceError = require('../common/errors/ServiceError');
const UsersRepository = require('../repositories/users.repository').instance();

class AuthService {

	static instance() {
		return authService;
	}

	async signup(data) {
		const { email, password } = data;

		const existingUser = await UsersRepository.getUser(email);
		
		if (existingUser) {
			throw new ServiceError(409, 'User Already Exists. Please Login');
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const activationCode = crypto.randomBytes(32).toString('hex');
		
		const user = await UsersRepository.addUser({
			email: email.toLowerCase(),
			password: encryptedPassword,
			activationCode,
			activated: false
		});

		const publicUserData = {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};

		try {
			await this.sendVerificationMail(user.email, user.userId, activationCode);
		} catch (e) {
			logger.error('Can not send verification email', e);

			throw new ServiceError(417, 'Can not send verification email');
		}

		return publicUserData;
	}

	async login(data) {
		const { email, password } = data;
		const user = await UsersRepository.getUser(email);
		if (!user) {
			throw new ServiceError(404, 'User does not exist');
		}

		const userStatus = user && (await bcrypt.compare(password, user.password));
		
		if (userStatus) {
			if (!user.activated) {
				throw new ServiceError(403, 'User is not activated');
			}
			
			const publicUserData = {
				userId: user.userId,
				email: user.email,
				nickname: user.nickname,
				phone: user.phone
			};
			
			publicUserData.token = jwt.sign(
				{ userId: user.userId },
				config.jwt.secret,
				{
					expiresIn: config.jwt.exp
				}
			);

			return publicUserData;
		} else {
			throw new ServiceError(401, 'Invalid Credentials');
		}
	}

	async verifyUser(user, token) {
		if (user.activationCode !== token) {
			throw new ServiceError(401, 'Invalid Token');
		}
		
		const updateRequest = await UsersRepository.activateUser(user.userId);

		if (!updateRequest) {
			throw new ServiceError(500, 'Can\'t verify user');
		}

		return 'Email has been verified';
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