const Login = require("../models/login.model");
const usersDao = require("../database/users.dao");
const jwtService = require("../services/jwt.service");
const logger = require("../utility/logger");
const applicationConstants = require("../utility/constants");
const speakeasy = require("speakeasy");
const qrCode = require("qrcode");
const ForgotUsers = require("../models/forgot-users.model");
const passwordService = require("../services/password.service");
const argon2 = require('argon2');
const { HttpStatusCode } = require("axios");

exports.login = (req, res) => {
    const requestLoginData = new Login(req.body);
    authenticate(requestLoginData, res);
};

exports.register = (req, res) => {
    req.body.username = req.body.username.toLowerCase();
    const registerRequestData = new Login(req.body);
    registerUsers(registerRequestData, res);
};

exports.forgotUsers = (req, res) => {
    const forgotUsersRequestData = new ForgotUsers(req.body);
    forgotUsers(forgotUsersRequestData, res);
};

exports.twoFactorInfo = (req, res) => {
    let twoFactorInfo = usersDao.findIfExistsByUsername(req.body.username);
    twoFactorInfo.then((data) => {
        if (data.twofactorEnabled == true && data.emailVerified == true) {
            res.status(applicationConstants.HttpStatusCodes.success).json({
                message: "true"
            })
        }
        else {
            res.status(applicationConstants.HttpStatusCodes.success).json({
                message: "false"
            })
        }
    })
        .catch(error => {
            logger.error(__filename,
                "Error while checking for user " + req.body.username + " !" + error
            );
            return res
                .status(applicationConstants.HttpStatusCodes.unauthorized)
                .json({ error: "Please check username and try again!" });
        });
};

function authenticate(loginData, res) {
    let checkIfUsernameExists = usersDao.findByUsername(loginData.username);

    checkIfUsernameExists
        .then((data) => {
            passwordService.verifyPassword(data.password, loginData.password).then(
                (arePasswordMatch) => {
                    if (data.username === loginData.username) {
                        if (arePasswordMatch) {
                            if (data.twofactorEnabled) {
                                const is2FAVerified = speakeasy.totp.verify({
                                    secret: data.twofactorSecretToken,
                                    encoding: "base32",
                                    token: loginData.twofactorLoginToken,
                                });
                                if (data.emailVerified) {
                                    if (is2FAVerified) {
                                        const jwtToken = jwtService.generateToken({ id: data._id });
                                        if (jwtToken !== null) {
                                            return res
                                                .status(applicationConstants.HttpStatusCodes.success)
                                                .json({ message: jwtToken, name: data.name, username: data.username, empId: data.empId, role: data.role, emailVerified: data.emailVerified });
                                        } else {
                                            return res
                                                .status(applicationConstants.HttpStatusCodes.internalServerError)
                                                .json({ error: "Unable to generate token" });
                                        }
                                    } else {
                                        logger.error(__filename, "Error while authenticate user");
                                        return res
                                            .status(
                                                applicationConstants.HttpStatusCodes.unauthorized
                                            )
                                            .json({ error: "enter valid two factor code" });
                                    }
                                } else {
                                    logger.error(__filename, "Users " + data.username + "email not verified!");
                                    return res
                                        .status(
                                            applicationConstants.HttpStatusCodes.unauthorized
                                        )
                                        .json({ error: "Email not verified!" });
                                }
                            } else {
                                const jwtToken = jwtService.generateToken({ id: data._id });
                                if (jwtToken !== null) {
                                    return res
                                        .status(applicationConstants.HttpStatusCodes.success)
                                        .json({ message: jwtToken, name: data.name, username: data.username, empId: data.empId, role: data.role, emailVerified: data.emailVerified });

                                } else {
                                    return res
                                        .status(applicationConstants.HttpStatusCodes.internalServerError)
                                        .json({ error: "Unable to generate token" });
                                }
                            }
                        } else {
                            logger.error(__filename,
                                "Wrong password entered by user " + loginData.username + " !"
                            );
                            return res
                                .status(
                                    applicationConstants.HttpStatusCodes.unauthorized
                                )
                                .json({ error: "Please check password and try again!" });
                        }
                    } else {
                        logger.error(__filename,
                            "Wrong username entered by user " + loginData.username + " !"
                        );
                        return res
                            .status(applicationConstants.HttpStatusCodes.unauthorized)
                            .json({ error: "Please check username and try again!" });
                    }
                }).catch((err) => {
                    return res
                        .status(applicationConstants.HttpStatusCodes.internalServerError)
                        .json({ error: "Unable to login! Please try again later." });
                });
        })
        .catch(error => {
            logger.error(__filename,
                "Error while checking for user " + loginData.username + " !" + error
            );
            return res
                .status(applicationConstants.HttpStatusCodes.unauthorized)
                .json({ error: "Please check username and try again!" });
        });
}

