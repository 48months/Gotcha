const adminRouter = require('express').Router();
const logger = require('../utility/logger');
const applicationConstants = require('../utility/constants');
const filter = require("../filters/role.filter");
const authController = require("../controllers/auth.controller");
const validator = require("../validators/users.validators");
const multer = require('multer');
const path = require('path');

adminRouter.get("/", filter.adminFilter, (req, res) => {
    logger.info(__filename, "This is a admin route");
    res.status(applicationConstants.HttpStatusCodes.success)
        .json({ message: 'This is a admin route' });
});

const PATH = 'files/report';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        this.fileName = file.fieldname;
        cb(null, file.originalname)
    }
});

let upload = multer({
    storage: storage
});

adminRouter.get("/getalluserdetails", filter.adminFilter, authController.getAllUserData);
adminRouter.post("/generateallcpy", filter.adminFilter, validator.generateCpyReportValidator, authController.generateAllCpyReport);
adminRouter.post("/generatecpy", filter.adminFilter, validator.generateSingleCpyReportValidator, authController.generateCpyReport);
adminRouter.post("/changerole", filter.adminFilter, validator.changeRoleValidator, authController.changeRoleController);
adminRouter.get("/download-report", filter.adminFilter, authController.downloadCpyReport);
adminRouter.post("/activate-account", filter.adminFilter, validator.activateAccountValidator, authController.activateUserAccountController);
adminRouter.post("/addprojectdetails", filter.adminFilter, validator.addProjectDetailsValidator, authController.addProjectDetailsController);
adminRouter.post("/editprojectdetails", filter.adminFilter, validator.editProjectDetailsValidator, authController.editProjectDetailsController);
adminRouter.get("/getprojectDetails", filter.adminFilter, authController.getProjectDetailsController);
adminRouter.delete("/deleteprojectdetails", filter.adminFilter, authController.deleteProjectDetailsController);
adminRouter.post("/upload", filter.adminFilter, upload.single("file"), authController.uploadFileController);
adminRouter.post("/addholidaydetails", filter.adminFilter, validator.addHolidayDetailsValidator, authController.addHolidayDetailsController);
adminRouter.post("/editholidaydetails", filter.adminFilter, validator.editHolidayetailsValidator, authController.editHolidayDetailsController);
adminRouter.post("/getholidaydetails", filter.userFilter, authController.getHolidayDetailsController);
adminRouter.delete("/deleteholidaydetails", filter.adminFilter, authController.deleteHolidayDetailsController);

module.exports = adminRouter;