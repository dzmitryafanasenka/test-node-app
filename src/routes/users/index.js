const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const logger = require('../../logger');
const sendVerificationMail = require('../../mail');
const { addUser, getAllUsers, getUser } = require('../../db/users/index');
const { authenticateToken } = require('../../middleware/auth');

function usersRoute(router) {
	router.get('/', async (req, res) => {
		try {
			const data = await getAllUsers();
			res.send(data);
		} catch (error) {
			res.sendStatus(500);
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
			const user = await addUser({
				email: email.toLowerCase(),
				password: encryptedPassword
			});

			const token = jwt.sign(
				{ id: user.id, email },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '5m'
				}
			);
			user.token = token;
			sendVerificationMail(user.email).catch((e) => logger.error(e));
			res.status(201).json(user);
		} catch (error) {
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
						expiresIn: '5m'
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

}

module.exports = {
	usersRoute
};