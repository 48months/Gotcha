const Joi = require("joi");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");

exports.usersLoginValidator = async (req, res, next) => {
  const isUserRequestValid = await usersLoginSchema.validate(req.body);
  if (!isUserRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Login model validation error " + isUserRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserRequestValid.error.details[0].message });
  }
};

exports.usersRegisterValidator = async (req, res, next) => {
  const isUserRegisterRequestValid = await usersRegisterSchema.validate(
    req.body
  );
  if (!isUserRegisterRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Register model validation error " +
      isUserRegisterRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserRegisterRequestValid.error.details[0].message });
  }
};

exports.usersForgotPasswordValidator = async (req, res, next) => {
  const isForgotUsersPasswordValid = await usersForgotSchema.validate(req.body);
  if (!isForgotUsersPasswordValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users forgot model validation error " + isForgotUsersPasswordValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isForgotUsersPasswordValid.error.details[0].message });
  }
};

exports.usersAddCpyValidator = async (req, res, next) => {
  const isUserCpyDataRequestValid = await usersCpySchema.validate(
    req.body.userCPY[0]
  );
  if (!isUserCpyDataRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users CPY model validation error " + isUserCpyDataRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserCpyDataRequestValid.error.details[0].message });
  }
};

exports.usersAddSupportDataValidator = async (req, res, next) => {
  const isUserSupportDataRequestValid = await usersSupportDataSchema.validate(
    req.body.userCPY[0]
  );
  if (!isUserSupportDataRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Support model validation error " +
      isUserSupportDataRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserSupportDataRequestValid.error.details[0].message });
  }
};

exports.usersAddShiftValidator = async (req, res, next) => {
  const isUserShiftDataRequestValid = await usersShiftDataSchema.validate(
    req.body.userCPY[0]
  );
  if (!isUserShiftDataRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Shift model validation error " + isUserShiftDataRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserShiftDataRequestValid.error.details[0].message });
  }
};

exports.usersAddOohValidator = async (req, res, next) => {
  const isUserOohDataRequestValid = await usersOohDataSchema.validate(
    req.body.userCPY[0]
  );
  if (!isUserOohDataRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Ooh model validation error " + isUserOohDataRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserOohDataRequestValid.error.details[0].message });
  }
};

exports.usersAddOnCallValidator = async (req, res, next) => {
  const isUserOnCallDataRequestValid = await usersOnCallDataSchema.validate(
    req.body.userCPY[0]
  );
  if (!isUserOnCallDataRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Users Oncall model validation error " +
      isUserOnCallDataRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isUserOnCallDataRequestValid.error.details[0].message });
  }
};

exports.getUserData = async (req, res, next) => {
  const isGetUserRequestValid = await getUserData.validate(req.body);
  if (!isGetUserRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Get user model validation error " + isGetUserRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isGetUserRequestValid.error.details[0].message });
  }
};

exports.generateCpyReportValidator = async (req, res, next) => {
  const isGenerateRportRequestValid = await generateReport.validate(req.body);
  if (!isGenerateRportRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Generate Cpy Report model validation error " + isGenerateRportRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isGenerateRportRequestValid.error.details[0].message });
  }
};

exports.generateSingleCpyReportValidator = async (req, res, next) => {
  const isGenerateSingleRportRequestValid = await generateSingleReport.validate(req.body);
  if (!isGenerateSingleRportRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Generate Cpy Report model validation error " + isGenerateSingleRportRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isGenerateSingleRportRequestValid.error.details[0].message });
  }
};

exports.changeRoleValidator = async (req, res, next) => {
  const isChangeRoleRequestValid = await changeRole.validate(req.body);
  if (!isChangeRoleRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Change Role model validation error " + isChangeRoleRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isChangeRoleRequestValid.error.details[0].message });
  }
};

exports.activateAccountValidator = async (req, res, next) => {
  const isActivateAccoountRequestValid = await activateAccount.validate(req.body);
  if (!isActivateAccoountRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Activate account model validation error " + isActivateAccoountRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isActivateAccoountRequestValid.error.details[0].message });
  }
};

