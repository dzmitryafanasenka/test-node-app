const { postsRoute } = require('./posts/index');
const { usersRoute } = require('./users/index');

function applyRoutes(app) {
	usersRoute(app);
	postsRoute(app);
}

module.exports = {
	applyRoutes
};