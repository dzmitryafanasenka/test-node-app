const {addUser, getAllUsers} = require('../../db/users/index')

function usersRoute(router) {
  router.get('/', async (req, res) => {
    const data = await getAllUsers()
    res.send(data);
  });
  router.post('/', (req, res) => {
    addUser(req.body);
    res.send('Done!');
  });
}

module.exports = {
  usersRoute
}