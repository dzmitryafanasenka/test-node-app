const express = require('express');
require('dotenv').config();

const logger = require('./logger');
const { addUser } = require('./db/users/index');

const PORT = process.env.PORT || 8080;

class App {
	constructor() {
		this.express = new express();
		this.express.use(express.json());
		this.express.post('/', (req, res) => {
			addUser(req.body);
			res.send('Done!');
		});

		this.express.listen(PORT, () => {
			logger.info(`Server has succesfully started on port ${PORT}`);
		});
	}


}

module.exports = App;