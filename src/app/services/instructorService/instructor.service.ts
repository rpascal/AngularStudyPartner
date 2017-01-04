import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';


export class InstructorModel {
    $key: string;
    $exists: () => {};
    name: string;
    Courses: {};

}


@Injectable()
export class InstructorService {


    constructor(private _af: AngularFire) {

    }



   public getIntructorsObservable() {
        return this._af.database.list('/Instructors');
    }
      public getIntructorsObservableObject() {
        return this._af.database.object('/Instructors');
    }

  public getIntructorsObservableObjectCallBack(cb)  {
        return this._af.database.object('/Instructors').subscribe(cb);
    }
     public getIntructorsObservableListCallBack(cb)  {
        return this._af.database.list('/Instructors').subscribe(cb);
    }


    public getObservableObject(key: string) {
        return this._af.database.object('/Instructors/' + key);
    }


}