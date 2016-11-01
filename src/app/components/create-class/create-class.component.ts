import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit {

  private startHour;
  private startMin;
  private endHour;
  private endMin;
  private startDate = new Date();
  private endDate = new Date();
  private classes;

  constructor(public fb: FirebaseService) {


  }

  addCourse() {
    this.startDate.setHours(this.startHour);
    this.startDate.setMinutes(this.startMin);
    this.endDate.setHours(this.endHour);
    this.endDate.setMinutes(this.endMin);

    let push = {
      startDate: this.startDate.toString(),
      endDate: this.endDate.toString()
    };
    let key = this.fb.pushWithKey('/Class', push).key;
    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        if (!!user.schedule) {
          let schedule = user.schedule;
          let submit = {};
          submit[key] = true;
          this.fb.updateItem('Schedule', schedule, submit);
        } else {
          let submit = {};
          submit[key] = true;
          let innerKey = this.fb.pushWithKey('Schedule', submit).key;
          this.fb.updateItem('User', uid, { schedule: innerKey });
        }
      });
    });
  }

  ngOnInit() { }

  get() {

    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        this.fb.getList('Schedule/' + user.schedule).take(1).subscribe(data => {
          const tempKeys = [];
          for (let i = 0; i < data.length; i++) {
            let keyy = data[i].$key;
            tempKeys.push(keyy);


            this.fb.getObject('Class/' + keyy).subscribe(clas => {
              let d = new Date(clas.startDate.toString());
              let d2 = new Date(clas.endDate.toString());
                 });
          };
          this.classes = (this.fb.getList('Class').map(classes =>
            classes.filter(a => {
              if (tempKeys.indexOf(a.$key) > -1) {
                return true;
              }
              return false;
            })
          ) as FirebaseListObservable<any[]>)
          this.classes.subscribe(d => {
            console.log(d);
          });
        })
      })
    });
  }




}