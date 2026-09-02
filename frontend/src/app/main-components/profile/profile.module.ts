import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AvatarModule } from 'ngx-avatars';
import { HeaderModule } from 'src/app/shared-components/header/header.module';
import { FooterModule } from 'src/app/shared-components/footer/footer.module';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    AvatarModule,
    HeaderModule,
    FooterModule,
    FileUploadModule
  ],
  exports: [],
})
export class ProfileModule { }
