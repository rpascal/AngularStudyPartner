import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassModel, ClassService } from '../../services/class-service/class.service';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService } from '../../services/user-service/user.service';
import { ObservableCombiner } from '../../services/ObservableCombiner/observable-combiner.service'

@Component({
  selector: 'add-class',
  templateUrl: './add-class.component.html',
})
export class AddClassComponent implements OnDestroy {


  private startDate = new Date();
  private endDate = new Date();


  private monday = false;
  private tuesday = false;
  private wednesday = false;
  private thursday = false;
  private friday = false;
  private saturday = false;
  private sunday = false;


  private selectedCourse;
  private selectedIntructor;

  private startHour;
  private startMin;
  private endHour;
  private endMin;

  constructor(
    public classService: ClassService,
    public scheduleService: ScheduleService,
    public UserService: UserService,
    public observableCombiner: ObservableCombiner) {


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


    this.observableCombiner.combineObservablesWithTake1(
      [
        this.UserService.getAuthObservable().take(1),
        this.classService.getObservableObject().take(1)
      ],
      callback => {
        entity.userKey = callback[0].uid;
        let classesArray: Array<any> = [];
        delete callback[1].$exists;
        delete callback[1].$key;
        for (var property in callback[1]) {
          callback[1][property].$key = property;
          classesArray.push(callback[1][property]);
        }


        let key: string = this.classService.add(entity, classesArray);
        this.scheduleService.update(callback[0].uid, key);
      }
    );
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


  ngOnDestroy() {
    this.scheduleService.ngOnDestroy();
    this.UserService.ngOnDestroy();
    this.classService.ngOnDestroy();

  }

}