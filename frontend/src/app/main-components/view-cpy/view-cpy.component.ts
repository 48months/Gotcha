import { Component, OnInit } from '@angular/core';
import { ViewCpyService } from 'src/app/services/view-cpy.service';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/models/response.model';
import {
  OnCall,
  Ooh,
  ProjectDetails,
  ShiftAllowance,
  SupportAllowance,
  UserCpy,
  UserCpyResponse,
} from 'src/app/models/usercpy.model';
import { Title } from '@angular/platform-browser';
import {
  AdminRequest,
  OnCallRequest,
  OohRequest,
  ProjDetails,
  ProjectDetailsRequest,
  ShiftAllowanceRequest,
  SupportAllowanceRequest,
  UserCpyOnCall,
  UserCpyOoh,
  UserCpyShiftAllowance,
  UserCpySupportAllowance,
  UserRequest,
} from 'src/app/models/usercpyRequest.model';
import { ProjectDetailsResponse } from 'src/app/models/projectDetails.model';
import { ToastService } from 'angular-toastify';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'any' })
@Component({
  selector: 'app-view-cpy',
  templateUrl: './view-cpy.component.html',
  styleUrls: ['./view-cpy.component.scss'],
})
export class ViewCpyComponent implements OnInit {

  WORKDAYS = 'Workdays';
  NON_WORKDAYS = 'Non_workdays';
  CALLOUT = 'Call_Out';

  serviceUnavailable = '../../assets/img/serviceunavailable.png';
  noDataURL = '../../assets/img/nodata.png';
  users: string[] = [];
  userCpy: UserCpyResponse[] = [];
  mindate: string;
  maxdate: string;
  selectedUserCpy: UserCpy[] = [];
  selectedSupportAllowance: SupportAllowance[] = [];
  selectedShiftAllowance: ShiftAllowance[] = [];
  selectedOoh: Ooh[] = [];
  selectedOnCall: OnCall[] = [];
  selectedProjectDetails: ProjectDetails;
  submitLoader: boolean = false;
  generateLoader: boolean = false;
  serviceAvailability: boolean = true;
  editable: boolean = false;
  isAllUser: boolean = false;
  wfh: number;
  wfhValue: number[];
  cabNotAvailed: number;
  cabNotAvailedValue: number[];
  tabActive = 0;
  selectedTab: number;
  selectedTabIndex: number;
  selectedDateIndex: number;
  changedDate: string;
  onCallChanges: string[] = ['', '', '', '', '', ''];
  oohChanges: string[] = ['', '', '', '', ''];
  isAdmin: boolean = false;
  display: boolean = false;
  next: boolean = false;
  projectType: number = null;
  projectName: number = null;
  projectYear: number = null;
  componentIds: string[] = [];
  leaveType: string[] = [this.WORKDAYS, this.NON_WORKDAYS, this.CALLOUT];
  oohType: string[] = [this.WORKDAYS, this.NON_WORKDAYS];
  shiftSlab: string[] = ['6:30AM-03:30PM', '1-9PM/2:30PM-11:30PM', '11PM-7AM'];
  projectTypeList: string[] = ['Operations', 'Development', 'Testing'];
  projectTypeListValues: string[] = [
    'Support(L1_L2)',
    'DnD(Dev&L3)',
    'Testing',
  ];
  projectNameList: string[] = [];
  projectYearList: string[][] = [];
  componentIdList: string[][] = [];
  userIndex: number;
  monthIndex: number;
  isCurrentMonth: boolean = false;
  deleting: boolean = false;
  closeResult = '';
  currentMonth: number =
    new Date().getDate() > 20
      ? new Date().getMonth() + 1
      : new Date().getMonth();
  selectedTabName: string;
  years = [];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(
    private viewCpyService: ViewCpyService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private title: Title,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    private viewPortScroller: ViewportScroller
  ) {
    this.title.setTitle('View CPY | Gotcha');
  }

  cpyForm = this.formBuilder.group({
    user: [''],
    year: [''],
    month: [''],
  });

