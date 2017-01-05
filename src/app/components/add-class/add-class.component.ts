import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ClassModel, ClassService } from '../../services/class-service/class.service';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';

@Component({
  selector: 'add-class',
  templateUrl: './add-class.component.html',
})
export class AddClassComponent {

  private startDate = new Date();
  private endDate = new Date();


  private monday = false;
  private tuesday = false;
  private wednesday = false;
  private thursday = false;
  private friday = false;
  private saturday = false;
  private sunday = false;


  //private instrCour;

  private selectedCourse;
  private selectedIntructor;

  private startHour;
  private startMin;
  private endHour;
  private endMin;

  constructor(public fb: FirebaseService,
    public classService: ClassService,
    public scheduleService: ScheduleService,
    public UserService: UserService) {


  }

  submit() {


    this.startDate.setHours(this.startHour);
    this.startDate.setMinutes(this.startMin);
    this.endDate.setHours(this.endHour);
    this.endDate.setMinutes(this.endMin);

    let entity: ClassModel = new ClassModel();

    entity.setEndDate(this.endHour, this.endMin);
    entity.setStartDate(this.startHour, this.startMin);
    entity.addDay('Monday', this.monday);
    entity.addDay('Tuesday', this.tuesday);
    entity.addDay('Wednesday', this.wednesday);
    entity.addDay('Thursday', this.thursday);
    entity.addDay('Friday', this.friday);
    entity.addDay('Saturday', this.saturday);
    entity.addDay('Sunday', this.sunday);
    //console.log(this.instrCour);

    entity.intructorKey = this.selectedIntructor;
    entity.courseKey = this.selectedCourse;

    Observable.combineLatest(
      this.UserService.getAuthObservable().take(1),
      this.classService.getObservableObject().take(1)
    ).take(1).subscribe(data => {
      entity.userKey = data[0].uid;
      let classesArray: Array<any> = [];
      delete data[1].$exists;
      delete data[1].$key;
      for (var property in data[1]) {
        data[1][property].$key = property;
        classesArray.push(data[1][property]);
      }


      let key: string = this.classService.add(entity, classesArray);
      this.scheduleService.update(data[0].uid, key);
   
    });


  }

  instructorSearchSubmit($event) {
    this.selectedIntructor = $event[0].$key;
     this.selectedCourse = $event[1].$key;
    console.log($event);
  }
    courseSearchSubmit($event) {
    this.selectedCourse = $event[0].$key;
     this.selectedIntructor = $event[1].$key;
    console.log($event);
  }
}