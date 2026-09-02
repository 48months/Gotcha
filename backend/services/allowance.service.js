const allowancedao = require("../database/users.allowance.dao");
const applicationConstants = require("../utility/constants");
const Users = require("../models/users.model");
const usersDao = require("../database/users.dao");
const Excel = require("exceljs");
const { HttpStatusCodes } = require("../utility/constants");
const fs = require("fs");
const crypto = require("crypto");
const { sendEmail } = require("../services/email.service");
const passwordService = require("../services/password.service");
const logger = require("../utility/logger");


let userCpyArray = [];
exports.addCpyData = async (req, res) => {
  let result;
  if (req.data.role == "ADMIN") {
    result = await usersDao.findUserByname(req.body.name);
  } else {
    result = req.data;
  }

  if (result) {
    if (
      req.body.userCPY[0].month !== null &&
      req.body.userCPY[0].projectDetails.projectType !== null
    ) {
      const length = result.userCPY.length;
      let index;
      for (let i = 0; i < length; i++) {
        if (
          new Date(result.userCPY[i].month).getFullYear() === new Date(req.body.userCPY[0].month).getFullYear() && new Date(result.userCPY[i].month).getMonth() === new Date(req.body.userCPY[0].month).getMonth()
        ) {
          index = i;
        }
      }
      if (index !== undefined) {
        result.userCPY[index].month = req.body.userCPY[0].month;
        result.userCPY[index].projectDetails = req.body.userCPY[0].projectDetails;

        // result.userCPY[index].projectDetails[0].projectType = req.body.userCPY[0].projectType.projectDetails[0].projectType;
        // result.userCPY[index].projectDetails[0].componentId = req.body.userCPY[0].projectType.projectDetails[0].componentId;
      } else {
        result.userCPY.push(req.body.userCPY[0]);
      }
      logger.info(__filename, "updating cpy: " + JSON.stringify(result));
      const data = allowancedao.save(result);
      res
        .status(applicationConstants.HttpStatusCodes.success)
        .json({ message: "successfully updated" });
    } else {
      logger.error(__filename, "project name can't be null");
      res.json({ message: "project name can't be null" });
    }
  } else {
    logger.error(__filename, "Can't find the cpy details");
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the cpy details" });
  }
};

