import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';

@Component({
  selector: 'instructor-search',
  templateUrl: './InstructorCourseSearch.component.html',
})
export class InstructorCourseSearchComponent implements OnInit, OnDestroy {
  @Output() value: EventEmitter<any> = new EventEmitter();

  public inputValue: string;
  public output: any[] = [];

  public instructorList;
  public seletedIntructor;
  public coursesForIntructor;

  private masterCourses;
  private masterIntructors: Array<any>;

  constructor(
    public is: InstructorService,
    public cs: CourseService) {

  }



  ngOnInit() {
    this.cs.getAllObjectCallBack(courses => {
      this.masterCourses = courses;
    });
    this.is.getAllListCallBack(intructors => {
      this.masterIntructors = intructors;
    });
  }



  public searchChanged(value) {
    this.seletedIntructor = null;
    if (value === '')
      value = ' ';
    this.search(value);
  }

  search(search) {
    let i = 0;
    this.instructorList = this.masterIntructors.filter(a => {
      if (i === 5) {
        return false;
      }
      if (a.name.toLowerCase().startsWith(search.toLowerCase())) {
        i++;
        return true;
      }
      return false;

    });
  }

  onSelect(instruc): void {
    this.seletedIntructor = instruc;
    let temp = this.seletedIntructor.Courses
    if (!!temp) {
      let tempString = Object.getOwnPropertyNames(temp);
      this.coursesForIntructor = [];
      for (var property in temp) {
        this.masterCourses[property].$key = property;
        this.coursesForIntructor.push(this.masterCourses[property]);
      }
    }

  }

  onSelectCourse(intruc): void {
    this.output.splice(0, this.output.length);
    this.output.push(this.seletedIntructor);
    this.output.push(intruc);
    this.value.emit(this.output);
  }

  ngOnDestroy() {
    this.is.destroy();
    this.cs.destroy();
  }

}