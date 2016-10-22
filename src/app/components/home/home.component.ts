import { Component, OnInit } from '@angular/core';
import {InstructorInsertService} from '../../services/FirebaseDataInjection/instructor-insert.service';
import {CourseInsertService} from '../../services/FirebaseDataInjection/course-insert.service';
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
  constructor(public iis : InstructorInsertService,
              public cic : CourseInsertService,
              public fb: FirebaseService) { 
              
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
    //let tempListCourse;
  //  this.coursesFromInstructor = instruc.Courses;

    this.fbCourses.splice(0, this.fbCourses.length);
    this.seletedIntructor = instruc;
    let temp = this.seletedIntructor.Courses
    let tempString = Object.getOwnPropertyNames(temp);
//console.log(tempString);
    let l =this.fb.getList('Courses/');
    l.subscribe(item => {
      item.forEach(items => {    
        for(let i = 0 ; i < tempString.length; i ++){
          if(items.$key === tempString[i]){
             this.fbCourses.push(items);
        }
        }
      });
     // tempListCourse = item;
    }, () => {
      
     // tempListCourse
    });

   
    
  //  let listss = [];
    //Object.
    //let tempList = this.fb.getList('Instructors/' + instruc.$key + '/Courses');
     //for()
  //   const subject = new Subject();
  //   const queryObservable = this.fb.getListQuery('Courses/', {
   //    query: {
   //      equalTo: subject
   //    }

   //  });

   //  queryObservable.subscribe(queriedItems => {
  //console.log(queriedItems);  
  //  });
 //   for(let i = 0 ; i < tempString.length; i ++){
  //    this.fb.getObject('Courses/' +tempString[i]).take(1).subscribe(
   //     fbCourse =>{
           // this.fbCourses.push(fbCourse);
    //    }

      //);
      

   // }
   // console.log(listss);

   //subject.next(tempString[0]);
    // console.log(Object.keys(temp)[0]);
   // tempList.take(1).subscribe(item => {


   // });
//}
  //  for(let i = 0; i < tempList.length; i++){
     
   //   this.courseNumb.push(this.fb.getObject('Courses/'+this.seletedIntructor.Courses[i].$key));
    //}
    //console.log(this.courseNumb);
  }

  public add() : void {
    this.iis.addToFirebase();
    this.cic.addToFirebase();
    console.log('done');
  }
  public UpdateCourse(){
this.cic.addMoreInfoToCourses();
  }

  public courses() : void {
    //this.cic.addToFirebase();
  // this.cic.addMoreInfoToCourses();
  this.cic.addInstructorsToCourse2();
  //this.cic.deletes();
     console.log('done');
  }
   public delete() : void {
    //this.cic.addToFirebase();
  // this.cic.addMoreInfoToCourses();
  //this.cic.addInstructorsToCourse2();
  this.cic.deletes();
     console.log('done');
  }


}
