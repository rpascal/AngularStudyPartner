import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent {


  private classes: FirebaseListObservable<any[]>;

  constructor(public fb: FirebaseService,
    public scheduleService: ScheduleService,
    public UserService: UserService) { }

  emit(value) {
    this.classes = value;
  }

  onSelectClass(value) {
    this.UserService.getUser().subscribe(user =>{
    let schedule = user.schedule;
    this.fb.deleteValue('Schedule/' + schedule + '/' + value.$key);
    const t = this.scheduleService.checkExists(value.$key, schedule);
    if (!t) {
      this.fb.deleteValue('Class/' + value.$key);
    }
     });
  }

}