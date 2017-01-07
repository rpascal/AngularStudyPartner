import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService } from '../../services/user-service/user.service';
import { ClassService } from '../../services/class-service/class.service';

import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';
import { ObservableCombiner } from '../../services/ObservableCombiner/observable-combiner.service'



@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html'
})
export class ViewScheduleComponent implements OnInit, OnDestroy {

  @Output() selectedClass: EventEmitter<any> = new EventEmitter();

  private masterClasses: Array<any>;
  private outputClasses: Array<any>;
  private scheduleKeys: Array<any>;

  constructor(public instructorService: InstructorService,
    public courseService: CourseService,
    public fb: FirebaseService,
    public scheduleService: ScheduleService,
    public UserService: UserService,
    public classService: ClassService,
    public observableCombiner: ObservableCombiner) {
  }

  ngOnInit() {

    this.classService.getAllClassesCallbackObject(classes => {
      this.masterClasses = classes;
      this.filterClasses();
    });

    this.scheduleService.getCurrentUsersScheduleCallback(userSchedule => {
      this.scheduleKeys = userSchedule;
      delete this.scheduleKeys['$exists'];
      delete this.scheduleKeys['$key'];
      this.filterClasses();
    })
  }

  onSelectClass(selectedClass) {
    this.selectedClass.emit(selectedClass);
  }


  filterClasses(): void {
    if (this.scheduleKeys != null && this.masterClasses != null) {

      this.outputClasses = [];
      for (var property in this.scheduleKeys) {
        this.masterClasses[property].$key = property;
        this.outputClasses.push(this.masterClasses[property]);
      }
      this.outputClasses.sort((a, b) => {
        let aStart: Date = new Date(a.startDate);
        let bStart: Date = new Date(b.startDate);
        if (aStart < bStart)
          return -1;
        else if (aStart > bStart)
          return 1;
        return 0;
      });
      this.outputClasses.forEach((value, i) => {
        const value2 = value;
        const ii = i;
        this.courseService.getObservableObject(value2.courseKey).subscribe(v => {
          this.outputClasses[ii]['courseNum'] = v.course;
        })
        this.instructorService.getObservableObject(value2.intructorKey).subscribe(v => {
          this.outputClasses[ii]['intructorName'] = v.name;
        })
      })
    }
  }

  onDeleteClass(value) {
    this.observableCombiner.combineObservablesWithTake1(
      [
        this.UserService.getAuthObservable().take(1),
        this.scheduleService.getObservableObject().take(1)
      ], callback => {
        let currentUserUID = callback[0].uid;
        let schedule = callback[1];
        this.fb.deleteValue('Schedule/' + currentUserUID + '/' + value.$key);
        let exists: boolean = this.scheduleService.checkExist(currentUserUID, schedule, value.$key);
        if (!exists) {
          this.fb.deleteValue('Class/' + value.$key);
        }
      }
    );
  }

  ngOnDestroy() {
    this.instructorService.ngOnDestroy();
    this.courseService.ngOnDestroy();
    this.scheduleService.ngOnDestroy();
    this.UserService.ngOnDestroy();
    this.classService.ngOnDestroy();
  }

}
