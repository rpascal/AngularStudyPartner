import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';


export class CourseModel {
    $key: string;
    $exists: () => {};
    course : string;
    department : string;
    title : string;
    Instructors : {};

}


@Injectable()
export class CourseService {


    
    constructor(private _af: AngularFire) {

    }


    public getCoursesObservable()  {
        return this._af.database.list('/Courses');
    }
  public getCoursesObservableObjectCallBack(cb)  {
        return this._af.database.object('/Courses').subscribe(cb);
    }
     public getCoursesObservableListCallBack(cb)  {
        return this._af.database.list('/Courses').subscribe(cb);
    }
   public getObservableObject(key: string) {
        return this._af.database.object('/Courses/' + key);
    }

}