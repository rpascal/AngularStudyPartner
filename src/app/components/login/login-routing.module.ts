import { NgModule }            from '@angular/core';
import { Routes, RouterModule }        from '@angular/router';

import { LoginComponent }    from './login.component';


const routes: Routes = [
 // { path: '', redirectTo: '', pathMatch: 'full'},
  { path: '',    component: LoginComponent },
 // { path: ':id', component: CrisisDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
