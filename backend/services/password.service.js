const argon2 = require('argon2');
const logger = require("../utility/logger");

exports.encryptPassword = async (unencryptedPassword) => {
    try {
        return await argon2.hash(unencryptedPassword);
    } catch (err) {
        logger.error(__filename, "Encrypted password error " + err);
        return null;
    }
}

exports.verifyPassword = async (encryptedPassword, unencryptedPassword) => {
    try {
        if (await argon2.verify(encryptedPassword, unencryptedPassword)) {
            return true;
        } else {
            // password did not match
            return false;
        }
    } catch (err) {
        // internal failure
        return false;
    }
}