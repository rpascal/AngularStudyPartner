import { Component, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';


@Component({
    selector: 'instructor-search',
    templateUrl: './InstructorCourseSearch.component.html',
})
export class InstructorCourseSearchComponent {  
    @Output() value: EventEmitter<any> = new EventEmitter();

    public inputValue: string;
    public output : any[] = [];

    constructor(public fb: FirebaseService) {
         
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
    this.instructorList = this.fb
      .getList('Instructors').take(1)
      .map(items => items.filter((a) => {
        if(i === 5){
          return false;
        }
        if (a.name.toLowerCase().startsWith(search.toLowerCase())){
            i++;
          return true;
        }
        return false;
      })) as FirebaseListObservable<any[]>;
  }

  onSelect(instruc): void {
    this.seletedIntructor = instruc;
    let temp = this.seletedIntructor.Courses
    let tempString = Object.getOwnPropertyNames(temp);
    this.fbObserv = this.fb
      .getList('Courses').take(1)
      .map(items => items.filter((a) => {
        if(tempString.indexOf(a.$key) === -1){
          return false;
        }
        return true;
      })) as FirebaseListObservable<any[]>;
  }

 onSelectCourse(intruc): void {
     this.output.push(this.seletedIntructor);
     this.output.push(intruc);
     this.value.emit(this.output);
}


}