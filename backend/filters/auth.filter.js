const jwt = require("../services/jwt.service");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");
const encrypterUtil = require('../utility/data-encrypter');

const httpAuthFilter = (req, res, next) => {
    if (!req.header("Authorization") || req.header("Authorization").indexOf("Bearer ")) {
        logger.debug(__filename, "Bearer token is missing in the request header");
        return res.status(applicationConstants.HttpStatusCodes.unauthorized)
            .json({ message: "Auth code is missing" });
    }
    let token;
    try {
        token = jwt.verifyToken(req.header("Authorization").split(" ")[1]);
    } catch (err) {
        logger.debug(__filename, "Invalid bearer token in the request header");
        return res
            .status(applicationConstants.HttpStatusCodes.unauthorized)
            .json({ error: "Inavlid Authentication token" });
    }
    if (!token) {
        logger.debug(__filename, "Invalid bearer token in the request header unauthorized");
        return res
            .status(applicationConstants.HttpStatusCodes.unauthorized)
            .json({ error: "Unauthenticated!" });
    }
    req.data = encrypterUtil.decryptData(token.data);
    next();
};

module.exports = httpAuthFilter;
