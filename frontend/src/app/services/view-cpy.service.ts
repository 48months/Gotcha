import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendProjectConstants } from '../properties/bakend-api.properties';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '../models/response.model';
import { UserCpyResponse } from '../models/usercpy.model';
import { ProjectDetailsResponse } from '../models/projectDetails.model';
@Injectable({
  providedIn: 'root',
})
export class ViewCpyService {
  key = BackendProjectConstants.cookieAuthCodeKey;
  viewCpyURL = BackendProjectConstants.viewCpy;
  adminViewcpyURL = BackendProjectConstants.adminViewCpy;
  generateAllCpyURL = BackendProjectConstants.generateAllCpyURL;
  downloadReport = BackendProjectConstants.downloadCpy;
  supportCpyURL = BackendProjectConstants.supportCpy;
  shiftCpyURL = BackendProjectConstants.shiftCpy;
  onCallCpyURL = BackendProjectConstants.onCallCpy;
  oohCpyURL = BackendProjectConstants.oohCpy;
  getProjectDetailsURL = BackendProjectConstants.getProjectDetails;
  addCpyURL = BackendProjectConstants.addCpy;
  getHolidayDetailsURL = BackendProjectConstants.getHolidayDetails;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getViewCpyData() {
    return this.http.get<Response<UserCpyResponse>>(this.viewCpyURL, {
      headers: { Authorization: this.cookie.get(this.key) },
    });
  }

  getAllUserDetails() {
    return this.http.get<Response<UserCpyResponse[]>>(this.adminViewcpyURL, {
      headers: { Authorization: this.cookie.get(this.key) },
    });
  }

  generateAllCpy(userData) {
    return this.http.post(this.generateAllCpyURL, userData, {
      headers: { Authorization: this.cookie.get(this.key) },
    });
  }

  downloadCpy(userData) {
    const headers = new HttpHeaders()
      .set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .set(
        'Accept',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .set('responseType', 'blob')
      .set('Authorization', this.cookie.get(this.key));

    return this.http.get(this.downloadReport, {
      responseType: 'arraybuffer',
      headers: headers,
      params: userData,
    });
  }

  addOrUpdateOrDeleteCpy(tab, userBody) {
    let url = '';
    switch (tab) {
      case 1:
        url = this.supportCpyURL;
        break;
      case 2:
        url = this.shiftCpyURL;
        break;
      case 3:
        url = this.oohCpyURL;
        break;
      case 4:
        url = this.onCallCpyURL;
        break;
    }
    return this.http.post(url, userBody, {
      headers: {
        Authorization: this.cookie.get(this.key),
      },
    });
  }

  getProjectDetails() {
    return this.http.get<Response<ProjectDetailsResponse[]>>(
      this.getProjectDetailsURL,
      {
        headers: {
          Authorization: this.cookie.get(this.key),
        },
      }
    );
  }

  addCpy(userData) {
    return this.http.post(this.addCpyURL, userData, {
      headers: {
        Authorization: this.cookie.get(this.key),
      },
    });
  }

  getHolidayDetails(data) {
    return this.http.post(this.getHolidayDetailsURL, data, {
      headers: {
        Authorization: this.cookie.get(this.key),
      },
    });
  }
}
