import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';
import { UpdateProfileComponent }    from './update-profile.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: UpdateProfileComponent }
  ])],
  exports: [RouterModule]
})
export class UpdateProfileRoutingModule {}
