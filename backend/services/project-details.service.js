const projectdao = require("../database/project-details.dao");
const applicationConstants = require("../utility/constants");
const logger = require("../utility/logger");
multer = require('multer')

// exports.addProjectDetails = async (req, res) => {

//     let projectDeatilsdata;
//     projectdao.findByProjectName(req.body.projectName).then((data) => {
//         if (data && data.projectDetails[0].year == req.body.year) {
//           console.log(data.projectDetails[0].year);
//             return res
//                 .status(applicationConstants.HttpStatusCodes.badRequest)
//                 .json({ error: "Project already exists!" });
//         }else if(data && data.projectDetails[0].year != req.body.year && data.projectName == req.body.projectName){
//              projectDeatilsdata = {
//                 "projectName": req.body.projectName,
//                 "projectDetails": [{ "year": req.body.year, "componentId":Array.from(new Set(req.body.componentId)) }]
    
//             };
//         }else{
//             projectDeatilsdata = {
//                 "projectName": req.body.projectName,
//                 "projectDetails": [{ "year": req.body.year, "componentId":Array.from(new Set(req.body.componentId)) }]
    
//             };
//         }

//         projectdao.save(projectDeatilsdata).then((data) => {
//             return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully Added" });
//         })
//             .catch((err) => {
//                 logger.error(__filename, "error while adding the project details" + err);
//                 return res
//                     .status(
//                         applicationConstants.HttpStatusCodes
//                             .internalServerError
//                     )
//                     .json({ error: "Error while adding the project details" });
//             });
//         // }
//     });
// };

exports.addProjectDetails = async (req, res) => {
    let projectDeatilsdata;
    let reqProjectName=req.body.projectName;
    try {
        const existingProject = await projectdao.findByProjectName(reqProjectName);

        if (existingProject) {
        //    console.log("inside existing project");
          
           const existingYear = existingProject.projectDetails.some(
            (detail) => {
                // console.log("detail", detail.year);
                console.log(detail.year == req.body.year);
                return detail.year == req.body.year;
            }
        );
            // console.log("existingYear:"+existingYear);
            if (existingYear) {
                return res
                    .status(applicationConstants.HttpStatusCodes.badRequest)
                    .json({ error: "Project for this year already exists!" });
            } else {
                // console.log("before");
                    await projectdao.updateByProjectName(
                    existingProject.projectName,
                   req.body.year,
                    Array.from(new Set(req.body.componentId)) 
                );
                
                // Respond to the client
                return res.status(applicationConstants.HttpStatusCodes.success).json({
                    message: "Successfully added/updated year details",
                });
            }
        } else {
           
            projectDeatilsdata = {
                projectName: req.body.projectName,
                projectDetails: [
                    { year: req.body.year, componentId: Array.from(new Set(req.body.componentId)) },
                ],
            };

            await projectdao.save(projectDeatilsdata);
            return res
                .status(applicationConstants.HttpStatusCodes.success)
                .json({ message: "Successfully Added" });
        }
    } catch (err) {
        logger.error("error while adding the project details: " + err);
        return res
            .status(applicationConstants.HttpStatusCodes.internalServerError)
            .json({ error: "Error while adding the project details" });
    }
};
exports.editProjectDetails = async (req, res) => {
    let data = await projectdao.findByProjectName(req.body.projectName)
    if (data) {
        // data.projectDetails[0].year = req.body.year;
        // data.projectDetails[0].componentId = new Set(req.body.componentId);

        for (let index = 0; index < data.projectDetails.length; index++) {        
            if (data.projectDetails[index].year == req.body.year){
                data.projectDetails[index].componentId = Array.from(new Set(req.body.componentId));
            }
        }

        let result = await projectdao.save(data);
        if (result) {
            return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully updated" });
        }
        else {
            logger.error(__filename, "Error while updating  the project details");
            return res
                .status(
                    applicationConstants.HttpStatusCodes
                        .internalServerError
                )
                .json({ error: "Error while updating the project details" });
        }

    } else {
        return res.status(applicationConstants.HttpStatusCodes.badRequest).json({ message: "Can't find the data" });
    }

};

exports.deleteProjectDetails = async (req, res) => {
    let data = await projectdao.findByProjectName(req.body.projectName)
    if (data) {
        let result = await projectdao.deleteProjectDetails(req.body.projectName);
        if (result) {
            return res.status(applicationConstants.HttpStatusCodes.success).json({ message: "Successfully deleted" });
        }
        else {
            logger.error(__filename, "Error while deleting  the project details");
            return res
                .status(
                    applicationConstants.HttpStatusCodes
                        .internalServerError
                )
                .json({ error: "Error while deleting the project details" });
        }

    } else {
        return res.status(applicationConstants.HttpStatusCodes.badRequest).json({ message: "Can't find the data" });
    }

};

exports.uploadFile = async (req, res) => {
    if (!req.file) {
        console.log("No file is available!");
        return res.send({
            success: false
        });

    } else {
        console.log('File is available!');
        return res.send({
            success: true
        })

    };
};
exports.getProjectDetails = async (req, res) => {
    let data = await projectdao.getProjectDetails(req.body.projectName)
    if (data) {
        return res.status(applicationConstants.HttpStatusCodes.success).json({ message: data });
    }
    else {
        logger.error(__filename, "Error while fetching the project details");
        return res
            .status(
                applicationConstants.HttpStatusCodes
                    .internalServerError
            )
            .json({ error: "Error while fetching the project details" });
    }

};