const {userImage} = require('../index');

async function addUser(data) {
  const result = await userImage.create({
    id: data.id,
    email: data.email,
    password: data.password,
    nickname: data.nickname
  });
  return result;
}

async function getAllUsers() {
  return new Promise(async (resolve, reject) => {
    const result = await userImage.findAll();
    resolve(result);
  })
}

module.exports = {
  addUser,
  getAllUsers
};