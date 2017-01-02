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

    public entities:  CourseModel[];

    private _authState: FirebaseAuthState;
    
    constructor(private _af: AngularFire) {
        _af.auth.subscribe(authState => {
            this._authState = authState;
            if (authState) {
                _af.database.list('/Courses').subscribe(intructors => {
                    this.entities = intructors;
                });
            }
        });
    }


    public getCourses() :   CourseModel[] {
        return this.entities;
    }

      public getCoursesObservable()  {
        return this._af.database.list('/Courses');
    }

   public getObservableObject(key: string) {
        return this._af.database.object('/Courses/' + key);
    }

}