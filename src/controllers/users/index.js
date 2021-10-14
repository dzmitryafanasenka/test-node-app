const app = require('express');
const joi = require('joi');

const logger = require('../../common/logger')('UsersController');
const ServiceError = require('../../common/errors/ServiceError');
const userService = require('../../services/users.service').instance();
const userValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');

const userRouter = app.Router();

userRouter.get('/current', authenticateToken, async (req, res) => {
	try {
		const response = await userService.getUser(req.user.userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

userRouter.patch('/current', authenticateToken, async (req, res) => {
	try {
		const { nickname, phone } = req.body;
		const { userId } = req.user;

		const dataToUpdate = { nickname, phone, userId };

		try {
			joi.assert(dataToUpdate, userValidator.updateUserValidation);
		} catch (validationError) {
			return res.status(400).send('Invalid data');
		}

		const response = await userService.updateUser(dataToUpdate);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

userRouter.delete('/current', authenticateToken, async (req, res) => {
	try {
		const response = await userService.deleteUser(req.user.userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});


module.exports = userRouter;
