import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderModule } from './shared-components/header/header.module';
import { FooterModule } from './shared-components/footer/footer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService, AngularToastifyModule } from 'angular-toastify';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    JsonPipe,
    HeaderModule,
    FooterModule,
    AngularToastifyModule,
    BrowserAnimationsModule
  ],
  providers: [CookieService, ToastService],
  bootstrap: [AppComponent],
})
export class AppModule { }
