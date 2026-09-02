const cryptoJS = require("crypto-js");


exports.encryptData = (unencryptedData) => {
    return cryptoJS.AES.encrypt(JSON.stringify(unencryptedData), process.env.JWT_SECRET_KEY).toString();
}

exports.decryptData = (encryptedData) => {
    const bytes = cryptoJS.AES.decrypt(encryptedData, process.env.JWT_SECRET_KEY);
    return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
};