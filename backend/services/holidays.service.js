const holidayDao = require("../database/holidays.dao");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");
multer = require('multer');

exports.addHolidayDetails = async (req, res) => {
    holidayDao.findHolidayByProjectType(req.body.projectType).then((data) => {
        if (data !== null) {
            return res
                .status(applicationConstants.HttpStatusCodes.badRequest)
                .json({ error: "Data already exists!" });
        } else {
            let holidayInfo = {
                "projectType": req.body.projectType,
                "dates": req.body.dates
            };
            // console.log(holidayDetailsData);
            holidayDao.save(holidayInfo).then((data) => {
                console.log(data);
                return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully Added" });
            })
                .catch((err) => {
                    logger.error(__filename, "error while adding the project details" + err);
                    return res
                        .status(
                            applicationConstants.HttpStatusCodes
                                .internalServerError
                        )
                        .json({ error: "Error while adding the project details" });
                });
            // }
        }
    });
};

exports.editHolidayDetails = async (req, res) => {
    let data = await holidayDao.findHolidayByProjectType(req.body.projectType)
    if (data !== undefined) {
        data.projectType = req.body.projectType;
        data.dates = req.body.dates;
        let result = await holidayDao.save(data);
        if (result) {
            return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully updated" });
        }
        else {
            logger.error(__filename, "Error while updating  the project details");
            return res
                .status(
                    applicationConstants.HttpStatusCodes
                        .internalServerError
                )
                .json({ error: "Error while updating the Holiday details" });
        }

    } else {
        return res.status(applicationConstants.HttpStatusCodes.badRequest).json({ message: "Can't find the data" });
    }

};

exports.deleteHolidayDetails = async (req, res) => {
    let data = await holidayDao.findHolidayByProjectType(req.body.projectType);
    console.log("inside");
    if (data) {
        let result = await holidayDao.deleteHolidayDetails(req.body.projectType);
        if (result) {
            return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully deleted" });
        }
        else {
            logger.error(__filename, "Error while deleting  the Holiday details");
            return res
                .status(
                    applicationConstants.HttpStatusCodes
                        .internalServerError
                )
                .json({ error: "Error while deleting the Holiday details" });
        }

    } else {
        return res.status(applicationConstants.HttpStatusCodes.badRequest).json({ message: "Can't find the data" });
    }

};

exports.getHolidayDetails = async (req, res) => {
    let data = await holidayDao.getHolidayDetails();
    if (data) {
        return res.status(applicationConstants.HttpStatusCodes.success).json({ message: data });
    }
    else {
        logger.error(__filename, "Error while fetching the holiday details");
        return res
            .status(
                applicationConstants.HttpStatusCodes
                    .internalServerError
            )
            .json({ error: "Error while fetching the holiday details" });
    }

};