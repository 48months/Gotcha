
export class UserCpyResponse {
  _id: string;
  username: string;
  password: string;
  name: string;
  empId: number;
  twofactorEnabled: boolean;
  role: string;
  emailVerified: boolean;
  userCPY: UserCpy[];
}
export class UserCpy {
  month: string;
  projectDetails: ProjectDetails;
  supportAllowance: SupportAllowance[];
  shiftAllowance: ShiftAllowance[];
  oncall: OnCall[];
  ooh: Ooh[];
  _id: string;
  constructor(month: string, projectDetails: ProjectDetails, supportAllowance: SupportAllowance[], shiftAllowance: ShiftAllowance[], oncall: OnCall[], ooh: Ooh[]) {
    this.month = month;
    this.projectDetails = projectDetails;
    this.supportAllowance = supportAllowance;
    this.shiftAllowance = shiftAllowance;
    this.oncall = oncall; this.ooh = ooh;
  }
}

export class ProjectDetails {
  componentId: string[];
  projectName: string;
  projectType: string;
  constructor(projectName, projectType, componentId) {
    this.projectName = projectName;
    this.projectType = projectType;
    this.componentId = componentId;
  }
}
export class SupportAllowance {
  leaveType: string;
  noOfDays: number;
  dates: string[];
  _id: string;
  constructor(leaveType, noOfDays, dates) {
    this.leaveType = leaveType;
    this.noOfDays = noOfDays;
    this.dates = dates;
  }
}
export class ShiftAllowance {
  shiftSlab: string;
  noOfDays: number;
  ccaAndwfhNoOfDays: number;
  cabAvailedDates: string[];
  _id: string;
  constructor(shiftSlab, noOfDays, ccaAndwfhNoOfDays, cabAvailedDates) {
    this.shiftSlab = shiftSlab;
    this.noOfDays = noOfDays;
    this.ccaAndwfhNoOfDays = ccaAndwfhNoOfDays;
    this.cabAvailedDates = cabAvailedDates;
  }
}
export class OnCall {
  OnCalltype: string;
  timings: string;
  date: string;
  startTime: string;
  endTime: string;
  _id: string;
  description: string;
  constructor(onCallType, timings, date, startTime, endTime,description) {
    this.OnCalltype = onCallType;
    this.timings = timings;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;

  }
}
export class Ooh {
  oohType: string;
  date: string;
  startTime: string;
  endTime: string;
  _id: string;
  description: string;
  constructor(oohType, date, startTime, endTime,description) {
    this.oohType = oohType;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
  }
}
