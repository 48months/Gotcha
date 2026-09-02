import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from '../models/user-info.model';
import { BackendProjectConstants } from '../properties/bakend-api.properties';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userInfo: any;
  signinURL = BackendProjectConstants.signinURL;
  twoFactorURL = BackendProjectConstants.twoFactorURL;
  forgotPasswordURL = BackendProjectConstants.forgotPasswordURL;
  resetPassworURL = BackendProjectConstants.resetPasswordURL;
  constructor(private http: HttpClient) { }

  login(userData) {
    if (userData.twofactorLoginToken === '') {
      return this.http.post(this.signinURL, {
        username: userData.username,
        password: userData.password,
      });
    }
    return this.http.post(this.signinURL, userData);
  }

  checkTwoFactor(username) {
    return this.http.post(this.twoFactorURL, { username: username });
  }
  forgotPassword(username) {
    return this.http.post(this.forgotPasswordURL, { username: username });
  }
  resetPassword(id, token, password) {
    return this.http.post(this.resetPassworURL + '/' + id + '/' + token, {
      password: password,
    });
  }

  private datasource = new BehaviorSubject<any>(null);
  currentdata = this.datasource.asObservable();

  pushUserInfo(data: any) {
    this.datasource.next(data);
  }
}
