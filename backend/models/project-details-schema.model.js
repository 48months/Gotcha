const Mongoose = require("mongoose")

const projectSchema = new Mongoose.Schema({
    projectName: {
        type: String
    },
    projectDetails: [{
        year: {
            type: String,
        },
        componentId: [{ type: String }]
    }]
});

module.exports = Mongoose.model("ProjectDetails", projectSchema);