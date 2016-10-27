import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {InputDebounceComponent} from "./InputDebounceComponent.component";



@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomeComponent, InputDebounceComponent]
})
export class HomeModule { }
