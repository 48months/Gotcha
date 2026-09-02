import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JsonPipe } from '@angular/common';
import { BackendProjectConstants } from '../properties/bakend-api.properties';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  changerole = BackendProjectConstants.changeRole;
  activateUserAccount = BackendProjectConstants.activateUserAccount;
  projectDetails = BackendProjectConstants.projectDetails;
  addProjectDetailsUrl = BackendProjectConstants.addProjectDetails;
  editProjectDetailsUrl = BackendProjectConstants.editProjectDetails;
  key = BackendProjectConstants.cookieAuthCodeKey;

  array: any = [];
  beareToken: string;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    this.beareToken = this.cookieService.get(this.key);
  }

  changeRole(name) {
    const httpOptions = new HttpHeaders({
      Authorization: this.beareToken,
    });
    let requestBody = {
      name: name,
    };
    return this.httpClient.post(this.changerole, requestBody, {
      headers: httpOptions,
    });
  }

  activateUserAccoount(name) {
    const httpOptions = new HttpHeaders({
      Authorization: this.beareToken,
    });
    let requestBody = {
      name: name,
    };
    return this.httpClient.post(this.activateUserAccount, requestBody, {
      headers: httpOptions,
    });
  }

  getProjectDetails() {
    const httpOptions = new HttpHeaders({
      Authorization: this.beareToken,
    });
    return this.httpClient.get(this.projectDetails, {
      headers: httpOptions,
    });
  }

  addProjectDetails(data) {
    const httpOptions = new HttpHeaders({
      Authorization: this.beareToken,
    });
    return this.httpClient.post(this.addProjectDetailsUrl, data, {
      headers: httpOptions,
    });
  }

  editProjectDetails(data) {
    const httpOptions = new HttpHeaders({
      Authorization: this.beareToken,
    });
    return this.httpClient.post(this.editProjectDetailsUrl, data, {
      headers: httpOptions,
    });
  }
}
