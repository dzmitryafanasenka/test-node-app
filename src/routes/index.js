const {usersRoute} = require('./users/index')

function applyRoutes(app) {
  usersRoute(app);
}

module.exports = {
  applyRoutes
}