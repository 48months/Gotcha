const classFileLogger = require("../utility/class-file-logger");
const log4js = require("log4js");

log4js.configure({
    appenders: { backend: { type: "dateFile", filename: process.env.LOG_FILENAME, pattern: '.yyyy-MM-dd-hh', compress: true } },
    categories: { default: { appenders: ["backend"], level: process.env.LOG_LEVEL } },
});

const logger = log4js.getLogger("backend");

exports.info = (className, log) => logger.info("[" + classFileLogger.getClassFileName(className) + "] ", log);
exports.debug = (className, log) => logger.debug("[" + classFileLogger.getClassFileName(className) + "] ", log);
exports.error = (className, log) => logger.error("[" + classFileLogger.getClassFileName(className) + "] ", log);
exports.trace = (className, log) => logger.trace("[" + classFileLogger.getClassFileName(className) + "] ", log);