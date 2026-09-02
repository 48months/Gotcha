const logger = require("../utility/logger");
const Users = require("../models/users.model");

exports.save = async (saveUserData) => {
    const usersDao = new Users(saveUserData);
    return await usersDao.save();
};

exports.update = async (empId, data) => {
    Users.findOneAndUpdate({ empId: empId }, data, { upsert: true });
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

exports.findByempId = async (empId) => {
    return await Users.findOne({ empId: empId });
};
