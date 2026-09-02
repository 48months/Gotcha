import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  bgImgUrl = '../assets/img/curved6.jpg';
  id: string = '';
  token: string = '';
  successMessage: string = '';
  failureMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }
  resetPasswordForm = this.formBuilder.group({
    password: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
  });

  get password() {
    return this.resetPasswordForm.get('password');
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }
  submitResetPassword() {
    this.loginService
      .resetPassword(this.id, this.token, this.resetPasswordForm.value.password)
      .subscribe(
        (response) => {
          this.successMessage = response['message'];
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['log-in']);
          }, 2000);
        },
        (error) => {
          console.error(error);
          this.failureMessage = 'Invalid link or Expired';
        }
      );
  }
}
