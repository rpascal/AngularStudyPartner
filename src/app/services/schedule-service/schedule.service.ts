import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../firebase/firebase.service'


@Injectable()
export class ScheduleService {

  private subscriptions: Array<any> = [];

  constructor(private _af: AngularFire, private fb: FirebaseService) { }

  getCurrentUsersScheduleCallback(cb) {
    let sub =
      this._af.auth.subscribe(authState => {
        let innerSub = this._af.database.object('/Schedule/' + authState.uid).subscribe(cb);
        this.subscriptions.push(innerSub);
      });

    this.subscriptions.push(sub);

  }

  getAllSchedulesCallback(cb) {
    let sub = this._af.database.list('/Schedule').subscribe(cb);
    this.subscriptions.push(sub);
  }

  public getObservableObject() {
    return this._af.database.object('/Schedule');
  }

  public getObjectObservable(key) {
    return this._af.database.object('/Schedule/' + key);
  }
  public getListObservable(key) {
    return this._af.database.list('/Schedule/' + key);
  }



  public checkExist(userID: string, schedule, classKey: string): boolean {
    for (var property in schedule) {
      if (schedule[property].hasOwnProperty(classKey) && property != userID) {
        return true;
      }
    }
    return false;
  }


  public update(userKey: string, classKey: string) {
    let submit = {};
    submit[classKey] = true;
    this.fb.updateItem('Schedule', userKey, submit);
  }


  ngOnDestroy() {
    console.log('destroyed schedule', this.subscriptions);
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
      console.log(sub);
    })
  }

}