import { Component, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {InstructorService} from '../../services/instructorService/instructor.service';
import {CourseService} from '../../services/courseService/course.service';

@Component({
    selector: 'instructor-search',
    templateUrl: './InstructorCourseSearch.component.html',
})
export class InstructorCourseSearchComponent {  
    @Output() value: EventEmitter<any> = new EventEmitter();

    public inputValue: string;
    public output : any[] = [];

    constructor(public fb: FirebaseService,
    public is : InstructorService,
    public cs : CourseService) {
         
    }

  public instructorList;
  public seletedIntructor;
  public fbObserv;

  public searchChanged(value) {
    this.seletedIntructor = null;
    if(value === '') 
     value = ' ';
    this.search(value);
  }

   search(search) {
    let i = 0;
    this.instructorList = this.is.getIntructors().filter(a=>{
if(i === 5){
          return false;
        }
        if (a.name.toLowerCase().startsWith(search.toLowerCase())){
            i++;
          return true;
        }
        return false;

    });
    // this.instructorList = this.fb
    //   .getList('Instructors')
    //   .map(items => items.filter((a) => {
    //     if(i === 5){
    //       return false;
    //     }
    //     if (a.name.toLowerCase().startsWith(search.toLowerCase())){
    //         i++;
    //       return true;
    //     }
    //     return false;
    //   })) as FirebaseListObservable<any[]>;
  }

  onSelect(instruc): void {
    // console.log(instruc);
    this.seletedIntructor = instruc;
    let temp = this.seletedIntructor.Courses
    // console.log(temp);
    let tempString = Object.getOwnPropertyNames(temp);
    this.fbObserv = this.cs.getCourses().filter(a => {
          if(tempString.indexOf(a.$key) === -1){
          return false;
        }
        return true;

    });
    // this.fbObserv = this.fb
    //   .getList('Courses')
    //   .map(items => items.filter((a) => {
    //     if(tempString.indexOf(a.$key) === -1){
    //       return false;
    //     }
    //     return true;
    //   })) as FirebaseListObservable<any[]>;
  }

 onSelectCourse(intruc): void {
     this.output.push(this.seletedIntructor);
     this.output.push(intruc);
     this.value.emit(this.output);
}


}