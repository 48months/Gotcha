const jwt = require('jsonwebtoken');
const encrypterUtil = require('../utility/data-encrypter');
const logger = require('../utility/logger');

exports.generateToken = (data) => {
    try {
        return jwt.sign({
            data: encrypterUtil.encryptData(data)
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY_TIME, algorithm: 'HS512' });
    }
    catch (err) {
        logger.error(__filename, err);
        return null;
    }
};


exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};