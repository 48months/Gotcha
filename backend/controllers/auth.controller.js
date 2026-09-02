const logger = require("../utility/logger");
const usersService = require("../services/users.service");
const allowanceService = require("../services/allowance.service");
const projectDetailsService = require("../services/project-details.service");
const holidayDetailsService = require("../services/holidays.service");
const adminMessageService = require("../services/admin.service");


exports.loginController = (req, res) => {
  usersService.login(req, res);
};

exports.registerController = (req, res) => {
  usersService.register(req, res);
};

exports.forgotUsersController = (req, res) => {
  usersService.forgotUsers(req, res);
};

exports.twoFactorInfoController = (req, res) => {
  usersService.twoFactorInfo(req, res);
};

exports.addCpyController = async (req, res) => {
  allowanceService.addCpyData(req, res);
};

exports.addSupportDataController = async (req, res) => {
  allowanceService.addSupportData(req, res);
};

exports.addShiftDataController = async (req, res) => {
  allowanceService.addShiftData(req, res);
};

exports.addOohDataController = async (req, res) => {
  allowanceService.addOohData(req, res);
};

exports.addOnCallDataController = async (req, res) => {
  allowanceService.addOnCallData(req, res);
};

exports.deleteCpyData = async (req, res) => {
  allowanceService.deleteCpyData(req, res);
};

exports.deleteSupportData = async (req, res) => {
  allowanceService.deleteSupportData(req, res);
};

exports.deleteShiftData = async (req, res) => {
  allowanceService.deleteShiftData(req, res);
};

exports.deleteOohData = async (req, res) => {
  allowanceService.deleteOohData(req, res);
};

exports.deleteOnCallData = async (req, res) => {
  allowanceService.deleteOnCallData(req, res);
};

exports.getUserData = async (req, res) => {
  allowanceService.getUserData(req, res);
};

exports.getAllUserData = async (req, res) => {
  allowanceService.getAllUserData
    (req, res);
};

exports.generateAllCpyReport = async (req, res) => {
  allowanceService.generateAllCpyReport(req, res);
};

exports.generateCpyReport = async (req, res) => {
  allowanceService.generateCpy(req, res);
};

exports.changeRoleController = async (req, res) => {
  allowanceService.changeRole(req, res);
};


exports.downloadCpyReport = (req, res) => {
  allowanceService.downloadCpyReport(req, res);
};

exports.forgotPasswordController = async (req, res) => {
  allowanceService.forgotPassword(req, res);
};

exports.resetPasswordController = async (req, res) => {
  allowanceService.checkForgotPasswordLink(req, res);
};

exports.activateUserAccountController = async (req, res) => {
  allowanceService.activatUserAccount(req, res);
};

exports.activateUserAccountController = async (req, res) => {
  allowanceService.activatUserAccount(req, res);
};

exports.addProjectDetailsController = async (req, res) => {
  projectDetailsService.addProjectDetails(req, res);
};

exports.editProjectDetailsController = async (req, res) => {
  projectDetailsService.editProjectDetails(req, res);
};

exports.getProjectDetailsController = async (req, res) => {
  projectDetailsService.getProjectDetails(req, res);
};

exports.addMessage = async (req, res) => {
  adminMessageService.addAdminMessage(req, res);
};


exports.getAllAdminMessage = async (req, res) => {
  adminMessageService.getAllAdminMessages(req, res);
};

exports.deleteProjectDetailsController = async (req, res) => {
  projectDetailsService.deleteProjectDetails(req, res);
};

exports.uploadFileController = async (req, res) => {
  projectDetailsService.uploadFile(req, res);
};

exports.addHolidayDetailsController = async (req, res) => {
  holidayDetailsService.addHolidayDetails(req, res);
};

exports.editHolidayDetailsController = async (req, res) => {
  holidayDetailsService.editHolidayDetails(req, res);
};

exports.getHolidayDetailsController = async (req, res) => {
  holidayDetailsService.getHolidayDetails(req, res);
};

exports.deleteHolidayDetailsController = async (req, res) => {
  holidayDetailsService.deleteHolidayDetails(req, res);
};
