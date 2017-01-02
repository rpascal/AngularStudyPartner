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


  private instrCour;

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
    console.log(this.instrCour);
    
    entity.intructorKey = this.instrCour[0].$key;
    entity.courseKey = this.instrCour[1].$key;


    this.UserService.getUser().subscribe(user => {

      entity.userKey = user.$key;
      let key : string = this.classService.add(entity);

       this.scheduleService.update(user, key);

    });

  }


  instructor($event) {
    this.instrCour = $event;
    console.log($event);
  }
}