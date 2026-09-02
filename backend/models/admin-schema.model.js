const Mongoose = require("mongoose")

const adminSchema = new Mongoose.Schema({
    message: {
        type: String,
    }
});

module.exports = Mongoose.model("AdminSchema", adminSchema);