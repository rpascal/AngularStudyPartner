import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';


@Component({
  selector: 'course-search',
  templateUrl: './courseIntrucSearch.component.html',
})
export class CourseIntrucSearchComponent implements OnInit {
  @Output() value: EventEmitter<any> = new EventEmitter();

  public inputValue: string;
  public output: any[] = [];

  public listCourse;
  public seletedCourse;
  public intructorsForCourse: Array<any>;

  private masterCourses: Array<any>;
  private masterIntructors;


  constructor(public fb: FirebaseService,
    public is: InstructorService,
    public cs: CourseService) {

  }

  ngOnInit() {
    this.cs.getCoursesObservableListCallBack(courses => {
      console.log(courses);
      this.masterCourses = courses;
    });
    this.is.getIntructorsObservableObjectCallBack(intructors => {
      this.masterIntructors = intructors;
     // console.log(intructors)
    });
  }



  public searchChangedCourse(value) {
    this.seletedCourse = null;
    if (value === '')
      value = ' ';
    this.searchCourse(value);
  }
  searchCourse(search) {
    let i = 0;
    this.listCourse = this.masterCourses.filter(a => {

      if (i === 5) {
        return false;
      }
      if (a.course.startsWith(search)) {
        i++;
        return true;
      }
      return false;

    });
  }

  onSelectCourse(course): void {
    this.seletedCourse = course;
    let temp = this.seletedCourse.Instructors
    if (!!temp) {
      let tempString = Object.getOwnPropertyNames(temp);
      this.intructorsForCourse = [];
      for (var property in temp) {
        this.masterIntructors[property].$key = property;
        this.intructorsForCourse.push(this.masterIntructors[property]);
      }
    }
  }


  onSelectInstruc(intruc): void {
    this.output.push(this.seletedCourse);
    this.output.push(intruc);
    this.value.emit(this.output);
  }


}