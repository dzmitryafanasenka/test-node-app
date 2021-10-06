const app = require('express');

const logger = require('../../common/logger')('UsersController');
const UsersService = require('../../services/users.service');
const { authenticateToken } = require('../../middleware/auth');

const userRouter = app.Router();

userRouter.get('/', async (req, res) => {
	try {
		const data = await UsersService.instance().getAllUsers();
		res.send(data);
	} catch (error) {
		res.status(500).send('Can not get all users');
		logger.error('While getting all users', error);
	}
});

// TODO get ID from as path parameter. like /:id
userRouter.delete('/user', authenticateToken, async (req, res) => {
	try {
		const id = req.user.id;
		const user = await UsersService.instance().getUser(null, id);
		if (!user) return res.status(404).send('User does not exist');

		const deleteResult = await UsersService.instance().deleteUser(id);
		if (!deleteResult) return res.status(500).send('Can not delete user');

		res.send('User has been deleted');
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});


module.exports = userRouter;
