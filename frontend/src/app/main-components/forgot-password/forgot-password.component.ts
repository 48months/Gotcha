import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  bgImgUrl = '../assets/img/curved6.jpg';
  successMessage: String = '';
  failureMessage: string = '';

  emailPattern =
    /^(?!.*[!@#$%^&*()\-+=[\]|\\<.>\/?]{2})(?!.*[_]{2})[a-z0-9#$._%+-]+@(?!.*?\.\.)[a-z0-9.-]+\.[a-z]{1,5}$/;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.forgetPasswordForm.patchValue({
      username: this.router.getCurrentNavigation().extras.state?.['email'],
    });
  }

  ngOnInit(): void {}
  forgetPasswordForm = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.pattern(this.emailPattern)],
    ],
  });
  get username() {
    return this.forgetPasswordForm.get('username');
  }

  submitForgetPassword() {
    this.loginService
      .forgotPassword(this.forgetPasswordForm.value.username)
      .subscribe(
        (response) => {
          this.successMessage = response['message'];
        },
        (error) => {
          console.error(error);
          this.failureMessage = 'Please Enter valid username';
        }
      );
  }
}
