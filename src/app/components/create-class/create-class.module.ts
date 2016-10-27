import { NgModule } from '@angular/core';
import { CreateClassComponent } from './create-class.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateClassRoutingModule} from './create-class-routing.module';
@NgModule({
  imports: [
    SharedModule,
    CreateClassRoutingModule
  ],
  declarations: [CreateClassComponent]
})
export class CreateClassModule { }
