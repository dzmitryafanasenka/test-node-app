const app = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const AuthService = require('../../services/auth.service').instance();
const authValidator = require('./validation/index');
const logger = require('../../common/logger')('AuthController');
const UsersRepository = require('../../repositories/users.repository').instance();

const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.signUpValidation);
		} catch (validationError) {
			return res.status(400).send(validationError.details);
		}

		try {
			const response = await AuthService.signup({ email, password });
			res.send(response);
		} catch (serviceError){
			res.status(serviceError.status).send(serviceError.message);
		}

	} catch (error) {
		logger.error(error);

		return res.status(500).send('An error occurred');
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

		try {
			const response = await AuthService.login({ email, password });
			res.send(response);
		} catch (serviceError){
			res.status(serviceError.status).send(serviceError.message);
		}

	} catch (error) {
		logger.error(error);

		return res.status(500).send('An error occurred');
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const user = req.user;

		const userVerificationData = user && {
			userId: user.userId,
			email: user.email,
			activationCode: user.activationCode,
			activated: user.activated
		};

		try {
			joi.assert(userVerificationData, authValidator.verifyValidation);
		} catch (verificationError) {
			logger.error('Validation failed at the verification method', verificationError);

			return res.status(400).send('Invalid link');
		}

		try {
			const response = await AuthService.verifyUser(user);
			res.send(response);
		} catch (serviceError) {
			res.status(serviceError.status).send(serviceError.message);
		}
		//res.redirect(`${config.app.client.url}/login`)

	} catch (error) {
		logger.error(error);

		return res.status(500).send('An error occurred');
	}
});

module.exports = authRouter;