import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../app/guard/login.guard';
import { NotLoginGuard } from './guard/not-login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./main-components/log-in/log-in.module').then(
        (m) => m.LogInModule
      ),
    canActivate: [NotLoginGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./main-components/sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
    canActivate: [NotLoginGuard],
  },
  {
    path: 'log-in',
    loadChildren: () =>
      import('./main-components/log-in/log-in.module').then(
        (m) => m.LogInModule
      ),
    canActivate: [NotLoginGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./main-components/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
    canActivate: [LoginGuard],
  },
  {
    path: 'view-cpy',
    loadChildren: () =>
      import('./main-components/view-cpy/view-cpy.module').then(
        (m) => m.ViewCpyModule
      ),
    canActivate: [LoginGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./main-components/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'password-reset/:id/:token',
    loadChildren: () =>
      import('./main-components/password-reset/password-reset.module').then(
        (m) => m.PasswordResetModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./main-components/page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
