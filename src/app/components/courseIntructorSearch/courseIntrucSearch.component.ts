import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';


@Component({
  selector: 'course-search',
  templateUrl: './courseIntrucSearch.component.html',
})
export class CourseIntrucSearchComponent implements OnInit, OnDestroy {
  @Output() value: EventEmitter<any> = new EventEmitter();

  public inputValue: string;
  public output: any[] = [];

  public listCourse;
  public seletedCourse;
  public intructorsForCourse: Array<any>;

  private masterCourses: Array<any>;
  private masterIntructors;


  constructor(
    public is: InstructorService,
    public cs: CourseService) {

  }


  ngOnInit() {
    this.cs.getAllListCallBack(courses => {
      this.masterCourses = courses;
    });
    this.is.getAllObjectCallBack(intructors => {
      this.masterIntructors = intructors;
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
      //let tempString = Object.getOwnPropertyNames(temp);
      this.intructorsForCourse = [];
      for (var property in temp) {
        this.masterIntructors[property].$key = property;
        this.intructorsForCourse.push(this.masterIntructors[property]);
      }
    }
  }


  onSelectInstruc(intruc): void {
    this.output.splice(0, this.output.length);
    this.output.push(this.seletedCourse);
    this.output.push(intruc);
    this.value.emit(this.output);
  }


  ngOnDestroy() {
    this.is.destroy();
    this.cs.destroy();
  }
}