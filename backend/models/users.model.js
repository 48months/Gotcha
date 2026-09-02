const { boolean } = require("joi");
const Mongoose = require("mongoose")

const userSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    empId: {
        type: Number,
        required: true
    },
    twofactorEnabled: {
        type: Boolean,
        default: false,
    },
    twofactorSecretToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    role: {
        type: String, enum: ["USER", "ADMIN"],
        default: "USER"
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },

    userCPY: [{
        month: {
            type: Date,
        },

        projectDetails: {
            projectName: {
                type: String,
            },
            componentId: [{
                type: String,
            }],
            projectType: {
                type: String, enum: ["Support(L1_L2)", "DnD(Dev&L3)", "Product Support(L3_L4)", "Exception", "Testing"]
            },
        },


        supportAllowance: [{
            leaveType: {
                type: String, enum: ["Leave", "Comp Off", "Non Support Work", "Holiday", "HalfDay Leave"]
            },
            noOfDays: {
                type: Number
            },
            dates: [{
                type: Date
            }]
        }],
        shiftAllowance: [{
            shiftSlab: {
                type: String, enum: ["6:30AM-03:30PM", "1-9PM/2:30PM-11:30PM", "11PM-7AM"]
            },
            noOfDays: {
                type: Number
            },
            ccaAndwfhNoOfDays: {
                type: Number
            },
            cabAvailedDates: [{
                type: Date
            }]
        }],
        oncall: [{
            OnCalltype: {
                type: String, enum: ["Workdays", "Non_workdays", "Call_Out"]
            },
            timings: {
                type: String,
                default: "1-9PM/2:30PM-11:30PM"
            },
            date: {
                type: Date
            },
            startTime: {
                type: String
            },
            endTime: {
                type: String
            },
            description: {
                type: String
            }
        }],
        ooh: [{
            oohType: {
                type: String, enum: ["Workdays", "Non_workdays"]
            },
            timings: {
                type: String
            },
            date: {
                type: Date
            },
            startTime: {
                type: String
            },
            endTime: {
                type: String
            },
            description: {
                type: String
            }
        }]
    }]
});

module.exports = Mongoose.model("User", userSchema);