import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from 'src/app/services/signup.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewCpyService } from 'src/app/services/view-cpy.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Response } from 'src/app/models/response.model';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from 'src/app/models/user-info.model';
import { UserCpyResponse } from 'src/app/models/usercpy.model';
import { LoginService } from 'src/app/services/login.service';
import { ProjectDetailsResponse } from 'src/app/models/projectDetails.model';
import { Title } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { BackendProjectConstants } from 'src/app/properties/bakend-api.properties';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private loginService: LoginService,
    private signUpService: SignupService,
    private modalService: NgbModal,
    private viewCpyService: ViewCpyService,
    private profileService: ProfileService,
    private toastService: ToastService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private title: Title
  ) {
    this.title.setTitle('Profile | Gotcha');
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }
  fileUploadURL = BackendProjectConstants.fileUpload;
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
  uploading: boolean = false;
  deleting: boolean = false;

  public uploader: FileUploader = new FileUploader({
    authToken: this.cookieService.get(BackendProjectConstants.cookieAuthCodeKey),
    url: this.fileUploadURL,
    itemAlias: "file",
  });

  upload() {
    this.uploading = true;
    if (this.uploader.queue.length > 1) {
      this.uploader.queue = [this.uploader.queue[this.uploader.queue.length - 1]];
    }
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item: any) => {
      if (item.isSuccess) {
        this.modalService.dismissAll();
        this.toastService.success('File Uploaded');
      }
      else {
        this.toastService.error('Something went wrong');
      }
      this.uploading = false;
    };
  }

  ngOnInit() {

    this.isAdmin = this.cookieService.get('role') === 'ADMIN' ? true : false;
    this.loginService.currentdata.subscribe((data) => {
      if (data === null) {
        this.viewCpyService.getViewCpyData().subscribe((response: Response<UserCpyResponse>) => {
          this.userInfo.name = response.message.name;
          this.userInfo.empId = response.message.empId;
          this.userInfo.username = response.message.username;
          this.userInfo.role = response.message.role;
        });
      }
      else {
        this.userInfo = data;
      }
    }
    );
    if (this.isAdmin) {
      this.viewCpyService.getAllUserDetails().subscribe((data) => {
        data['message'].forEach((item) => {
          this.users.push({
            name: item.name,
            role: item.role,
            username: item.username,
            active: item.emailVerified,
          });
        });
      });
      this.profileService.getProjectDetails().subscribe((response: Response<ProjectDetailsResponse[]>) => {
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
          this.projectYear.push(year.length - 1);
        })
      });
    }
    for (let i = new Date().getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  isAdmin: boolean = false;
  showResetPasswordModal: boolean = false;
  userInfo: UserInfo = new UserInfo('', '', 0, '');
  users = [];
  index = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  errorMessage = '';
  errorMsg: boolean = false;
  projectNameList: string[] = [];
  projectYearList: string[][] = [];
  componentIdList: string[][] = [];
  editable: boolean = false;
  projectName: number;
  projectYear: number[] = [];
  componentId: number;
  showProjectDetailsForm: boolean = false;
  hideAddButton: boolean = true;
  showSubmitButton: boolean = false;
  message: string;
  closeResult = '';
  pname: number;
  id: number;

  resetForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  projectDetailsForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    componentId: new FormControl('', [Validators.required]),
  });

  submitResetPassword() {
    this.signUpService
      .resetPassword({
        username: this.userInfo.username,
        password: this.resetForm.value.password,
      })
      .subscribe(
        (response: Response<string>) => {
          this.resetForm.setValue({ password: '', confirmPassword: '' });
          this.toastService.success(response.message);
          this.modalService.dismissAll();
        },
        (error) => {
          if (error.status == 401) {
            this.toastService.error('Session Timout');
            this.cookieService.deleteAll();
            this.router.navigate(['/log-in']);
          }
          else
            this.toastService.error('Something went wrong');
        }
      );
  }

  closeResetPassword() {
    this.showResetPasswordModal = false;
  }

  openResetPasswordModal(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openAddProjectDetailsModal(projectDetails) {
    this.modalService
      .open(projectDetails, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openFileUploadModal(fileUpload) {
    this.modalService
      .open(fileUpload, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openDeleteConfirmModal(deleteConfirm, pname, id) {
    this.pname = pname;
    this.id = id;
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

  onTableDataChange(event: any) {
    this.page = event;
  }

  changeRole(name: string) {
    this.profileService.changeRole(name).subscribe(
      (response: Response<string>) => {
        this.toastService.success('Successfully changed the role');
        this.users.filter((user) => user.name === name)[0].role = this.users.filter((user) => user.name === name)[0].role === 'ADMIN' ? 'USER' : 'ADMIN';
      },
      (error) => {
        if (error.status !== 504) {
          this.errorMsg = true;
          this.errorMessage = error.error.error;
        }
        if (error.status === 504) {
          this.errorMsg = true;
          this.errorMessage = 'Service unavailable';
        }
        if (error.status == 401) {
          this.toastService.error('Session Timout');
          this.cookieService.deleteAll();
          this.router.navigate(['/log-in']);
        }
      }
    );
  }

  activateUserAccount(name: string) {
    this.profileService.activateUserAccoount(name).subscribe(
      (response: Response<string>) => {
        this.toastService.success('Successfully activated');
        this.users.filter((user) => user.name === name)[0].active = !this.users.filter((user) => user.name === name)[0].active
      },
      (error) => {
        if (error.status !== 504) {
          this.errorMsg = true;
          this.errorMessage = error.error.error;
        }
        if (error.status === 504) {
          this.errorMsg = true;
          this.errorMessage = 'Service unavailable';
        }
        if (error.status == 401) {
          this.toastService.error('Session Timout');
          this.cookieService.deleteAll();
          this.router.navigate(['/log-in']);
        }
      }
    );
  }

  addComp(pname) {
    this.projectName = pname;
    this.componentIdList[this.projectName][this.projectYear[this.projectName]] = this.componentIdList[this.projectName][this.projectYear[this.projectName]].concat('');
    this.componentId = this.componentIdList[this.projectName][this.projectYear[this.projectName]].length - 1;
    this.editable = true;
    this.viewPortScroller.scrollToAnchor(pname + "-" + (this.componentIdList[this.projectName][this.projectYear[this.projectName]].length - 5));
  }

  editComp(pname, id) {
    this.projectName = pname;
    this.componentId = id;
    this.editable = true;
  }

  onChange(event, pname, id) {
    this.componentIdList[pname][this.projectYear[pname]] =
      this.componentIdList[pname][this.projectYear[pname]].slice(0, id)
        .concat(event.target.value)
        .concat(this.componentIdList[pname][this.projectYear[pname]].slice(id + 1));
  }
  deleteComp() {
    this.deleting = true;
    this.editable = false;
    this.projectName = this.pname;
    this.componentId = this.id;
    this.componentIdList[this.pname][this.projectYear[this.projectName]] =
      this.componentIdList[this.pname][this.projectYear[this.projectName]].slice(0, this.id)
        .concat(this.componentIdList[this.pname][this.projectYear[this.projectName]].slice(this.id + 1));
    this.onSubmit();
  }
  onSubmit() {
    this.editable = false;
    let data = {
      projectName: this.projectNameList[this.projectName],
      year: this.projectYearList[this.projectName][this.projectYear[this.projectName]],
      componentId: this.componentIdList[this.projectName][this.projectYear[this.projectName]]
    }
    this.profileService.editProjectDetails(data).subscribe((data) => {
      this.toastService.success('components updated successfully');
      this.modalService.dismissAll();
      this.deleting = false;
    }, (error) => {
      if (error.status == 401) {
        this.toastService.error('Session Timout');
        this.cookieService.deleteAll();
        this.router.navigate(['/log-in']);
      }
      this.modalService.dismissAll();
      this.deleting = false;
    });
  }

  createNewInputFields() {
    this.showProjectDetailsForm = true;
    this.hideAddButton = false;
  }

  submitProjectDetails() {
    let componentIdArray = [this.projectDetailsForm.value.componentId];
    let data = {
      projectName: this.projectDetailsForm.value.projectName,
      year: this.projectDetailsForm.value.year,
      componentId: componentIdArray,
    };
    this.profileService.addProjectDetails(data).subscribe(
      (response: Response<string>) => {
        window.location.reload();
      },
      (error) => {
        if (error.status !== 504) {
          this.errorMsg = true;
          this.errorMessage = error.error.error;
        }
        if (error.status === 504) {
          this.errorMsg = true;
          this.errorMessage = 'Service unavailable';
        }
        if (error.status == 401) {
          this.toastService.error('Session Timout');
          this.cookieService.deleteAll();
          this.router.navigate(['/log-in']);
        }
      }
    );
  }

  changeYear(event, nameIndex) {
    this.projectYear[nameIndex] = parseInt(event.target.value);
  }
}
