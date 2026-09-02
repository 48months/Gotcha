export class AdminRequest<T> {
  name: string;
  userCPY: T[];
  constructor(name, userCPY) {
    this.name = name;
    this.userCPY = userCPY;
  }
}
export class UserRequest<T> {
  userCPY: T[];
  constructor(userCPY) {
    this.userCPY = userCPY;
  }
}

export class UserCpySupportAllowance {
  month: string;
  supportAllowance: SupportAllowanceRequest[];

  constructor(month: string, supportAllowance: SupportAllowanceRequest[]) {
    this.month = month;
    this.supportAllowance = supportAllowance;
  }
}

export class UserCpyShiftAllowance {
  month: string;
  shiftAllowance: ShiftAllowanceRequest[];

  constructor(month: string, shiftAllowance: ShiftAllowanceRequest[]) {
    this.month = month;
    this.shiftAllowance = shiftAllowance;
  }
}

export class UserCpyOnCall {
  month: string;
  oncall: OnCallRequest[];
  constructor(month: string, oncall: OnCallRequest[]) {
    this.month = month;
    this.oncall = oncall;
  }
}

export class UserCpyOoh {
  month: string;
  ooh: OohRequest[];
  constructor(month: string, ooh: OohRequest[]) {
    this.month = month;
    this.ooh = ooh;
  }
}

export class SupportAllowanceRequest {
  leaveType: string;
  noOfDays: number;
  dates: string[];

  constructor(leaveType, noOfDays, dates) {
    this.leaveType = leaveType;
    this.noOfDays = noOfDays;
    this.dates = dates;
  }
}
export class ShiftAllowanceRequest {
  shiftSlab: string;
  noOfDays: number;
  ccaAndwfhNoOfDays: number;
  cabAvailedDates: string[];
  constructor(shiftSlab, noOfDays, ccaAndwfhNoOfDays, cabAvailedDates) {
    this.shiftSlab = shiftSlab;
    this.noOfDays = noOfDays;
    this.ccaAndwfhNoOfDays = ccaAndwfhNoOfDays;
    this.cabAvailedDates = cabAvailedDates;
  }
}
export class OnCallRequest {
  OnCalltype: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  constructor(OnCalltype, date, startTime, endTime,description) {
    this.OnCalltype = OnCalltype;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;

  }
}
export class OohRequest {
  oohType: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  constructor(ohType, date, startTime, endTime,description) {
    this.oohType = ohType;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
  }
}

export class ProjectDetailsRequest {
  month: string;
  projectDetails: ProjDetails;
  constructor(month, projectDetails) {
    this.month = month;
    this.projectDetails = projectDetails;
  }
}

export class ProjDetails {
  projectName: string;
  projectType: string;
  componentId: string[];
  constructor(projectName, projectType, componentId) {
    this.projectName = projectName;
    this.projectType = projectType;
    this.componentId = componentId;
  }
}