exports.addSupportData = async (req, res) => {
  let result;
  if (req.data.role == "ADMIN") {
    result = await usersDao.findUserByname(req.body.name);
  } else {
    result = req.data;
  }
  if (result) {
    if (
      req.body.userCPY[0].month !== null &&
      req.body.userCPY[0].supportAllowance !== null
    ) {
      const length = result.userCPY.length;

      let index;
      for (let i = 0; i < length; i++) {
        if (
          new Date(result.userCPY[i].month).getFullYear() === new Date(req.body.userCPY[0].month).getFullYear() && new Date(result.userCPY[i].month).getMonth() === new Date(req.body.userCPY[0].month).getMonth()
        ) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        result.userCPY[index].supportAllowance =
          req.body.userCPY[0].supportAllowance;
      } else {
        result.userCPY.push(req.body.userCPY[0]);
      }

      logger.info(__filename, "updating support: " + JSON.stringify(result));
      const data = allowancedao.save(result);
      res
        .status(applicationConstants.HttpStatusCodes.success)
        .json({ message: result.userCPY });
    } else {
      logger.error(__filename, "support allowance can't be null");
      res.json({ message: "support allowance can't be null" });
    }
  } else {
    logger.error(__filename, "Can't find the details");
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.addShiftData = async (req, res) => {
  let result;
  if (req.data.role == "ADMIN") {
    result = await usersDao.findUserByname(req.body.name);
  } else {
    result = req.data;
  }
  if (result) {
    if (
      req.body.userCPY[0].month !== null &&
      req.body.userCPY[0].shiftAllowance !== null
    ) {
      const length = result.userCPY.length;
      let index;
      for (let i = 0; i < length; i++) {
        if (
          new Date(result.userCPY[i].month).getFullYear() === new Date(req.body.userCPY[0].month).getFullYear() && new Date(result.userCPY[i].month).getMonth() === new Date(req.body.userCPY[0].month).getMonth()
        ) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        result.userCPY[index].shiftAllowance =
          req.body.userCPY[0].shiftAllowance;
      } else {
        result.userCPY.push(req.body.userCPY[0]);
      }

      logger.info(__filename, "updating shift: " + JSON.stringify(result));
      const data = allowancedao.save(result);
      res
        .status(applicationConstants.HttpStatusCodes.success)
        .json({ message: result.userCPY });
    } else {
      logger.error(__filename, "Shift allowance can't be null");
      res.json({ message: "Shift allowance can't be null" });
    }
  } else {
    logger.error(__filename, "Can't find the details");
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.addOohData = async (req, res) => {
  let result;
  if (req.data.role == "ADMIN") {
    result = await usersDao.findUserByname(req.body.name);
  } else {
    result = req.data;
  }
  if (result) {
    if (
      req.body.userCPY[0].month !== null &&
      req.body.userCPY[0].ooh !== null
    ) {
      const length = result.userCPY.length;
      let index;

      for (let i = 0; i < length; i++) {
        if (
          new Date(result.userCPY[i].month).getFullYear() === new Date(req.body.userCPY[0].month).getFullYear() && new Date(result.userCPY[i].month).getMonth() === new Date(req.body.userCPY[0].month).getMonth()
        ) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        result.userCPY[index].ooh = req.body.userCPY[0].ooh;
      } else {
        result.userCPY.push(req.body.userCPY[0]);
      }

      logger.info(__filename, "updating ooh: " + JSON.stringify(result));
      const data = allowancedao.save(result);
      res
        .status(applicationConstants.HttpStatusCodes.success)
        .json({ message: result.userCPY });
    } else {
      logger.error(__filename, "ooh can't be null");
      res.json({ message: "ooh can't be null" });
    }
  } else {
    logger.error(__filename, "Can't find the details");
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.addOnCallData = async (req, res) => {
  let result;
  if (req.data.role == "ADMIN") {
    result = await usersDao.findUserByname(req.body.name);
  } else {
    result = req.data;
  }
  if (result) {
    if (
      req.body.userCPY[0].month !== null &&
      req.body.userCPY[0].oncall !== null
    ) {
      const length = result.userCPY.length;
      let index;
      for (let i = 0; i < length; i++) {
        if (
          new Date(result.userCPY[i].month).getFullYear() === new Date(req.body.userCPY[0].month).getFullYear() && new Date(result.userCPY[i].month).getMonth() === new Date(req.body.userCPY[0].month).getMonth()
        ) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        result.userCPY[index].oncall = req.body.userCPY[0].oncall;
      } else {
        result.userCPY.push(req.body.userCPY[0]);
      }

      logger.info(__filename, "updating oncall: " + JSON.stringify(result));
      const data = allowancedao.save(result);
      res
        .status(applicationConstants.HttpStatusCodes.success)
        .json({ message: result.userCPY });
    } else {
      logger.error(__filename, "oncall can't be null");
      res.json({ message: "oncall can't be null" });
    }
  } else {
    logger.error(__filename, "Can't find the details");
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

// exports.deleteCpyData = async (req, res) => {
//   const result = req.data;
//   if (result) {
//     if (req.body.month !== null) {
//       const length = result.userCPY.length;
//       let index;
//       for (let i = 0; i < length; i++) {
//         if (result.userCPY[i].month.toLocaleDateString() == req.body.month) {
//           index = i;
//         }
//       }
//       if (index !== undefined) {
//         result.userCPY[index].projectType = undefined;
//       } else {
//         res
//           .status(applicationConstants.HttpStatusCodes.badRequest)
//           .json({ error: "can't find the data" });
//       }

//       const data = allowancedao.save(result);
//       res
//         .status(applicationConstants.HttpStatusCodes.success)
//         .json({ message: "successfully deleted" });
//     } else {
//       res.json({ message: "Month is required" });
//     }
//   } else {
//     return res
//       .status(applicationConstants.HttpStatusCodes.badRequest)
//       .json({ error: "Can't find the details" });
//   }
// };

// exports.deleteSupportData = async (req, res) => {
//   const result = req.data;
//   if (result) {
//     if (req.body.month !== null) {
//       const length = result.userCPY.length;
//       let index;
//       for (let i = 0; i < length; i++) {
//         if (result.userCPY[i].month.toLocaleDateString() == req.body.month) {
//           index = i;
//         }
//       }
//       if (index !== undefined) {
//         result.userCPY[index].supportAllowance = undefined;
//       } else {
//         res
//           .status(applicationConstants.HttpStatusCodes.badRequest)
//           .json({ error: "can't find the data" });
//       }

//       const data = allowancedao.save(result);
//       res
//         .status(applicationConstants.HttpStatusCodes.success)
//         .json({ message: "successfully deleted" });
//     } else {
//       res.json({ message: "Month is required" });
//     }
//   } else {
//     return res
//       .status(applicationConstants.HttpStatusCodes.badRequest)
//       .json({ error: "Can't find the details" });
//   }
// };

// exports.deleteShiftData = async (req, res) => {
//   const result = req.data;
//   if (result) {
//     if (req.body.month !== null) {
//       const length = result.userCPY.length;
//       let index;
//       for (let i = 0; i < length; i++) {
//         if (result.userCPY[i].month.toLocaleDateString() == req.body.month) {
//           index = i;
//         }
//       }
//       if (index !== undefined) {
//         result.userCPY[index].shiftAllowance = undefined;
//       } else {
//         res
//           .status(applicationConstants.HttpStatusCodes.badRequest)
//           .json({ error: "can't find the data" });
//       }

//       const data = allowancedao.save(result);
//       res
//         .status(applicationConstants.HttpStatusCodes.success)
//         .json({ message: "successfully deleted" });
//     } else {
//       res.json({ message: "Month is required" });
//     }
//   } else {
//     return res
//       .status(applicationConstants.HttpStatusCodes.badRequest)
//       .json({ error: "Can't find the details" });
//   }
// };

// exports.deleteOohData = async (req, res) => {
//   const result = req.data;
//   if (result) {
//     if (req.body.month !== null) {
//       const length = result.userCPY.length;
//       let index;
//       for (let i = 0; i < length; i++) {
//         if (result.userCPY[i].month.toLocaleDateString() == req.body.month) {
//           index = i;
//         }
//       }
//       if (index !== undefined) {
//         result.userCPY[index].ooh = undefined;
//       } else {
//         res
//           .status(applicationConstants.HttpStatusCodes.badRequest)
//           .json({ error: "can't find the data" });
//       }

//       const data = allowancedao.save(result);
//       res
//         .status(applicationConstants.HttpStatusCodes.success)
//         .json({ message: "successfully deleted" });
//     } else {
//       res.json({ message: "Month is required" });
//     }
//   } else {
//     return res
//       .status(applicationConstants.HttpStatusCodes.badRequest)
//       .json({ error: "Can't find the details" });
//   }
// };

// exports.deleteOnCallData = async (req, res) => {
//   const result = req.data;
//   if (result) {
//     if (req.body.month !== null) {
//       const length = result.userCPY.length;
//       let index;
//       for (let i = 0; i < length; i++) {
//         if (result.userCPY[i].month.toLocaleDateString() == req.body.month) {
//           index = i;
//         }
//       }
//       if (index !== undefined) {
//         result.userCPY[index].oncall = undefined;
//       } else {
//         res
//           .status(applicationConstants.HttpStatusCodes.badRequest)
//           .json({ error: "can't find the data" });
//       }

//       const data = allowancedao.save(result);
//       res
//         .status(applicationConstants.HttpStatusCodes.success)
//         .json({ message: "successfully deleted" });
//     } else {
//       res.json({ message: "Month is required" });
//     }
//   } else {
//     return res
//       .status(applicationConstants.HttpStatusCodes.badRequest)
//       .json({ error: "Can't find the details" });
//   }
// };

exports.getUserData = async (req, res) => {
  if (req.data) {
    return res
      .status(applicationConstants.HttpStatusCodes.success)
      .json({ message: req.data });
  } else {
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.getAllUserData = async (req, res) => {
  const result = await usersDao.getAll();
  if (result !== null || result !== undefined) {
    return res
      .status(applicationConstants.HttpStatusCodes.success)
      .json({ message: result });
  } else {
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.changeRole = async (req, res) => {
  const result = await usersDao.changeRole(req.body.name);
  if (result !== null || result !== undefined) {
    return res
      .status(applicationConstants.HttpStatusCodes.success)
      .json({ message: result });
  } else {
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {

    const user = await usersDao.findByUsername(req.body.username);
    if (!user) {
      return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "You will get a reset link to your email" });
    }
    let token = crypto.randomBytes(32).toString("hex");
    await usersDao.setResetToken(token, req.body.username);
    const link = `https://gotcha/password-reset/${user._id}/${token}`;
    const name = user.name;
    logger.info(__filename, link + " reset link");
    await sendEmail(user.username, "Password reset", { link, name });
    return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "You will get a reset link to your email" });
  }
  catch (error) {
    res.send("An error occured");
  }

}

exports.checkForgotPasswordLink = async (req, res) => {
  try {
    const user = await usersDao.findById(req.params.userId);
    if (!user) {
      return res.status(applicationConstants.HttpStatusCodes.unauthorized).json({ message: "invalid link or expired" });
    }
    const tokenValidate = await usersDao.findByResetToken(req.params.token);
    if (!tokenValidate) {
      return res.status(applicationConstants.HttpStatusCodes.unauthorized).json({ message: "invalid link or expired" });
    }
    let encryptPassword = await passwordService.encryptPassword(req.body.password);
    // console.log(encryptPassword);
    const updatePassword = await usersDao.updatePasswordById(req.params.userId, encryptPassword);
    return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Password updated successfully" });
  }
  catch (error) {
    res.send("An error occured");
  }

}

exports.activatUserAccount = async (req, res) => {
  const result = await usersDao.activateAccount(req.body.name);
  if (result !== null || result !== undefined) {
    return res
      .status(applicationConstants.HttpStatusCodes.success)
      .json({ message: result });
  } else {
    return res
      .status(applicationConstants.HttpStatusCodes.badRequest)
      .json({ error: "Can't find the details" });
  }

}

exports.downloadCpyReport = (req, res) => {
  let fileName = "CPY_" + req.query.projectName + "_Delivery+Operations_" + req.query.month + "'" + req.query.year + ".xlsx"
  res.download("files/generated-report/" + fileName);
};

exports.monthSwitch = (type) => {
  switch (type) {
    case "1": {
      return "Jan"
    }
    case "2": {
      return "Feb"
    }
    case "3": {
      return "Mar"
    }
    case "4": {
      return "Apr"
    }
    case "5": {
      return "May"
    }
    case "6": {
      return "Jun"
    }
    case "7": {
      return "Jul"
    }
    case "8": {
      return "Aug"
    }
    case "9": {
      return "Sep"
    }
    case "10": {
      return "Oct"
    }
    case "11": {
      return "Nov"
    }
    case "12": {
      return "Dec"
    }
    default: {
      return "";
    }
  }
}

exports.generateAllCpyReport = async (req, res) => {
  console.log("inside generate all cpy");
  let data = await usersDao.getAll(req, res);
  let workbook = new Excel.Workbook();
  workbook = await workbook.xlsx.readFile("files/report/" + "CPY_Template_" + this.monthSwitch(req.body.month) + "'" + req.body.year.substring(2, 4) + ".xlsx");
  let cpyWorkSheet = await workbook.getWorksheet("CPY");
  let supportWorkSheet = await workbook.getWorksheet("Support_allowance_Entries");
  let shiftWorkSheet = await workbook.getWorksheet("Shift_allowance_Entries");
  let oohWorkSheet = await workbook.getWorksheet("OOH Activities");
  let onCallWorkSheet = await workbook.getWorksheet("ON Call_Call Out Activities");
  const lenght = data.length;
  supportRow = 2;
  supportCell = 2;
  cpyRow = 3;
  cpyCell = 2;
  shiftRow = 2;
  shiftCell = 2;
  oohRow = 2;
  oohCell = 2;
  onCallRow = 2;
  onCallCell = 2;
  for (var i = 0; i < lenght; i++) {
    const length1 = data[i].userCPY.lenght;
    for (var j = 0; j < data[i].userCPY.length; j++) {
      // console.log(data)
      // console.log(data[i].userCPY[j].projectDetails.projectName);
      if ((data[i].userCPY[j].projectDetails.projectName == req.body.projectName)) {
        if (data[i].userCPY[j].projectDetails.projectType == req.body.projectType) {
          // console.log(data[i].userCPY[j]);


          // console.log(data[i].projectName);
          // console.log(data[i].userCPY[j].month.toDateString().substring(4, 7) + "  month   " + req.body.month);
          // console.log(data[i].userCPY[j].month.toDateString().substring(11, 15) + "    Year   " + req.body.year)
          let previouseMonth;
          // console.log(new Date(req.body.year, req.body.month - 1, 1).toLocaleDateString());
          if (data[i].userCPY[j].month.toLocaleDateString().length < 10) {
            // console.log(data[i].userCPY[j].month.toLocaleDateString());

            // console.log(parseInt(data[i].userCPY[j].month.toLocaleDateString().substring(0, 1)) - 2);
            previouseMonth = parseInt(req.body.month - 1) - 2;
          }
          else {
            previouseMonth = parseInt(req.body.month - 1) - 2;
          }
          // console.log("previouseMonth" + previouseMonth);
          // console.log(data[i].userCPY[j].month.toLocaleDateString().length);
          // console.log(data[i].userCPY[j].month.toDateString())
          // console.log(data[i].userCPY[j].month + "   compare   " + new Date(req.body.year, previouseMonth, 21));
          // console.log(data[i].userCPY[j].month + "   compare   " + new Date(req.body.year, previouseMonth + 1, 20));
          // console.log(data[i].userCPY[j].month + "   compare   " + new Date(req.body.year, req.body.month - 2, 21));
          // console.log(data[i].userCPY[j].month + "   compare   " + new Date(req.body.year, req.body.month - 1, 20));
          // console.log(data[i].userCPY[j].month >= new Date(req.body.year, req.body.month - 2, 21));
          // console.log(data[i].userCPY[j].month <= new Date(req.body.year, req.body.month - 1, 20))
          // console.log(data[i].userCPY[j].month.toLocaleDateString() + '   ' + data[i].userCPY[j].month.toLocaleDateString().length);
          // if (data[i].userCPY[j].month >= new Date(req.body.year, req.body.month - 2, 21) &&
          //   data[i].userCPY[j].month <= new Date(req.body.year, req.body.month - 1, 20)) {

          if (req.body.projectType === 'All') {

          }
          let month;
          let year;
          //Cpy allowance
          if (data[i].userCPY[j].month.toLocaleDateString().length == 9) {
            month = data[i].userCPY[j].month.toLocaleDateString().substring(0, 1);
            year = data[i].userCPY[j].month.toLocaleDateString().substring(5, 10);
            // console.log("Month::::::::::::",data[i].userCPY[j].month.toLocaleDateString().substring(5,10));
          }
          else {
            month = data[i].userCPY[j].month.toLocaleDateString().substring(0, 2);
            year = data[i].userCPY[j].month.toLocaleDateString().substring(6, 10);
            // console.log("Month::::::::::::",data[i].userCPY[j].month.toLocaleDateString().substring(6,10));
          }

          if (month == req.body.month && year == req.body.year) {
            console.log(year);

            if (data[i].userCPY[j].projectDetails.projectType !== undefined) {
              let projectType = 'Support(L1_L2)';
              if (data[i].userCPY[j].projectDetails.projectType == 'Testing' || data[i].userCPY[j].projectDetails.projectType == 'DnD(Dev&L3)') {
                projectType = 'DnD(Dev&L3)'
              }
              cpyWorkSheet.getRow(cpyRow).findCell(cpyCell).value = data[i].empId;
              cpyWorkSheet.getRow(cpyRow).findCell(cpyCell + 3).value = projectType;
              cpyWorkSheet.getRow(cpyRow).findCell(cpyCell + 4).value = data[i].userCPY[j].projectDetails.projectName;
              var componentId = ' ';
              for (var k = 0; k < data[i].userCPY[j].projectDetails.componentId.length; k++) {
                componentId += ' ' + data[i].userCPY[j].projectDetails.componentId[k];
              }
              cpyWorkSheet.getRow(cpyRow).findCell(cpyCell + 5).value = componentId;
              cpyRow += 1;
            }

            //Support allowance
            if (data[i].userCPY[j].projectDetails.projectType === 'Support(L1_L2)') {
              for (var m = 0; m < data[i].userCPY[j].supportAllowance.length; m++) {
                if (data[i].userCPY[j].supportAllowance[m].leaveType !== undefined) {

                  supportWorkSheet.getRow(supportRow).findCell(supportCell).value = data[i].empId;

                  if (data[i].userCPY[j].supportAllowance[m].leaveType === 'HalfDay Leave') {
                    supportWorkSheet.getRow(supportRow).findCell(supportCell + 4).value = "Leave";
                  } else {
                    supportWorkSheet.getRow(supportRow).findCell(supportCell + 4).value = data[i].userCPY[j].supportAllowance[m].leaveType;
                  }
                  supportWorkSheet.getRow(supportRow).findCell(supportCell + 5).value = data[i].userCPY[j].supportAllowance[m].noOfDays;
                  var dates = ' ';
                  for (var k = 0; k < data[i].userCPY[j].supportAllowance[m].dates.length; k++) {
                    if (data[i].userCPY[j].supportAllowance[m].dates.length > 1) {
                      if (data[i].userCPY[j].supportAllowance[m].leaveType === 'HalfDay Leave') {
                        dates += ' ' + data[i].userCPY[j].supportAllowance[m].dates[k].toLocaleDateString() + ", (Half day leave) ";
                      }
                      else {
                        dates += ' ' + data[i].userCPY[j].supportAllowance[m].dates[k].toLocaleDateString() + ", ";
                      }

                    }
                    else {
                      dates += '  ' + data[i].userCPY[j].supportAllowance[m].dates[k].toLocaleDateString();
                    }

                  }
                  supportWorkSheet.getRow(supportRow).findCell(supportCell + 6).value = dates;
                }
                supportRow += 1;
              }
            }


            //Shift allowance

            for (var m = 0; m < data[i].userCPY[j].shiftAllowance.length; m++) {

              if (data[i].userCPY[j].shiftAllowance[m].shiftSlab !== undefined) {
                shiftWorkSheet.getRow(shiftRow).findCell(shiftCell).value = data[i].empId;
                shiftWorkSheet.getRow(shiftRow).findCell(shiftCell + 4).value = data[i].userCPY[j].shiftAllowance[m].shiftSlab;
                shiftWorkSheet.getRow(shiftRow).findCell(shiftCell + 5).value = data[i].userCPY[j].shiftAllowance[m].noOfDays;
                shiftWorkSheet.getRow(shiftRow).findCell(shiftCell + 6).value = data[i].userCPY[j].shiftAllowance[m].ccaAndwfhNoOfDays;
                var dates = ' ';
                for (var k = 0; k < data[i].userCPY[j].shiftAllowance[m].cabAvailedDates.length; k++) {
                  if (data[i].userCPY[j].shiftAllowance[m].cabAvailedDates.length > 1) {
                    dates += '  ' + data[i].userCPY[j].shiftAllowance[m].cabAvailedDates[k].toLocaleDateString() + ", ";
                  }
                  else {
                    dates += '  ' + data[i].userCPY[j].shiftAllowance[m].cabAvailedDates[k].toLocaleDateString();
                  }

                }
                shiftWorkSheet.getRow(shiftRow).findCell(shiftCell + 7).value = dates;
              }
              shiftRow += 1;
            }

            //OOH Activities
            for (var m = 0; m < data[i].userCPY[j].ooh.length; m++) {
              if (data[i].userCPY[j].ooh[m].oohType !== undefined) {
                oohWorkSheet.getRow(oohRow).findCell(oohCell).value = data[i].empId;
                oohWorkSheet.getRow(oohRow).findCell(oohCell + 4).value = data[i].userCPY[j].ooh[m].oohType;
                oohWorkSheet.getRow(oohRow).findCell(oohCell + 6).value = data[i].userCPY[j].ooh[m].date.toLocaleDateString();
                oohWorkSheet.getRow(oohRow).findCell(oohCell + 7).value = data[i].userCPY[j].ooh[m].startTime;
                oohWorkSheet.getRow(oohRow).findCell(oohCell + 8).value = data[i].userCPY[j].ooh[m].endTime;
                oohWorkSheet.getRow(oohRow).findCell(oohCell + 11).value = data[i].userCPY[j].ooh[m].description;
              }
              oohRow += 1;
            }

            //ON Call Activities
            for (var m = 0; m < data[i].userCPY[j].oncall.length; m++) {
              if (data[i].userCPY[j].oncall[m].OnCalltype !== undefined) {
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell).value = data[i].empId;
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 4).value = data[i].userCPY[j].oncall[m].OnCalltype;
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 6).value = data[i].userCPY[j].oncall[m].timings;
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 7).value = data[i].userCPY[j].oncall[m].date.toLocaleDateString();
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 8).value = data[i].userCPY[j].oncall[m].startTime;
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 9).value = data[i].userCPY[j].oncall[m].endTime;
                onCallWorkSheet.getRow(onCallRow).findCell(onCallCell + 12).value = data[i].userCPY[j].oncall[m].description;

              }
              onCallRow += 1;
            }
            userCpyArray.push(data[i].userCPY[j]);
            // }
          }
        }
      }


    }
  }
  await workbook.xlsx.writeFile("files/generated-report/" + "CPY_" + req.body.projectName + "_Delivery+Operations_" + this.monthSwitch(req.body.month) + "'" + req.body.year + ".xlsx");
  res.status(HttpStatusCodes.success).json({ message: "successfully generated" });
};

exports.generateCpy = async (req, res) => {
  let data = req.body;
  let workbook = new Excel.Workbook();
  let row = 3;
  let cell = 2;
  workbook = await workbook.xlsx.readFile("dec.xlsx");
  let cpyWorkSheet = await workbook.getWorksheet("CPY");
  let supportWorkSheet = await workbook.getWorksheet("Support_allowance_Entries");
  let shiftWorkSheet = await workbook.getWorksheet("Shift_allowance_Entries");
  let oohWorkSheet = await workbook.getWorksheet("OOH Activities");
  let onCallWorkSheet = await workbook.getWorksheet("ON Call_Call Out Activities");
  const lenght = data.length;
  for (var i = 0; i < lenght; i++) {
    for (var j = 0; j < data[i].userCPY.length; j++) {

      // if (data.userCPY[j].month.toDateString().substring(4, 7) == req.body.month && data[i].userCPY[j].month.toDateString().substring(11, 15) == req.body.year) {
      // let previouseMonth = parseInt(data[i].userCPY[j].month.toLocaleDateString().substring(3, 5)) - 2;
      // console.log(data[i].userCPY[j].month.toDateString())
      // console.log(data[i].userCPY[j].month > new Date(req.body.year, previouseMonth, 21));
      // console.log(data[i].userCPY[j].month < new Date(req.body.year, previouseMonth + 1, 20));

      // if (data[i].userCPY[j].month > new Date(req.body.year, previouseMonth, 21) &&
      // data[i].userCPY[j].month < new Date(req.body.year, previouseMonth + 1, 20)) {
      //Cpy allowance
      if (data.userCPY[j].projectType !== undefined) {
        // console.log(data.empId);
        cpyWorkSheet.getRow(row).findCell(cell).value = data.empId;
        cpyWorkSheet.getRow(row).findCell(cell + 3).value = data.userCPY[j].projectType;
      }

      //Support allowance
      for (var m = 0; m < data.userCPY[j].supportAllowance.length; m++) {
        if (data.userCPY[j].supportAllowance[m].leaveType !== undefined) {
          supportWorkSheet.getRow(row - 1).findCell(cell).value = data.empId;
          supportWorkSheet.getRow(row - 1).findCell(cell + 4).value = data.userCPY[j].supportAllowance[m].leaveType;
          supportWorkSheet.getRow(row - 1).findCell(cell + 5).value = data.userCPY[j].supportAllowance[m].noOfDays;
          var dates = ' ';
          for (var k = 0; k < data.userCPY[j].supportAllowance[m].dates.length; k++) {
            dates += ' ' + data.userCPY[j].supportAllowance[m].dates[k].toLocaleDateString();
          }
          supportWorkSheet.getRow(row - 1).findCell(cell + 6).value = dates;
        }
        row++;
      }

      row = 3;
      cell = 2;
      //Shift allowance
      for (var m = 0; m < data.userCPY[j].shiftAllowance.length; m++) {
        if (data.userCPY[j].shiftAllowance[m].shiftSlab !== undefined) {
          shiftWorkSheet.getRow(row - 1).findCell(cell).value = data.empId;
          shiftWorkSheet.getRow(row - 1).findCell(cell + 4).value = data.userCPY[j].shiftAllowance[m].shiftSlab;
          shiftWorkSheet.getRow(row - 1).findCell(cell + 5).value = data.userCPY[j].shiftAllowance[m].noOfDays;
          shiftWorkSheet.getRow(row - 1).findCell(cell + 6).value = data.userCPY[j].shiftAllowance[m].ccaAndwfhNoOfDays;
          var dates = ' ';
          for (var k = 0; k < data.userCPY[j].shiftAllowance[m].cabAvailedDates.length; k++) {
            dates += '  ' + data.userCPY[j].shiftAllowance[m].cabAvailedDates[k].toLocaleDateString();
          }
          shiftWorkSheet.getRow(row - 1).findCell(cell + 7).value = dates;
        }
        row++;
      }

      row = 3;
      cell = 2;

      //OOH Activities
      for (var m = 0; m < data.userCPY[j].ooh.length; m++) {
        if (data.userCPY[j].ooh[m].oohType !== undefined) {
          oohWorkSheet.getRow(row - 1).findCell(cell).value = data.empId;
          oohWorkSheet.getRow(row - 1).findCell(cell + 4).value = data.userCPY[j].ooh[m].oohType;
          oohWorkSheet.getRow(row - 1).findCell(cell + 6).value = data.userCPY[j].ooh[m].date.toLocaleDateString();
          oohWorkSheet.getRow(row - 1).findCell(cell + 7).value = data.userCPY[j].ooh[m].startTime;
          oohWorkSheet.getRow(row - 1).findCell(cell + 8).value = data.userCPY[j].ooh[m].endTime;
          oohWorkSheet.getRow(row - 1).findCell(cell + 11).value = data.userCPY[j].ooh[m].description;
        }
        row++;
      }

      row = 3;
      cell = 2;

      //ON Call Activities
      for (var m = 0; m < data.userCPY[j].oncall.length; m++) {
        if (data.userCPY[j].oncall[m].OnCalltype !== undefined) {

          onCallWorkSheet.getRow(row - 1).findCell(cell).value = data.empId;
          onCallWorkSheet.getRow(row - 1).findCell(cell + 4).value = data.userCPY[j].oncall[m].OnCalltype;
          onCallWorkSheet.getRow(row - 1).findCell(cell + 6).value = data.userCPY[j].oncall[m].timings;
          onCallWorkSheet.getRow(row - 1).findCell(cell + 7).value = data.userCPY[j].oncall[m].date.toLocaleDateString();
          onCallWorkSheet.getRow(row - 1).findCell(cell + 8).value = data.userCPY[j].oncall[m].startTime;
          onCallWorkSheet.getRow(row - 1).findCell(cell + 9).value = data.userCPY[j].oncall[m].endTime;
          onCallWorkSheet.getRow(row - 1).findCell(cell + 12).value = data.userCPY[j].oncall[m].description;
        }
        row++;
      }

      userCpyArray.push(data.userCPY[j]);
      // }
      // }
    }
  }
  res.status(HttpStatusCodes.success).json({ message: "successfully generated" });
  await workbook.xlsx.writeFile("new.xlsx");
}