const User = require('../models/user');

const initialUsers = [
  {
    username: 'toonie',
    name: 'Moon',
    password: '328382',
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers, usersInDb,
};
