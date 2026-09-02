import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogInRoutingModule } from './log-in-routing.module';
import { LogInComponent } from './log-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared-components/header/header.module';
import { FooterModule } from 'src/app/shared-components/footer/footer.module';

@NgModule({
  declarations: [LogInComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LogInRoutingModule,
    HeaderModule,
    FooterModule,
  ],
})
export class LogInModule {}
