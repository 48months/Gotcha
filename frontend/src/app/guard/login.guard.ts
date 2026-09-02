import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { BackendProjectConstants } from '../properties/bakend-api.properties';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cookieService.get(BackendProjectConstants.cookieAuthCodeKey)) {
      return true;
    } else {
      // alert("you are not logged in! Please log in");
      this.router.navigate([BackendProjectConstants.loginPage]);
      return false;
    }
  }
}
