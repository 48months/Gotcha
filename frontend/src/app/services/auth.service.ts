import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BackendProjectConstants } from '../properties/bakend-api.properties';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService) {}
  isLoggedIn() {
    if (this.cookieService.get(BackendProjectConstants.cookieAuthCodeKey)) {
      return true;
    } else {
      return false;
    }
  }
}
