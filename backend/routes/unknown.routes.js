const unknownRouter = require('express').Router();
const logger = require('../utility/logger');
const applicationConstants = require('../utility/constants');


unknownRouter.get("", (req, res) => {
    logger.error(__filename, "Unknown route hit!  " + req.originalUrl);
    res.status(applicationConstants.HttpStatusCodes.badRequest).json({ message: 'Bad Route' });
});


module.exports = unknownRouter;