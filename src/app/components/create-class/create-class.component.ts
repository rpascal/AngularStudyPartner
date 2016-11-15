import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';
import { ClassModel, ClassService} from '../../services/class-service/class.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent {


  private classes: FirebaseListObservable<any[]>;

  constructor(public fb: FirebaseService,
    public scheduleService: ScheduleService,
    public UserService: UserService,
    public classService : ClassService) { }

  emit(value) {
    this.classes = value;
  }
  onSelectClass(value){
    let temp : Array<any> = [];
    let users = this.UserService.getListOfUsers(value.Users);
    users.forEach(user => {
    
    let schedule =  this.scheduleService.getSchdule(user.schedule);
      let classes = this.classService.getCertainClasses(schedule);
      console.log(classes);
      classes.forEach(cla =>{
        let start : Date = new Date(cla.startDate);
        let end : Date = new Date(cla.endDate);
        temp.push({
          startDate : start,
          endDate : end,
          user : user.$key
        });
      });
    });
    console.log('blah');
    console.log(temp);
  }




  onDeleteClass(value) {
   // console.log(value);
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