import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    public authService: AuthService
  ) { }
  isLogIn: boolean = false;
  isProfile: boolean = false;
  isDashboard: boolean = false;

  ngOnInit(): void { }

  getNavigate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/log-in']);
    }
    else {
      this.router.navigate(['/view-cpy']);
    }
  }

  getLogOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['/log-in']);
  }

  isRouteActive(url: any): boolean {
    return !this.router.isActive(url, true);
  }
}
