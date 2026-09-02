const holidaysDetails = require("../models/holiday-schema.model");

exports.save = async (saveHolidayDetails) => {
    const holidayDao = new holidaysDetails(saveHolidayDetails);
    console.log(saveHolidayDetails);
    return await holidayDao.save();
};

exports.updateByProjectType = async (projectType, dates) => {
    return await holidaysDetails.findOneAndUpdate({ projectType: projectType }, { dates: dates });
};

exports.findHolidayByProjectType = async (projectType) => {
    return await holidaysDetails.findOne({ projectType: projectType });
};

exports.getHolidayDetails = async () => {
    return await holidaysDetails.find();
};

exports.deleteHolidayDetails = async (projectType) => {
    return await holidaysDetails.deleteOne({ projectType: projectType });
};