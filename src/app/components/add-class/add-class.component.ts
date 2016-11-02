import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';


@Component({
  selector: 'add-class',
  templateUrl: './add-class.component.html',
})
export class AddClassComponent implements OnInit {
  @Output() value: EventEmitter<any> = new EventEmitter();

  public output;

  private startDate = new Date();
  private endDate = new Date();

  private startHour;
  private startMin;
  private endHour;
  private endMin;

  constructor(public fb: FirebaseService) {

  }


  ngOnInit() {
    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        this.emitData(user.schedule);
      })
    });
  }

  emitData(scheduleKey) {
    this.fb.getList('Schedule/' + scheduleKey).take(1).subscribe(data => {
      const tempKeys = [];
      for (let i = 0; i < data.length; i++) {
        let keyy = data[i].$key;
        tempKeys.push(keyy);
        this.fb.getObject('Class/' + keyy).subscribe(clas => {
          let d = new Date(clas.startDate.toString());
          let d2 = new Date(clas.endDate.toString());
        });
      };
      this.output = (this.fb.getList('Class').map(classes =>
        classes.filter(a => {
          if (tempKeys.indexOf(a.$key) > -1) {
            return true;
          }
          return false;
        })
      ) as FirebaseListObservable<any[]>);
      this.value.emit(this.output);
    })

  }

  submit() {
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
        this.emitData(user.schedule);

      });
    });
  }


}