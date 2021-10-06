const log4js = require('log4js');

const config = require('../config');

const getLogger = (category) => {
	const logger = log4js.getLogger(category);
	
	logger.level = config.logger.debug ? log4js.levels.TRACE : log4js.levels.INFO;
	
	return logger;
};

module.exports = getLogger;