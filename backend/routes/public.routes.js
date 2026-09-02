const publicRouter = require('express').Router();
const logger = require('../utility/logger');
const applicationConstants = require('../utility/constants');
const authController = require("../controllers/auth.controller");
const validators = require("../validators/users.validators");

publicRouter.post("/login", validators.usersLoginValidator, authController.loginController);
publicRouter.post("/register", validators.usersRegisterValidator, authController.registerController);
publicRouter.post("/forgot-user", validators.usersForgotPasswordValidator, authController.forgotUsersController);
publicRouter.post("/twofactor-info", validators.twoFactorInfoValidator, authController.twoFactorInfoController);
publicRouter.post("/forgot-password", authController.forgotPasswordController);
publicRouter.post("/password-reset/:userId/:token", authController.resetPasswordController);
module.exports = publicRouter;
