const logger = require("../utility/logger");
const Users = require("../models/users.model");

exports.save = async (saveUserData) => {
  const usersDao = new Users(saveUserData);
  return await usersDao.save();
};

exports.findIfExistsByUsername = async (username) => {
  return await Users.findOne({ username: username });
};

exports.deleteByUsername = (username) => {
  Users.remove({ username: username }, (err, data) => {
    if (err) logger.error(__filename, err);
    return data;
  });
};

exports.updateUserName = (username) => {
  Users.updateOne({ username: username }, (err, data) => {
    if (err) logger.error(__filename, err);
    return data;
  });
};

exports.changeRole = async (name) => {
  let result = await this.findUserByname(name);
  if (result.role == "USER") {
    return await Users.updateOne({ name: name }, { role: "ADMIN" })
  }

  return await Users.updateOne({ name: name }, { role: "USER" })

};

exports.activateAccount = async (name) => {
  let result = await this.findUserByname(name);
  if (result.emailVerified == false) {
    return await Users.updateOne({ name: name }, { emailVerified: true })
  }

  return await Users.updateOne({ name: name }, { emailVerified: false })

};

exports.updatePasswordByUsername = async (usersData) => {
  await Users.updateOne(
    { username: usersData.username }, { password: usersData.password }
  );
};

exports.updatePasswordById = async (id, password) => {
  await Users.updateOne(
    { _id: id }, { password: password }
  );
};

exports.findByUsername = async (username) => {
  return await Users.findOne({ username: username });
};

exports.setResetToken = async (token, username) => {
  return await Users.updateOne({ username: username }, { resetPasswordToken: token });

};

exports.findUserByname = async (name) => {
  return await Users.findOne({ name: name });
};

exports.findById = async (userId) => {
  return await Users.findById({ _id: userId });
};

exports.findByResetToken = async (token) => {
  return await Users.findOne({ resetPasswordToken: token });
};

exports.findByempId = async (empId) => {
  let result = await Users.findOne({ empId: empId });
  // console.log(result);
  return await Users.findOne({ empId: empId });
};

exports.getAll = async (req, res) => {
  let result = await Users.find();
  return await result;
};
