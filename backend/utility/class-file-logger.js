const path = require("path");

exports.getClassFileName = (filename) => {
    return path.basename(filename).split(".")[0];
};