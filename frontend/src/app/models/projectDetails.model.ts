export class ProjectDetailsResponse {
  _id: string;
  projectName: string;
  projectDetails: ProjectDetails[];
}

export class ProjectDetails {
  year: string;
  componentId: string[];
  _id: string;
}
