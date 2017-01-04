import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserModel } from '../user-service/user.service';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { FirebaseService } from '../firebase/firebase.service'


@Injectable()
export class ScheduleService {


  constructor(private _af: AngularFire, private fb: FirebaseService) {


  }


  getCurrentUsersScheduleCallback(cb) {
    this._af.auth.subscribe(authState => {
      this._af.database.object('/Schedule/' + authState.uid).subscribe(cb);
    });
  }

  getAllSchedulesCallback(cb) {
    this._af.database.list('/Schedule').subscribe(cb);

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
}