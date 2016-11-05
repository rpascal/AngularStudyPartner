import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FirebaseService} from '../services/firebase/firebase.service';
import {YourService} from '../components/a-Class-service/class.service';


@NgModule({
  imports:      [ CommonModule ],
  declarations: [],
  providers: [FirebaseService, YourService],
  exports:      [ CommonModule, FormsModule,HttpModule,NgbModule]
})
export class SharedModule { }