async function registerUsers(registerData, res) {
    usersDao.findIfExistsByUsername(registerData.username).then((data) => {
        if (data) {
            return res
                .status(applicationConstants.HttpStatusCodes.badRequest)
                .json({ error: "User already exists!" });
        } else {
            if (registerData.twofactorEnabled) {
                const secret = speakeasy.generateSecret({ name: process.env.APP_NAME });
                registerData.twofactorSecretToken = secret.base32;
                passwordService.encryptPassword(registerData.password).then(
                    (encryptedPassword) => {
                        registerData.password = encryptedPassword;
                        usersDao
                            .save(registerData)
                            .then((data) => {
                                qrCode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
                                    if (err) {
                                        logger.error(__filename, "Error while registering user" + err);
                                        return res
                                            .status(
                                                applicationConstants.HttpStatusCodes.unauthorized
                                            )
                                            .send({ error: "Error while registering user" });
                                    } else {
                                        // sendEmail(registerData.username, "Verify Account!", { verificationLink: null, name: registerData.name });
                                        return res
                                            .status(
                                                applicationConstants.HttpStatusCodes.success
                                            )
                                            .json({ message: imageUrl });
                                    }
                                });
                            })
                            .catch((err) => {
                                logger.error(__filename, "Error while registering user" + err);
                                res
                                    .status(
                                        applicationConstants.HttpStatusCodes
                                            .internalServerError
                                    )
                                    .json({ error: "Error while registering user" });
                            });
                    }).catch(err => {
                        logger.error(__filename, "Error while registering user" + err);
                        res
                            .status(
                                applicationConstants.HttpStatusCodes
                                    .internalServerError
                            )
                            .json({ error: "Error while registering user" });
                    });

            } else {
                passwordService.encryptPassword(registerData.password).then(
                    (encryptedPassword) => {
                        registerData.password = encryptedPassword;
                        usersDao
                            .save(registerData)
                            .then((data) => {
                                // sendEmail(registerData.username, "Verify Account!", { verificationLink: null, name: registerData.name });
                                return res
                                    .status(applicationConstants.HttpStatusCodes.success)
                                    .json({ message: "Successfully registered user" });
                            })
                            .catch((err) => {
                                logger.error(__filename, "Error while registering user" + err);
                                return res
                                    .status(
                                        applicationConstants.HttpStatusCodes
                                            .internalServerError
                                    )
                                    .json({ error: "Error while registering user" });
                            });
                    });
            }
        }
    });
}

function forgotUsers(forgotUsersRequestData, res) {
    let checkIfUsernameExists = usersDao.findByUsername(
        forgotUsersRequestData.username
    );
    checkIfUsernameExists
        .then(async (userData) => {
            if (userData.password === forgotUsersRequestData.password) {
                return res
                    .status(applicationConstants.HttpStatusCodes.badRequest)
                    .json({
                        error:
                            "Passwords are same as earlier, please enter a differnt password and try again!",
                    });
            }
            else {
                // if (userData.twofactorEnabled) {

                //     if (forgotUsersRequestData.twofactorLoginToken !== undefined) {

                //         const is2FAVerified = speakeasy.totp.verify({
                //             secret: userData.twofactorSecretToken,
                //             encoding: "base32",
                //             token: forgotUsersRequestData.twofactorLoginToken,
                //         });

                //         if (is2FAVerified) {
                //             console.log("inside");
                //             usersDao
                //                 .updatePasswordByUsername(forgotUsersRequestData)
                //                 .then((data) => {
                //                     res
                //                         .status(applicationConstants.HttpStatusCodes.success)
                //                         .json({
                //                             error: "Users data updated",
                //                         });
                //                 })
                //                 .catch((err) => {
                //                     logger.error(__filename, "Error while updating users data " + err);
                //                     res
                //                         .status(
                //                             applicationConstants.HttpStatusCodes
                //                                 .internalServerError
                //                         )
                //                         .json({
                //                             error: "Error while updating users data",
                //                         });
                //                 });
                //         } else {
                //             res.status(applicationConstants.HttpStatusCodes.badRequest).json({ error: "Invalid token" });
                //         }
                //     } else {
                //         res.status(applicationConstants.HttpStatusCodes.badRequest).json({ error: "Invalid token" });
                //     }
                // } else {
                forgotUsersRequestData.password = await argon2.hash(forgotUsersRequestData.password);
                usersDao
                    .updatePasswordByUsername(forgotUsersRequestData)
                    .then((data) => {
                        return res
                            .status(applicationConstants.HttpStatusCodes.success)
                            .json({
                                message: "Users data updated",
                            });
                    })
                    .catch((err) => {
                        logger.error(__filename, "Error while updating users data " + err);
                        res
                            .status(
                                applicationConstants.HttpStatusCodes
                                    .internalServerError
                            )
                            .json({
                                error: "Error while updating users data",
                            });
                    });
                // }
            }
        })
        .catch((err) => {
            logger.error(__filename, "Error while fetching users data " + err);
            res
                .status(applicationConstants.HttpStatusCodes.unauthorized)
                .json({
                    error: "Username does not exist!",
                });
        });


}


