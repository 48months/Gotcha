const Mongoose = require("mongoose")

const holidaySchema = new Mongoose.Schema({
    projectType: {
        type: String,
    },
    dates: []
});

module.exports = Mongoose.model("Holidays", holidaySchema);