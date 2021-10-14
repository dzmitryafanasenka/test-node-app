class ServiceError {
	constructor(status, message) {
		this.error = {
			status, message
		};
	}
}

module.exports = ServiceError;