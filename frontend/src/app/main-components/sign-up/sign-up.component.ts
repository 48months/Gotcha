import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Response } from 'src/app/models/response.model';
import { User } from 'src/app/models/user.model';
import { SignupService } from 'src/app/services/signup.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  terms: boolean = true;
  qrcode: string;
  signupForm: FormGroup;
  twoFactor: boolean = true;
  userData: User;
  error: string;
  success: string;
  loader: boolean = false;
  signUpFormSubmitted: boolean = false;

  constructor(private title: Title, private signupService: SignupService) {
    this.title.setTitle('Signup');
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern('^.+@thbs.com'),
      ]),
      password: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      empId: new FormControl(null, Validators.required),
    });
  }

  onSignup() {
    this.loader = true;
    this.userData = new User(
      this.signupForm.value.username.toLowerCase(),
      this.signupForm.value.password,
      this.signupForm.value.name,
      this.signupForm.value.empId,
      true
    );
    this.error = null;
    this.success = null;
    this.signupService.signup(this.userData).subscribe(
      (response: Response<string>) => {
        this.signUpFormSubmitted = true;
        this.qrcode = response.message;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.error = error.error['error'];
        if (this.error == null) {
          this.error = 'something went wrong, please try again';
        }
      }
    );
  }
}
