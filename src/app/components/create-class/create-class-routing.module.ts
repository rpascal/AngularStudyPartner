import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { CreateClassComponent } from './create-class.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: CreateClassComponent }
  ])],
  exports: [RouterModule]
})
export class CreateClassRoutingModule {}
