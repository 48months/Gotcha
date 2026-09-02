import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from 'src/app/models/user-info.model';
import { BackendProjectConstants } from 'src/app/properties/bakend-api.properties';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  hasTwoFactorAuth: boolean = false;
  bgImgUrl = '../assets/img/curved6.jpg';
  errorMsg!: String;
  userInfo: UserInfo;
  loader: boolean = false;
  emailPattern =
    /^(?!.*[!@#$%^&*()\-+=[\]|\\<.>\/?]{2})(?!.*[_]{2})[a-z0-9#$._%+-]+@(?!.*?\.\.)[a-z0-9.-]+\.[a-z]{1,5}$/;

  constructor(
    private title: Title,
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService
  ) {
    this.title.setTitle('Login');
  }

  loginForm = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.pattern(this.emailPattern)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    twofactorLoginToken: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get twofactorLoginToken() {
    return this.loginForm.get('twofactorLoginToken');
  }

  checkTwoFactor() {
    if (this.username.valid) {
      this.loginService
        .checkTwoFactor(this.username.value)
        .subscribe(
          (data) =>
            (this.hasTwoFactorAuth = data['message'] === 'true' ? true : false)
        );
    }
  }

  onSubmit() {
    this.loader = true;
    this.loginService.login(this.loginForm.value).subscribe(
      (response: Response) => {
        this.loader = false;
        if (response['emailVerified'] == false) {
          this.errorMsg = "Your account is not activated! please contact your admin to activate your account.";
        }
        else {
          this.cookieService.set(
            BackendProjectConstants.cookieAuthCodeKey,
            'Bearer ' + response['message'],
            null, null, null, true
          );
          this.router.navigate(['/view-cpy']);
          this.userInfo = new UserInfo(
            response['username'],
            response['name'],
            response['role'],
            response['empId']
          );
          this.loginService.pushUserInfo(this.userInfo);
          this.cookieService.set('role', response['role'], null, null, null, true)
        }
      },
      (error) => {
        this.loader = false;
        if (error.status !== 504) {
          this.errorMsg = error.error.error;
        }
        if (error.status === 504) {
          this.errorMsg = 'Service unavailable';
        }
      }
    );
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password'], {
      state: { email: this.loginForm.value.username },
    });
  }
}
