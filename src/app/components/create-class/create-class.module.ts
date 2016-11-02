import { NgModule } from '@angular/core';
import { CreateClassComponent } from './create-class.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateClassRoutingModule} from './create-class-routing.module';
import {AddClassComponent} from '../add-class/add-class.component';

@NgModule({
  imports: [
    SharedModule,
    CreateClassRoutingModule
  ],
  declarations: [CreateClassComponent, AddClassComponent]
})
export class CreateClassModule { }