exports.addProjectDetailsValidator = async (req, res, next) => {
  const isAddProjectDeatilsRequestValid = await addProjectDeatils.validate(req.body);
  if (!isAddProjectDeatilsRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Activate account model validation error " + isAddProjectDeatilsRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isAddProjectDeatilsRequestValid.error.details[0].message });
  }
};

exports.editProjectDetailsValidator = async (req, res, next) => {
  const isEditProjectDeatilsRequestValid = await editProjectDeatils.validate(req.body);
  if (!isEditProjectDeatilsRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Activate account model validation error " + isEditProjectDeatilsRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isEditProjectDeatilsRequestValid.error.details[0].message });
  }
};

exports.twoFactorInfoValidator = async (req, res, next) => {
  const isTwoFactorRequestValid = await twoFactorSchema.validate(req.body);
  if (!isTwoFactorRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Get user model validation error " + isTwoFactorRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isTwoFactorRequestValid.error.details[0].message });
  }
};

exports.addHolidayDetailsValidator = async (req, res, next) => {
  const isAddHolidayDeatilsRequestValid = await addHolidayDeatils.validate(req.body);
  if (!isAddHolidayDeatilsRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Activate account model validation error " + isAddHolidayDeatilsRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isAddHolidayDeatilsRequestValid.error.details[0].message });
  }
};

exports.editHolidayetailsValidator = async (req, res, next) => {
  const isEditHolidayDeatilsRequestValid = await editHolidayDeatils.validate(req.body);
  if (!isEditHolidayDeatilsRequestValid.error) {
    next();
  } else {
    logger.error(
      __filename,
      "Activate account model validation error " + isEditHolidayDeatilsRequestValid.error
    );
    res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: isEditHolidayDeatilsRequestValid.error.details[0].message });
  }
};

const usersRegisterSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  empId: Joi.number().required(),
  twofactorEnabled: Joi.boolean().required(),
});

const usersCpySchema = Joi.object({
  month: Joi.date().required(),
  projectDetails: Joi.object().required(),
  name: Joi.string()
});

const usersSupportDataSchema = Joi.object({
  month: Joi.string().required(),
  supportAllowance: Joi.array().required(),
  name: Joi.string()
});

const usersShiftDataSchema = Joi.object({
  month: Joi.string().required(),
  shiftAllowance: Joi.array().required(),
  name: Joi.string()
});

const usersOohDataSchema = Joi.object({
  month: Joi.string().required(),
  ooh: Joi.array().required(),
  name: Joi.string()
});

const usersOnCallDataSchema = Joi.object({
  month: Joi.string().required(),
  oncall: Joi.array().required(),
  name: Joi.string()
});

const usersLoginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
  twofactorLoginToken: Joi.number(),
});

const usersForgotSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
  twofactorLoginToken: Joi.number()
});

const getUserData = Joi.object({
  name: Joi.string().required(),
});

const generateReport = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
  projectName: Joi.string().required(),
  projectType: Joi.string().required()
});

const generateSingleReport = Joi.object({
  empId: Joi.string().required(),
  userCPY: Joi.array().required(),
  projectName: Joi.string().required()
});

const changeRole = Joi.object({
  name: Joi.string().required()
});

const activateAccount = Joi.object({
  name: Joi.string().required()
});

const addProjectDeatils = Joi.object({
  projectName: Joi.string().required(),
  year: Joi.string().required(),
  componentId: Joi.array().required()
});

const addHolidayDeatils = Joi.object({
  projectType: Joi.string().required(),
  dates: Joi.array().required()
});

const editProjectDeatils = Joi.object({
  projectName: Joi.string().required(),
  year: Joi.string().required(),
  componentId: Joi.array().required()
});

const editHolidayDeatils = Joi.object({
  projectType: Joi.string().required(),
  dates: Joi.array().required()
});


const twoFactorSchema = Joi.object({
  username: Joi.string().required()
});
