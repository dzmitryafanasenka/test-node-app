const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const logger = require('../../logger');
const sendVerificationMail = require('./verificationEmail');
const { addUser, activateUser, getAllUsers, getUser } = require('../../models/users/index');
const { authenticateToken } = require('../../middleware/auth');
const { deleteUser } = require('../../models/users');

function usersRoute(router) {
	router.get('/users', async (req, res) => {
		try {
			const data = await getAllUsers();
			res.send(data);
		} catch (error) {
			res.status(500).send('Can not get all users');
			logger.error('While getting all users', error);
		}
	});

	router.post('/register', async (req, res) => {
		try {
			const { email, password } = req.body;
			if (!(email && password)) {
				res.status(400).send('All input is required!');
			}

			const existingUser = await getUser(email);
			if (existingUser) {
				return res.status(409).send('User Already Exists. Please Login');
			}

			const encryptedPassword = await bcrypt.hash(password, 10);
			const activationCode = crypto.randomBytes(32).toString('hex');
			const user = await addUser({
				email: email.toLowerCase(),
				password: encryptedPassword,
				activationCode,
				activated: false
			});

			const token = jwt.sign(
				{ id: user.id, email },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: process.env.TOKEN_EXPIRE_TIME
				}
			);
			user.token = token;
			try {
				await sendVerificationMail(user.email, user.id, activationCode);
			} catch (e) {
				logger.error('Can not send verification email', e);

				return res.status(400).send('Can not send verification email');
			}
			res.status(201).json(user);
		} catch (error) {
			res.status(400).send('An error occurred');
			logger.error(error);
		}
	});

	router.post('/login', async (req, res) => {
		try {
			const { email, password } = req.body;

			if (!(email && password)) {
				res.status(400).send('All input is required');
			}

			const user = await getUser(email);

			const userStatus = user && (await bcrypt.compare(password, user.password));
			if (userStatus) {
				const token = jwt.sign(
					{ id: user.id, email },
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: process.env.TOKEN_EXPIRE_TIME
					}
				);

				user.token = token;
				res.status(200).json(user);
			} else {
				res.status(400).send('Invalid Credentials');
			}
		} catch (error) {
			logger.error(error);
		}
	});

	router.post('/', (req, res) => {
		addUser(req.body);
		res.send('Done!');
	});

	router.get('/verify/:id/:token', async (req, res) => {
		try {
			const user = await getUser(null, req.params.id);
			if (!user) return res.status(400).send('Invalid link');

			const token = user.activationCode;
			if (!token) return res.status(400).send('Invalid link');

			const updateRequest = await activateUser(user.id);

			if (!updateRequest) return res.status(500).send('Can\'t verify user');
			//res.redirect(`${process.env.CLIENT_URL}/login`)
			res.send('Email verified successfully');
		} catch (error) {
			res.status(400).send('An error occurred');
			logger.error(error);
		}
	});

	router.delete('/user', authenticateToken, async (req, res) => {
		try {
			const id = req.user.id;
			const user = await getUser(null, id);
			if (!user) return res.status(404).send('User does not exist');

			const deleteResult = await deleteUser(id);
			if (!deleteResult) return res.status(500).send('Can not delete user');

			res.send('User has been deleted');
		} catch (error) {
			res.status(400).send('An error occurred');
			logger.error(error);
		}
	});

}

module.exports = {
	usersRoute
};