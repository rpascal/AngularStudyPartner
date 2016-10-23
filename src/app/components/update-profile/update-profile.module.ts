import { NgModule } from '@angular/core';
import { UpdateProfileComponent } from './update-profile.component';
import {SharedModule} from '../../shared/shared.module';
import {UpdateProfileRoutingModule} from './update-profile-routing.module'

@NgModule({
  imports: [
    SharedModule,
    UpdateProfileRoutingModule
  ],
  declarations: [UpdateProfileComponent]
})
export class UpdateProfileModule { }
