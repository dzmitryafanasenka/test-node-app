const app = require('express');
const joi = require('joi');

const auth = require('../../middleware/auth');
const logger = require('../../common/logger')('UsersController');
const ServiceError = require('../../common/errors/ServiceError');
const userService = require('../../services/users.service').instance();
const userValidator = require('./validation/index');

const userRouter = app.Router();

userRouter.get('/', auth, async (req, res) => {
	try {
		logger.debug('Getting all users.');
		
		const response = await userService.getAllUsers();
		if (!response) {
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

userRouter.get('/:userId', auth, async (req, res) => {
	try {
		const { userId } = req.params;

		logger.debug(`Getting the user - [ ${userId} ].`);
		
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

userRouter.patch('/:userId', auth, async (req, res) => {
	try {
		const { nickname, phone } = req.body;
		const { userId } = req.user;

		logger.debug(`Updating the user - [ ${userId} ].`);

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

userRouter.delete('/:userId', auth, async (req, res) => {
	try {
		const { userId } = req.params;

		logger.debug(`Deleting the user - [ ${userId} ].`);

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
