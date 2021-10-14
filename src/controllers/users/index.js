const app = require('express');
const joi = require('joi');

const logger = require('../../common/logger')('UsersController');
const ServiceError = require('../../common/errors/ServiceError');
const userService = require('../../services/users.service').instance();
const userValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');

const userRouter = app.Router();

userRouter.get('/', authenticateToken, async (req, res) => {
	try {
		const response = await userService.getAllUsers();
		if(!response){
			res.status(500).send('Internal Server Error');
		}

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

userRouter.get('/:userId', authenticateToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const response = await userService.getUser(userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

userRouter.patch('/:userId', authenticateToken, async (req, res) => {
	try {
		const { nickname, phone } = req.body;
		const { userId } = req.user;

		if (userId !== req.params.userId) {
			return res.status(403).send('Forbidden');
		}

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

userRouter.delete('/:userId', authenticateToken, async (req, res) => {
	try {
		const { userId } = req.params;

		if (req.user.userId !== userId) {
			return res.status(403).send('Forbidden');
		}

		const response = await userService.deleteUser(userId);

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
