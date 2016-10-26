import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { InputDebounceComponent } from "./InputDebounceComponent.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public list;
  seletedIntructor;
  public fbObserv;

  constructor(public fb: FirebaseService) {
    this.search(' ');
    this.searchCourse(' ');
  }

  search(search) {
    this.list = this.fb
      .getList('Instructors').take(1)
      .map(items => items.filter((a) => {
        if (a.name.startsWith(search)){
          return true;
        }
        return false;
      })) as FirebaseListObservable<any[]>;
  }

  public searchChanged(value) {
    this.search(value);
  }

  ngOnInit() {}

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
//************COURSE*******************
  public listCourse;
  public seletedCourse;
  public fbObservCourse;

 public searchChangedCourse(value) {
    this.searchCourse(value);
  }
  searchCourse(search) {
   // console.log(search);
    this.listCourse = this.fb
      .getList('Courses').take(1)
      .map(items => items.filter((a) => {
       // console.log(a.course);
        if (a.course.startsWith(search)){
          return true;
        }
        return false;
      })) as FirebaseListObservable<any[]>;
  }

  onSelectCourse(course): void {
    this.seletedCourse = course;
    let temp = this.seletedCourse.Instructors
    let tempString = Object.getOwnPropertyNames(temp);
    this.fbObservCourse = this.fb
      .getList('Instructors').take(1)
      .map(items => items.filter((a) => {
        if(tempString.indexOf(a.$key) === -1){
          return false;
        }
        return true;
      })) as FirebaseListObservable<any[]>;
  }


}
