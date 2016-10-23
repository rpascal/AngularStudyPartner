import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {LoginRoutingModule} from './login-routing.module';
//import { FormsModule }         from '@angular/forms';
import {SharedModule} from '../../shared/shared.module'

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
