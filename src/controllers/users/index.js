const app = require('express');

const logger = require('../../common/logger')('UsersController');
const userService = require('../../services/users.service').instance();
const { authenticateToken } = require('../../middleware/auth');


const userRouter = app.Router();

userRouter.get('/', async (req, res) => {
	try {
		const data = await userService.getAllUsers();
		res.send(data);
	} catch (error) {
		res.status(500).send('Can not get all users');
		logger.error('While getting all users', error);
	}
});

userRouter.delete('/', authenticateToken, async (req, res) => {
	try {
		const userId = req.user.userId;
		const user = await userService.getUser(null, userId);
		if (!user) return res.status(404).send('User does not exist');

		const deleteResult = await userService.deleteUser(userId);
		if (!deleteResult) return res.status(500).send('Can not delete user');

		res.send('User has been deleted');
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});


module.exports = userRouter;
