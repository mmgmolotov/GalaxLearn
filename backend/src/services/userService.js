const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  const user = new User(userData);
  return await user.save();
};

exports.authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};

exports.getAllUsers = async () => {
  return await User.find();
};
