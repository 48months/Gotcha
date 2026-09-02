const protectedRouter = require('express').Router();
const logger = require('../utility/logger');
const applicationConstants = require('../utility/constants');
const filter = require("../filters/role.filter");
const authController = require("../controllers/auth.controller");
const validators = require("../validators/users.validators");

protectedRouter.get("/", filter.userFilter, (req, res) => {
    logger.info(__filename, "This is a protected route");
    res.status(applicationConstants.HttpStatusCodes.success).json({ message: 'This is a protected route' });
});

protectedRouter.post("/addcpy", filter.userFilter, validators.usersAddCpyValidator, authController.addCpyController);
protectedRouter.post("/addsupportdata", filter.userFilter, validators.usersAddSupportDataValidator, authController.addSupportDataController);
protectedRouter.post("/addshiftdata", filter.userFilter, validators.usersAddShiftValidator, authController.addShiftDataController);
protectedRouter.post("/addoohdata", filter.userFilter, validators.usersAddOohValidator, authController.addOohDataController);
protectedRouter.post("/addoncalldata", filter.userFilter, validators.usersAddOnCallValidator, authController.addOnCallDataController);
protectedRouter.delete("/cpy:", filter.userFilter, authController.deleteCpyData);
protectedRouter.delete("/support", filter.userFilter, authController.deleteSupportData);
protectedRouter.delete("/shift", filter.userFilter, authController.deleteShiftData);
protectedRouter.delete("/ooh", filter.userFilter, authController.deleteOohData);
protectedRouter.delete("/oncall", filter.userFilter, authController.deleteOnCallData);
protectedRouter.get("/getuserdetails", filter.userFilter, authController.getUserData);
protectedRouter.get("/getprojectDetails", filter.userFilter, authController.getProjectDetailsController);
protectedRouter.post("/addmessage", filter.userFilter, authController.addMessage);
protectedRouter.get("/getalladminmessage", filter.userFilter, authController.getAllAdminMessage);

module.exports = protectedRouter;