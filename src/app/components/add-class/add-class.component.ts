import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {EntityModel, YourService} from '../a-Class-service/class.service';

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

  constructor(public fb: FirebaseService, public ys : YourService) {

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
    let entity : EntityModel = new EntityModel();

    entity.setEndDate(this.endDate);
    entity.setStartDate(this.startDate);

    let key = this.ys.add(entity);

    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        console.log('yo');
        if (!!user.schedule) {
          let schedule = user.schedule;
          let submit = {};
          submit[key] = true;
          this.fb.updateItem('Schedule', schedule, submit).then(value =>{
              this.emitData(user.schedule);
          });
        } else {
          let submit = {};
          submit[key] = true;
          let innerKey = this.fb.pushWithKey('Schedule', submit).key;
          this.fb.updateItem('User', uid, { schedule: innerKey }).then(value =>{
              this.emitData(user.schedule);
          });
        }

      });
    });


  }
  


}