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
export class NotLoginGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cookieService.get(BackendProjectConstants.cookieAuthCodeKey)) {
      this.router.navigate([BackendProjectConstants.viewCpyPage]);
      return false;
    } else {
      return true;
    }
  }
}