  ngOnInit(): void {
    this.isAdmin = this.cookieService.get('role') === 'ADMIN' ? true : false;
    this.getProjectDetails();
    if (this.isAdmin) {
      this.viewCpyService.getAllUserDetails().subscribe(
        (response: Response<UserCpyResponse[]>) => {
          response.message.forEach((item) => {
            this.users.push(item.name);
            this.userCpy.push(item);
          });
          this.users = ['All Users'].concat(this.users.sort());
        },
        () => {
          this.serviceAvailability = false;
          this.users = ['Service Unavailable'];
        }
      );
    } else {
      this.viewCpyService.getViewCpyData().subscribe(
        (response: Response<UserCpyResponse>) => {
          this.users.push(response.message.name);
          this.selectedUserCpy = response.message.userCPY;
          this.cpyForm.patchValue({ user: this.users[0] });
        },
        () => {
          this.serviceAvailability = false;
          this.users = ['Service Unavailable'];
        }
      );
    }
    for (let i = new Date().getFullYear(); i > 2020; i--) {
      this.years.push(i);
    }
  }

  onSelectChange() {
    this.cpyForm.value.user === 'All Users'
      ? (this.isAllUser = true)
      : (this.isAllUser = false);
    if (
      this.cpyForm.value.user &&
      this.cpyForm.value.year &&
      this.cpyForm.value.month
    ) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.isAllUser) {
      this.tabActive = 0;
      this.next = false;
      this.projectType = null;
      this.projectName = null;
      this.projectYear = null;
      this.display = true;
    } else {
      this.isCurrentMonth = false;
      this.submitLoader = true;
      this.editable = true;
      this.display = true;
      this.selectedSupportAllowance = [];
      this.selectedShiftAllowance = [];
      this.selectedOoh = [];
      this.selectedOnCall = [];
      this.selectedProjectDetails = null;
      this.tabActive = 0;
      this.projectType = null;
      this.projectName = null;
      this.projectYear = null;
      this.componentIds = [];
      this.next = false;
      this.wfh = 0;
      this.wfhValue = [0, 0, 0];
      this.cabNotAvailed = 0;
      this.cabNotAvailedValue = [0, 0, 0];
      this.mindate = '';
      this.maxdate = '';
      this.getMinAndMaxDate();
      this.getUserCpy();
      this.setProjectDetails();
      this.editable = this.isAdmin ? false : this.isEditable();
      this.submitLoader = false;
    }
  }

  isEditable(): boolean {
    let date = new Date();
    let edit = true;
    if (date.getFullYear().toString() === this.cpyForm.value.year.toString()) {
      if (date.getDate() < 21) {
        if (
          this.months.indexOf(this.cpyForm.value.month).toString() ===
          date.getMonth().toString()
        ) {
          this.isCurrentMonth = true;
          edit = false;
        }
      } else if (
        this.months.indexOf(this.cpyForm.value.month).toString() ===
        ((date.getMonth() + 1) % 12).toString()
      ) {
        this.isCurrentMonth = true;
        edit = false;
      }
    }
    return edit;
  }

  onGenerate() {
    this.generateLoader = true;
    if (this.isAllUser) {
      this.viewCpyService
        .generateAllCpy({
          month: (this.months.indexOf(this.cpyForm.value.month) + 1).toString(),
          year: this.cpyForm.value.year.toString(),
          projectName: this.projectNameList[this.projectName],
          projectType: this.projectTypeListValues[this.projectType],
        })
        .subscribe(
          () => {
            this.toastService.success('Cpy successfully generated!');
            this.toastService.success('File is downloading...');
            setTimeout(() => {
              this.download();
            }, 1000);
          },
          (error) => {
            this.generateLoader = false;
            this.toastService.error('Cpy generation failed!');
            this.toastService.error('Please try again later!');
            if (error.status == 401) {
              this.toastService.error('Session Timeout');
              this.cookieService.deleteAll();
              this.router.navigate(['/log-in']);
            }
          }
        );
    }
  }

  download() {
    this.viewCpyService
      .downloadCpy({
        month: this.cpyForm.value.month,
        year: this.cpyForm.value.year.toString(),
        projectName: this.projectNameList[this.projectName],
      })
      .subscribe(
        (response) => {
          this.downLoadFile(response, 'application/csv');
          this.toastService.success('File is downloaded');
          this.generateLoader = false;
        },
        (error) => {
          this.toastService.error('Cpy download failed!');
          this.generateLoader = false;
          if (error.status == 401) {
            this.toastService.error('Session Timeout');
            this.cookieService.deleteAll();
            this.router.navigate(['/log-in']);
          }
        }
      );
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: 'xlsx' });
    let url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `CPY_Template_${this.cpyForm.value.month
      }'${this.cpyForm.value.year.toString().slice(-2)}.xlsx`;
    link.click();
  }

  onDateAdd(tab: number, tabIndex?: number) {
    this.selectedTab = tab;
    this.changedDate = this.maxdate;
    switch (tab) {
      case 1:
        let day = 1;
        if (
          this.selectedSupportAllowance[tabIndex].leaveType === 'HalfDay Leave'
        )
          day = 0.5;
        this.selectedTabIndex = tabIndex;
        this.selectedDateIndex =
          this.selectedSupportAllowance[tabIndex].dates.length;
        this.selectedSupportAllowance[tabIndex].noOfDays =
          this.selectedSupportAllowance[tabIndex].dates.push(this.changedDate) *
          day;
        this.editable = true;
        this.selectedTabName = 'Support Allowance';
        break;
      case 2:
        this.selectedTabIndex = tabIndex;
        this.selectedDateIndex =
          this.selectedShiftAllowance[tabIndex].cabAvailedDates.length;
        this.selectedShiftAllowance[tabIndex].ccaAndwfhNoOfDays += 1;
        this.selectedShiftAllowance[tabIndex].cabAvailedDates.push(
          this.changedDate
        );
        this.cabNotAvailed = this.cabNotAvailedValue[tabIndex];
        this.wfh = this.wfhValue[tabIndex];
        this.selectedShiftAllowance[tabIndex].noOfDays += 1;
        this.editable = true;
        this.selectedTabName = 'Shift Allowance';
        break;
      case 3:
        this.selectedTabIndex =
          this.selectedOoh.push(new Ooh('', this.changedDate, '', '', '')) - 1;
        this.onDateEdit(tab, this.selectedTabIndex);
        break;
      case 4:
        this.selectedTabIndex =
          this.selectedOnCall.push(
            new OnCall(
              '',
              this.shiftSlab[1],
              this.changedDate,
              '12:00 AM',
              '8:00 AM',
              ""
            )
          ) - 1;
        this.onDateEdit(tab, this.selectedTabIndex);
        break;
    }
  }

  onDateEdit(tab: number, tabIndex: number, dateIndex?: number) {
    this.editable = true;
    this.selectedTab = tab;
    this.selectedTabIndex = tabIndex;
    switch (tab) {
      case 1:
        this.selectedDateIndex = dateIndex;
        this.changedDate =
          this.selectedSupportAllowance[tabIndex].dates[this.selectedDateIndex];
        this.selectedTabName = 'Support Allowance';
        break;
      case 2:
        this.selectedDateIndex = dateIndex;
        this.cabNotAvailed = this.cabNotAvailedValue[tabIndex];
        this.wfh = this.wfhValue[tabIndex];
        this.changedDate =
          this.selectedSupportAllowance[tabIndex].dates[this.selectedDateIndex];
        this.selectedTabName = 'Shift Allowance';
        break;
      case 3:
        this.oohChanges[0] = this.selectedOoh[tabIndex]['oohtype'];
        this.oohChanges[1] = this.selectedOoh[tabIndex]['date'];
        this.oohChanges[2] = this.selectedOoh[tabIndex]['startTime'];
        this.oohChanges[3] = this.selectedOoh[tabIndex]['endTime'];
        this.oohChanges[4] = this.selectedOoh[tabIndex]['description'];
        this.viewPortScroller.scrollToPosition([0, 1000]);
        this.selectedTabName = 'OOH';
        break;
      case 4:
        this.onCallChanges[0] = this.selectedOnCall[tabIndex]['OnCalltype'];
        this.onCallChanges[2] = this.selectedOnCall[tabIndex]['date'];
        this.onCallChanges[3] = this.selectedOnCall[tabIndex]['startTime'];
        this.onCallChanges[4] = this.selectedOnCall[tabIndex]['endTime'];
        this.onCallChanges[5] = this.selectedOnCall[tabIndex]['description'];
        this.viewPortScroller.scrollToPosition([0, 1000]);
        this.selectedTabName = 'OnCall';
        break;
    }
  }

  onDateChange(event, tab: number, dateIndex?: number) {
    switch (tab) {
      case 1:
        this.changedDate = event['target']?.['value'];
        break;
      case 2:
        this.changedDate = event['target']?.['value'];
        break;
      case 3:
        this.oohChanges[dateIndex] = event['target']?.['value'];
        break;
      case 4:
        this.onCallChanges[dateIndex] = event['target']?.['value'];
        if (this.onCallChanges[0] !== this.CALLOUT) {
          this.onCallChanges[3] = '12:00 AM';
          this.onCallChanges[4] = '08:00 AM';
        }
        break;
    }
  }

  onOohSubmit(
    type: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string,
    tab: number,
    tabIndex: number
  ) {
    this.oohChanges[0] = type;
    this.oohChanges[1] = date;
    this.oohChanges[2] = ('0' + startTime).slice(-8);
    this.oohChanges[3] = ('0' + endTime).slice(-8);
    this.oohChanges[4] = description;
    this.onDateSubmit(tab, tabIndex);
  }
  onOnCallSubmit(
    type: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string,
    tab: number,
    tabIndex: number
  ) {
    this.onCallChanges[0] = type;
    this.onCallChanges[2] = date;
    this.onCallChanges[3] = ('0' + startTime).slice(-8);
    this.onCallChanges[4] = ('0' + endTime).slice(-8);
    this.onCallChanges[5] = description;
    this.onDateSubmit(tab, tabIndex);
  }
  onDateSubmit(tab: number, tabIndex: number, dateIndex?: number) {
    let submit: boolean = true;
    switch (tab) {
      case 1:
        if (this.changedDate !== '') {
          if (
            (new Date(this.changedDate).getDay() === 0 ||
              new Date(this.changedDate).getDay() === 6) &&
            (tabIndex === 1 || tabIndex === 2)
          ) {
            this.toastService.info('Applying Leave on weekends is not allowed');
            submit = false;
          } else {
            this.selectedSupportAllowance[tabIndex].dates[dateIndex] =
              this.changedDate;
          }
        }
        break;
      case 2:
        this.selectedShiftAllowance[tabIndex].noOfDays +=
          this.cabNotAvailedValue[tabIndex] - this.cabNotAvailed;
        this.selectedShiftAllowance[tabIndex].noOfDays +=
          this.wfhValue[tabIndex] - this.wfh;
        this.selectedShiftAllowance[tabIndex].ccaAndwfhNoOfDays +=
          this.wfhValue[tabIndex] - this.wfh;
        this.selectedShiftAllowance[tabIndex].cabAvailedDates[dateIndex] =
          this.changedDate;
        break;
      case 3:
        if (
          this.checkOnCallDate(
            new Date(this.oohChanges[1]).toISOString().split('T')[0]
          )
        ) {
          this.selectedOoh[tabIndex]['oohtype'] = this.oohChanges[0];
          this.selectedOoh[tabIndex]['date'] = this.oohChanges[1];
          this.selectedOoh[tabIndex]['startTime'] = this.oohChanges[2];
          this.selectedOoh[tabIndex]['endTime'] = this.oohChanges[3];
          this.selectedOoh[tabIndex]['description'] = this.oohChanges[4];
          this.viewPortScroller.scrollToPosition([0, 0]);
        } else {
          this.toastService.info("Can't add oncall and ooh for same day");
          submit = false;
        }
        break;
      case 4:
        if (
          this.checkOohDate(
            new Date(this.onCallChanges[2]).toISOString().split('T')[0]
          )
        ) {
          this.selectedOnCall[tabIndex]['OnCalltype'] = this.onCallChanges[0];
          this.selectedOnCall[tabIndex]['date'] = this.onCallChanges[2];
          this.selectedOnCall[tabIndex]['startTime'] = this.onCallChanges[3];
          this.selectedOnCall[tabIndex]['endTime'] = this.onCallChanges[4];
          this.selectedOnCall[tabIndex]['description'] = this.onCallChanges[5];
          this.viewPortScroller.scrollToPosition([0, 0]);
        } else {
          this.toastService.info("Can't add oncall and ooh for same day");
          submit = false;
        }
        break;
    }
    if (submit) {
      this.apiRequest(tab);
      this.editable = false;
    }
  }

  onDateDelete(tab: number, tabIndex: number, dateIndex?: number) {
    this.deleting = true;
    switch (tab) {
      case 1:
        let day = 1;
        if (
          this.selectedSupportAllowance[tabIndex].leaveType === 'HalfDay Leave'
        )
          day = 0.5;
        this.selectedSupportAllowance[tabIndex].dates.splice(dateIndex, 1);
        this.selectedSupportAllowance[tabIndex].noOfDays =
          this.selectedSupportAllowance[tabIndex].dates.length * day;
        break;
      case 2:
        this.selectedShiftAllowance[tabIndex].cabAvailedDates.splice(
          dateIndex,
          1
        );
        this.selectedShiftAllowance[tabIndex].ccaAndwfhNoOfDays -= 1;
        this.selectedShiftAllowance[tabIndex].noOfDays -= 1;
        break;
      case 3:
        this.selectedOoh.splice(tabIndex, 1);
        break;
      case 4:
        this.selectedOnCall.splice(tabIndex, 1);
        break;
    }
    this.apiRequest(tab);
    this.editable = false;
  }

  openDeleteConfirmModal(
    deleteConfirm,
    tab: number,
    tabIndex: number,
    dateIndex?: number
  ) {
    this.selectedDateIndex = dateIndex;
    this.selectedTabIndex = tabIndex;
    this.selectedTab = tab;
    this.modalService
      .open(deleteConfirm, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getMinAndMaxDate() {
    this.mindate +=
      this.months.indexOf(this.cpyForm.value.month) === 0
        ? parseInt(this.cpyForm.value.year) - 1
        : this.cpyForm.value.year;
    this.maxdate += this.cpyForm.value.year;
    this.mindate += '-';
    this.maxdate += '-';
    this.mindate +=
      this.months.indexOf(this.cpyForm.value.month) === 0
        ? 12
        : ('0' + this.months.indexOf(this.cpyForm.value.month)).slice(-2);
    this.maxdate += (
      '0' + (this.months.indexOf(this.cpyForm.value.month) + 1).toString()
    ).slice(-2);
    this.mindate += '-21';
    this.maxdate += '-20';
  }

  getUserCpy() {
    if (this.isAdmin) {
      for (let i = 0; i < this.userCpy.length; i++) {
        if (
          this.userCpy[i].name.toLowerCase() ===
          this.cpyForm.value.user.toLowerCase()
        ) {
          this.selectedUserCpy = this.userCpy[i].userCPY;
          this.userIndex = i;
          break;
        }
      }
    }
    this.selectedSupportAllowance = this.getSupportAllowance(
      this.selectedSupportAllowance
    );
    this.selectedShiftAllowance = this.getShiftAllowance(
      this.selectedShiftAllowance
    );
    this.monthIndex = null;
    this.selectedUserCpy.forEach((item, index) => {
      const date = new Date(item.month);
      if (
        this.months[date.getMonth()] === this.cpyForm.value.month &&
        date.getFullYear() === parseInt(this.cpyForm.value.year)
      ) {
        if (
          new Date(
            parseInt(this.cpyForm.value.year),
            date.getMonth() - 1,
            21
          ) <= new Date(parseInt(this.cpyForm.value.year), date.getMonth(), 21)
        ) {
          this.selectedSupportAllowance = this.getSupportAllowance(
            item.supportAllowance
          );
          this.selectedShiftAllowance = this.getShiftAllowance(
            item.shiftAllowance
          );
          this.selectedOnCall = item.oncall;
          this.selectedOoh = item.ooh;
          this.selectedProjectDetails = item.projectDetails;
          this.monthIndex = index;
        }
      }
    });
  }
  getSupportAllowance(
    supportAllowanceList: SupportAllowance[]
  ): SupportAllowance[] {
    let newSupportAllowanceList: SupportAllowance[] = [
      new SupportAllowance('Holiday', 0, []),
      new SupportAllowance('HalfDay Leave', 0, []),
      new SupportAllowance('Leave', 0, []),
      new SupportAllowance('Comp Off', 0, []),
      new SupportAllowance('Non Support Work', 0, []),
    ];
    for (let j = 0; j < newSupportAllowanceList.length; j++) {
      for (let i = 0; i < supportAllowanceList.length; i++) {
        if (
          newSupportAllowanceList[j].leaveType ===
          supportAllowanceList[i].leaveType
        ) {
          newSupportAllowanceList[j].noOfDays =
            supportAllowanceList[i].noOfDays;
          newSupportAllowanceList[j].dates = supportAllowanceList[i].dates;
          break;
        }
      }
    }
    return newSupportAllowanceList;
  }
  getShiftAllowance(shiftAllowanceList: ShiftAllowance[]): ShiftAllowance[] {
    let newShiftAllowanceList: ShiftAllowance[] = [
      new ShiftAllowance('6:30AM-03:30PM', 0, 0, []),
      new ShiftAllowance('1-9PM/2:30PM-11:30PM', 0, 0, []),
      new ShiftAllowance('11PM-7AM', 0, 0, []),
    ];
    for (let j = 0; j < newShiftAllowanceList.length; j++) {
      for (let i = 0; i < shiftAllowanceList.length; i++) {
        if (
          newShiftAllowanceList[j].shiftSlab === shiftAllowanceList[i].shiftSlab
        ) {
          newShiftAllowanceList[j].noOfDays = shiftAllowanceList[i].noOfDays;
          newShiftAllowanceList[j].ccaAndwfhNoOfDays =
            shiftAllowanceList[i].ccaAndwfhNoOfDays;
          newShiftAllowanceList[j].cabAvailedDates =
            shiftAllowanceList[i].cabAvailedDates;
          this.wfhValue[j] =
            shiftAllowanceList[i].ccaAndwfhNoOfDays -
            shiftAllowanceList[i].cabAvailedDates.length;
          this.cabNotAvailedValue[j] =
            shiftAllowanceList[i].noOfDays -
            shiftAllowanceList[i].ccaAndwfhNoOfDays;
          break;
        }
      }
    }
    return newShiftAllowanceList;
  }
  getMonth(month: string) {
    let mon = month.split('-');
    return mon[1] + '/' + mon[2] + '/' + mon[0];
  }
  apiRequest(tab: number) {
    let adminRequest;
    let userRequest;
    switch (tab) {
      case 1:
        let supportList: SupportAllowanceRequest[] = [];
        for (let i = 0; i < this.selectedSupportAllowance.length; i++) {
          if (this.selectedSupportAllowance[i].noOfDays === 0) continue;
          let support: SupportAllowanceRequest = new SupportAllowanceRequest(
            this.selectedSupportAllowance[i].leaveType,
            this.selectedSupportAllowance[i].noOfDays,
            this.selectedSupportAllowance[i].dates
          );
          supportList.push(support);
        }
        let userCpySup: UserCpySupportAllowance = new UserCpySupportAllowance(
          this.getMonth(this.maxdate),
          supportList
        );
        adminRequest = new AdminRequest<UserCpySupportAllowance>(
          this.cpyForm.value.user,
          [userCpySup]
        );
        userRequest = new UserRequest<UserCpySupportAllowance>([userCpySup]);
        break;
      case 2:
        let shiftList: ShiftAllowanceRequest[] = [];
        for (let i = 0; i < this.selectedShiftAllowance.length; i++) {
          if (this.selectedShiftAllowance[i].noOfDays === 0) continue;
          let shift: ShiftAllowanceRequest = new ShiftAllowanceRequest(
            this.selectedShiftAllowance[i].shiftSlab,
            this.selectedShiftAllowance[i].noOfDays,
            this.selectedShiftAllowance[i].ccaAndwfhNoOfDays,
            this.selectedShiftAllowance[i].cabAvailedDates
          );
          shiftList.push(shift);
        }
        let userCpyShft: UserCpyShiftAllowance = new UserCpyShiftAllowance(
          this.getMonth(this.maxdate),
          shiftList
        );
        adminRequest = new AdminRequest<UserCpyShiftAllowance>(
          this.cpyForm.value.user,
          [userCpyShft]
        );
        userRequest = new UserRequest<UserCpyShiftAllowance>([userCpyShft]);
        break;
      case 3:
        let oohList: OohRequest[] = [];
        for (let i = 0; i < this.selectedOoh.length; i++) {
          let ooh: OohRequest = new OohRequest(
            this.selectedOoh[i].oohType,
            this.selectedOoh[i].date,
            this.selectedOoh[i].startTime,
            this.selectedOoh[i].endTime,
            this.selectedOoh[i].description
          );
          oohList.push(ooh);
        }
        let userCpyOoh: UserCpyOoh = new UserCpyOoh(
          this.getMonth(this.maxdate),
          oohList
        );
        adminRequest = new AdminRequest<UserCpyOoh>(this.cpyForm.value.user, [
          userCpyOoh,
        ]);
        userRequest = new UserRequest<UserCpyOoh>([userCpyOoh]);
        break;
      case 4:
        let onCallList: OnCallRequest[] = [];
        for (let i = 0; i < this.selectedOnCall.length; i++) {
          let onCall: OnCallRequest = new OnCallRequest(
            this.selectedOnCall[i].OnCalltype,
            this.selectedOnCall[i].date,
            this.selectedOnCall[i].startTime,
            this.selectedOnCall[i].endTime,
            this.selectedOnCall[i].description
          );
          onCallList.push(onCall);
        }
        let userCpyOnCall: UserCpyOnCall = new UserCpyOnCall(
          this.getMonth(this.maxdate),
          onCallList
        );
        adminRequest = new AdminRequest<UserCpyOnCall>(
          this.cpyForm.value.user,
          [userCpyOnCall]
        );
        userRequest = new UserRequest<UserCpyOnCall>([userCpyOnCall]);
        break;
    }
    this.viewCpyService
      .addOrUpdateOrDeleteCpy(tab, this.isAdmin ? adminRequest : userRequest)
      .subscribe(
        (response: Response<UserCpy[]>) => {
          this.toastService.success('Successfully Updated');
          this.isAdmin
            ? (this.userCpy[this.userIndex].userCPY = response.message)
            : (this.selectedUserCpy = response.message);
          this.deleting = false;
          this.modalService.dismissAll();
        },
        (error) => {
          if (error.status == 401) {
            this.toastService.error('Session Timeout');
            this.cookieService.deleteAll();
            this.router.navigate(['/log-in']);
          } else {
            this.toastService.error(
              'Something went wrong Please try again later'
            );
          }
          this.modalService.dismissAll();
          this.deleting = false;
        }
      );
  }
  getProjectDetails() {
    this.viewCpyService
      .getProjectDetails()
      .subscribe((response: Response<ProjectDetailsResponse[]>) => {
        response.message.forEach((item) => {
          let year: string[] = [];
          let comp = [];
          this.projectNameList.push(item.projectName);
          item.projectDetails.forEach((projectDetail) => {
            year.push(projectDetail.year);
            comp.push(projectDetail.componentId);
          });
          this.projectYearList.push(year);
          this.componentIdList.push(comp);
        });
      });
  }
  setProjectDetails() {
    if (this.selectedProjectDetails) {
      this.projectName = this.projectNameList.indexOf(
        this.selectedProjectDetails.projectName
      );
      this.projectType = this.projectTypeListValues.indexOf(
        this.selectedProjectDetails.projectType
      );
      this.projectYear = this.projectYearList[this.projectName].indexOf(
        this.cpyForm.value.year.toString()
      );
      this.selectedProjectDetails.componentId.forEach((item) => {
        this.componentIds.push(item);
      });
      this.tabActive = this.projectType + 1;
      this.next = true;
    }
  }
  checkOohDate(date: string): boolean {
    let status = true;
    this.selectedOoh.forEach((ooh) => {
      if (ooh.date.split('T')[0] === date) status = false;
    });
    return status;
  }
  checkOnCallDate(date: string): boolean {
    let status = true;
    this.selectedOnCall.forEach((onCall) => {
      if (onCall.date.split('T')[0] === date) status = false;
    });
    return status;
  }
  onSave() {
    let dates;
    let holidateDatesArray = [];
    let holidayData = {
      projectType: this.projectNameList[this.projectName],
    };
    this.viewCpyService.getHolidayDetails(holidayData).subscribe(
      (result: Response<Array<Object>>) => {
        result.message[0]?.['dates'].forEach((date) => {
          if (new Date(this.mindate).toISOString() < new Date(date).toISOString() && new Date(this.maxdate).toISOString() > new Date(date).toISOString()) {
            holidateDatesArray.push(date);
          }
        });
        let supportAllowanceData = new SupportAllowance(
          'Holiday',
          holidateDatesArray.length,
          holidateDatesArray
        );
        this.selectedSupportAllowance = this.getSupportAllowance([
          supportAllowanceData,
          this.selectedSupportAllowance[1],
          this.selectedSupportAllowance[2],
          this.selectedSupportAllowance[3],
          this.selectedSupportAllowance[4]
        ]);

        this.apiRequest(1);
      },
      (error) => {
        if (error.status == 401) {
          this.toastService.error('Session Timeout');
          this.cookieService.deleteAll();
          this.router.navigate(['/log-in']);
        } else {
          this.toastService.error(
            'Something went wrong Please try again later'
          );
        }
      }
    );


    this.next = true;
    let projectDetail: ProjDetails = new ProjDetails(
      this.projectNameList[this.projectName],
      this.projectTypeListValues[this.projectType],
      this.componentIds
    );
    let projectDetailRequest: ProjectDetailsRequest = new ProjectDetailsRequest(
      this.getMonth(this.maxdate),
      projectDetail
    );

    let adminRequest = new AdminRequest<ProjectDetailsRequest>(
      this.cpyForm.value.user,
      [projectDetailRequest]
    );
    let userRequest = new UserRequest([projectDetailRequest]);
    this.viewCpyService
      .addCpy(this.isAdmin ? adminRequest : userRequest)
      .subscribe(
        () => {
          this.toastService.success('successfully saved');
          if (this.isAdmin) {
            if (this.monthIndex) {
              this.userCpy[this.userIndex].userCPY[
                this.monthIndex
              ].projectDetails = new ProjectDetails(
                this.projectNameList[this.projectName],
                this.projectTypeListValues[this.projectType],
                this.componentIds
              );
            } else {
              let usercpy = new UserCpy(
                new Date(
                  parseInt(this.cpyForm.value.year),
                  this.months.indexOf(this.cpyForm.value.month),
                  21
                ).toISOString(),
                projectDetail,
                [],
                [],
                [],
                []
              );
              this.monthIndex =
                this.userCpy[this.userIndex].userCPY.push(usercpy) - 1;
            }
          } else {
            if (this.monthIndex) {
              this.selectedUserCpy[this.monthIndex].projectDetails =
                new ProjectDetails(
                  this.projectNameList[this.projectName],
                  this.projectTypeListValues[this.projectType],
                  this.componentIds
                );
            } else {
              this.monthIndex =
                this.selectedUserCpy.push(
                  new UserCpy(
                    new Date(
                      parseInt(this.cpyForm.value.year),
                      this.months.indexOf(this.cpyForm.value.month),
                      21
                    ).toISOString(),
                    projectDetail,
                    [],
                    [],
                    [],
                    []
                  )
                ) - 1;
            }
          }
        },
        (error) => {
          if (error.status == 401) {
            this.toastService.error('Session Timeout');
            this.cookieService.deleteAll();
            this.router.navigate(['/log-in']);
          } else {
            this.toastService.error(
              'Something went wrong Please try again later'
            );
          }
        }
      );
  }
}
