import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCpyComponent } from './view-cpy.component';

const routes: Routes = [{ path: '', component: ViewCpyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCpyRoutingModule { }
