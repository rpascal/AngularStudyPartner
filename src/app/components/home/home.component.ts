import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {InputDebounceComponent} from "./InputDebounceComponent.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public list;
  seletedIntructor;
  public coursesFromInstructor;
  public courseNumb;
  public fbCourses : any[] = [];

  constructor(public fb: FirebaseService) { 
                this.search('');
      }

              search(search) {
     this.list = this.fb
                .getList('Instructors')
                  .map(items => items.filter((a) => {
                 //   console.log(items);
                    if(a.name.startsWith(search))
                    return true;
                    return false;
                  
                  })) as FirebaseListObservable<any[]>;

              }


public searchChanged(value) {
        this.search(value);
    }


  ngOnInit() {
    
    
  }

   filter(instructor) : boolean{
     // Return true if don't want this job in the results.
     // e.g. lets filter jobs with price < 25;
    // console.log(instructor.name.startsWith('M'));
     if (instructor.name.startsWith('M')){
       return false;
     }
     return true; 
  }

  

  onSelect(instruc): void {
    this.fbCourses.splice(0, this.fbCourses.length);
    this.seletedIntructor = instruc;
    let temp = this.seletedIntructor.Courses
    let tempString = Object.getOwnPropertyNames(temp);
    let l =this.fb.getList('Courses/');
    l.subscribe(item => {
      item.forEach(items => {    
        for(let i = 0 ; i < tempString.length; i ++){
          if(items.$key === tempString[i]){
             this.fbCourses.push(items);
        }
        }
      });
    }, () => {
    });

   

  }



}
