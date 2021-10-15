const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

const config = require('./index');
const logger = require('../common/logger')('Passport.js');
const UsersRepository = require('../repositories/users.repository').instance();

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwt.secret,
	algorithms: ['RS256', 'HS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {

	try {
		logger.debug(payload.userId);
		const user = await UsersRepository.getUser(null, payload.userId);
		logger.debug(user);
		if(user){
			return done(null, user);
		} else {
			return done(null, false);
		}
	} catch (error){
		done(error, null);
	}
});

module.exports = (passport) => {
	passport.use('jwt', strategy);
};