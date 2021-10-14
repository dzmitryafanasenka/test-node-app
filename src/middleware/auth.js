const jwt = require('jsonwebtoken');

const config = require('../config/index');
const logger = require('../common/logger')('AuthMiddleware');
const UsersRepository = require('../repositories/users.repository').instance();

async function authenticateToken(req, res, next) {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (!token) return res.status(403).send('A token is required for authentication');

	try {
		const decoded = jwt.verify(token, config.jwt.secret);
		logger.debug(decoded);

		const user = await UsersRepository.getUser(null, decoded.userId);
		if(!user){
			return res.status(401).send('Invalid Token');
		}

		req.user = user;
	} catch (error) {
		return res.status(401).send('Invalid Token');
	}

	return next();
}

module.exports = { authenticateToken };