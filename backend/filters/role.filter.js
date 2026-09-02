const usersDao = require("../database/users.dao");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");

exports.adminFilter = (req, res, next) => {
    usersDao.findById(req.data.id).then((data) => {
        if (data.role === "ADMIN") {
            req.data = data;
            next();
        } else {
            logger.debug(__filename, "Unauthorized! Not Admin.");
            return res
                .status(applicationConstants.HttpStatusCodes.unauthorized)
                .json({ error: "Unauthorized! Not Admin." });
        }
    }).catch((err) => {
        logger.debug(__filename, err);
        return res
            .status(applicationConstants.HttpStatusCodes.unauthorized)
            .json({ error: "Inavlid Authentication token" });
    });
};

exports.userFilter = (req, res, next) => {
    usersDao.findById(req.data.id).then((data) => {
        req.data = data;
        if (data.role === "USER" || data.role === "ADMIN") {
            next();
        } else {
            logger.debug(__filename, "Unauthorized! Unknown role.");
            return res
                .status(applicationConstants.HttpStatusCodes.unauthorized)
                .json({ error: "Unauthorized! Unknown role." });
        }
    }).catch((err) => {
        logger.debug(__filename, err);
        return res
            .status(applicationConstants.HttpStatusCodes.unauthorized)
            .json({ error: "Inavlid Authentication token" });
    });
};