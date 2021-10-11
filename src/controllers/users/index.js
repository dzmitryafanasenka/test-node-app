const app = require('express');
const joi = require('joi');

const logger = require('../../common/logger')('UsersController');
const userService = require('../../services/users.service').instance();
const userValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');

const userRouter = app.Router();

userRouter.get('/current', authenticateToken, async (req, res) => {
	try {
		await userService.getUser(res, req.user.userId);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error('While getting the user', error);
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

		await userService.updateUser(res, dataToUpdate);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error('While getting the user', error);
	}
});

userRouter.delete('/', authenticateToken, async (req, res) => {
	try {
		await userService.deleteUser(res, req.user.userId);
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});


module.exports = userRouter;
