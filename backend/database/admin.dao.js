const adminMessage = require("../models/admin-schema.model");

exports.save = async (data) => {
    console.log(data + "Inside");
    const adminDao = new adminMessage(data);
    return await adminDao.save();
};

exports.getMessages = async () => {
    return await adminMessage.find();
};

exports.deleteHolidayDetails = async (projectType) => {
    return await holidaysDetails.deleteOne({ projectType: projectType });
};