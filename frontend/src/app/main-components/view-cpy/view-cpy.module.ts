import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewCpyRoutingModule } from './view-cpy-routing.module';
import { ViewCpyComponent } from './view-cpy.component';
import { HeaderModule } from 'src/app/shared-components/header/header.module';
import { FooterModule } from 'src/app/shared-components/footer/footer.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ViewCpyComponent],
  imports: [
    CommonModule,
    ViewCpyRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    NgxMaterialTimepickerModule,
    NgxPaginationModule,
  ],
})
export class ViewCpyModule { }
