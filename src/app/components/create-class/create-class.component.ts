import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent {


  private classes : FirebaseListObservable<any[]>;

  constructor(public fb: FirebaseService) {  }

  emit(value){
    this.classes = value;
  }

  onSelectClass(value){
    console.log(value);
    this.fb.deleteValue('Class/' + value.$key);
      this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
       this.fb.deleteValue('Schedule/'+user.schedule+'/'+value.$key);
      })
    });
  }

}