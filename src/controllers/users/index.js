const app = require('express');
const joi = require('joi');

const logger = require('../../common/logger')('UsersController');
const userService = require('../../services/users.service').instance();
const userValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');

const userRouter = app.Router();

userRouter.get('/current', authenticateToken, async (req, res) => {
	try {
		const response = await userService.getUser(req.user.userId);
		res.send (response);
	} catch (error) {
		if (error.status && error.message){
			res.status(error.status).send(error.message);
		} else {
			res.status(500).send('Unknown error');
			logger.error('While getting the user', error);
		}
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

		try {
			const response = await userService.updateUser(dataToUpdate);
			res.send(response);
		} catch (serviceError) {
			return res.status(serviceError.status).send(serviceError.message);
		}

	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error('While getting the user', error);
	}
});

userRouter.delete('/current', authenticateToken, async (req, res) => {
	try {
		const response = await userService.deleteUser(req.user.userId);
		res.send(response);
	} catch (error) {
		if (error.status && error.message){
			res.status(error.status).send(error.message);
		} else {
			res.status(500).send('Unknown error');
			logger.error('While deleting the user', error);
		}
	}
});


module.exports = userRouter;
