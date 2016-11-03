import { Component, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';


@Component({
    selector: 'course-search',
    templateUrl: './courseIntrucSearch.component.html',
})
export class CourseIntrucSearchComponent {  
    @Output() value: EventEmitter<any> = new EventEmitter();

    public inputValue: string;
    public output : any[] = [];

    constructor(public fb: FirebaseService) {
         
    }

  public listCourse;
  public seletedCourse;
  public fbObservCourse;

 public searchChangedCourse(value) {
    this.seletedCourse = null;
    if(value === '') 
     value = ' ' ;
    this.searchCourse(value);
  }
  searchCourse(search) {
    let i = 0;
    this.listCourse = this.fb
      .getList('Courses')
      .map(items => items.filter((a) => {
        if(i === 5){
          return false;
        }
        if (a.course.startsWith(search)){
           i++;
          return true;
        }
        return false;
      })) as FirebaseListObservable<any[]>;
  }

  onSelectCourse(course): void {
    this.seletedCourse = course;
    let temp = this.seletedCourse.Instructors
    if(!!temp){
    let tempString = Object.getOwnPropertyNames(temp);
    this.fbObservCourse = this.fb
      .getList('Instructors')
      .map(items => items.filter((a) => {
        if(tempString.indexOf(a.$key) === -1){
          return false;
        }
        return true;
      })) as FirebaseListObservable<any[]>;
    }
  }


 onSelectInstruc(intruc): void {
     this.output.push(this.seletedCourse);
     this.output.push(intruc);
     this.value.emit(this.output);
}


}