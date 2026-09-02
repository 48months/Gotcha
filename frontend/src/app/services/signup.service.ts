import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../models/response.model';
import { BackendProjectConstants } from '../properties/bakend-api.properties';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  signupURL = BackendProjectConstants.signupURL;
  constructor(private http: HttpClient) {}

  signup(userData) {
    return this.http.post<Response<string>>(this.signupURL, userData);
  }

  resetPassword(userData) {
    return this.http.post<Response<string>>(
      BackendProjectConstants.resetPassword,
      userData
    );
  }
}
