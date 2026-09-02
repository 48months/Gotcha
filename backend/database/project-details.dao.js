const logger = require("../utility/logger");
const projectDetails = require("../models/project-details-schema.model");

exports.save = async (saveProjectDetailsData) => {
    const projectDao = new projectDetails(saveProjectDetailsData);
    return await projectDao.save();
};

// exports.updateByProjectName = async (projectname, year, componentid) => {
//     console.log("hej",year);
//     return await projectDetails.findOneAndUpdate({ projectname: projectname }, {$addToSet:{ "projectDetails": year }});
// };

exports.updateByProjectName = async (projectName, year, componentId) => {
    // logger.debug("Updating project:", projectName, "Year:", year, "ComponentId:", componentId);

    
    const updatedProject = await projectDetails.findOneAndUpdate(
        { projectName, "projectDetails.year": year }, 
        {
            $addToSet: { 
                "projectDetails.$.componentId": { $each: componentId }
            }
        },
        {
            new: true,
            upsert: false 
        }
    );

    if (updatedProject) {
        
        return updatedProject;
    }

    
    return await projectDetails.findOneAndUpdate(
        { projectName }, 
        {
            $push: { 
                projectDetails: { year, componentId }
            }
        },
        { new: true, upsert: true } 
    );
};


exports.findByProjectName = async (projectname) => {
    return await projectDetails.findOne({ projectName: projectname });
};

exports.getProjectDetails = async () => {
    return await projectDetails.find();
};

exports.deleteProjectDetails = async (projectName) => {
    return await projectDetails.deleteOne({ projectName: projectName });
};
