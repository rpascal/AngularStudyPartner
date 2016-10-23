import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {Subject} from 'rxjs/Subject';
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
  public  subject = new Subject();
  constructor(public fb: FirebaseService) { 
              
                this.list = this.fb.getListQuery('Instructors', {
                  query: {
                    orderByKey: true,
                   // orderByChild: 'name',
                   equalTo: this.subject//'John Cheh'
                  }
                });

              }
  next() : void {
     // this.subject.next('John Cheh');
       this.subject.next('-KUPkMnZPt5MEQenBKIv');
       this.subject.next('-KUPkMngXRUmiStTov8p');
      
  } 

  ngOnInit() {
    
    
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
