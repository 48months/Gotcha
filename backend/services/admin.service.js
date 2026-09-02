const adminDao = require("../database/admin.dao");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");


exports.addAdminMessage = async (req, res) => {
    let data = {
        "message": req.body.message
    };
    // console.log(holidayDetailsData);
    adminDao.save(data).then((data) => {
        return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully Added" });
    })
        .catch((err) => {
            logger.error(__filename, "error while adding the details" + err);
            return res
                .status(
                    applicationConstants.HttpStatusCodes
                        .internalServerError
                )
                .json({ error: "Error while adding the details" });
        });
};

exports.getAllAdminMessages = async (req, res) => {
    let data = await adminDao.getMessages();
    if (data) {
        let result = [];
        for (var i = 0; i < data.length; i++) {
            result[i] = data[i].message;
        }
        return res.status(applicationConstants.HttpStatusCodes.success).json({ message: result });
    }
    else {
        logger.error(__filename, "Error while fetching the details");
        return res
            .status(
                applicationConstants.HttpStatusCodes
                    .internalServerError
            )
            .json({ error: "Error while fetching the details" });
    }

};
