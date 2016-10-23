import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGaurdService} from './services/AuthGuard/auth-guard.service'
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    loadChildren: 'app/components/login/login.module#LoginModule'
  },
  { 
    path: 'welcome', 
    loadChildren: 'app/components/welcome/welcome.module#WelcomeModule',
    canActivate: [AuthGaurdService] 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGaurdService],
  exports: [RouterModule]
})
export class AppRoutingModule {}