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
    let tempEarliestTime : Date = new Date();
      tempEarliestTime.setHours(9);
        tempEarliestTime.setMinutes(0);
   
      tempEarliestTime.setFullYear(2000);
        tempEarliestTime.setMonth(1);
        tempEarliestTime.setSeconds(0);
        tempEarliestTime.setDate(0);
        tempEarliestTime.setMilliseconds(0);

      // console.log(tempEarliestTime);
    let tempLatestTime : Date = new Date();
     tempLatestTime.setHours(17);
        tempLatestTime.setMinutes(0);
        tempLatestTime.setMonth(1);
        tempLatestTime.setSeconds(0);
        tempLatestTime.setDate(0);
        tempLatestTime.setMilliseconds(0);
       




    this.UserService.getUser().subscribe(currentUser =>{
    let temp : Array<any> = [];
    let users = this.UserService.getListOfUsers(value.Users);
   // value.Users.r
    users.forEach(user => {
    
    let schedule =  this.scheduleService.getSchdule(user.schedule);

      let classes = this.classService.getCertainClasses(schedule);
      console.log(classes);
      classes.forEach(cla =>{
        let start : Date = new Date(cla.startDate);
        let end : Date = new Date(cla.endDate);
        console.log(end, tempEarliestTime);
        if(end > tempEarliestTime && start < tempLatestTime ){
        temp.push({
          startDate : start,
          endDate : end,
          user : user.$key
        });
        }
      });
    });
    let userTimes = temp.filter(item=>{
     // console.log(item.user === currentUser.$key);
      if(item.user === currentUser.$key)
        return true;
        return false;
    });
    temp = temp.filter(item=>{
     // console.log(item.user === currentUser.$key);
      if(item.user === currentUser.$key)
        return false;
        return true;
    });
    // temp.sort((a,b) =>{
    //   let aStart : Date = new Date(a.startDate);
    //   let aEnd : Date = new Date(a.endDate);
    //   let bStart : Date = new Date(b.startDate);
    //   let bEnd : Date = new Date(b.endDate);


    //   return 0;
    // });
    console.log(userTimes);
    console.log(temp);

    });
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