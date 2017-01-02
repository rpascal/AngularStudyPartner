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

    public entities: InstructorModel[];

    private _authState: FirebaseAuthState;

    constructor(private _af: AngularFire) {
        _af.auth.subscribe(authState => {
            this._authState = authState;
            if (authState) {
                _af.database.list('/Instructors').subscribe(intructors => {
                    this.entities = intructors;
                });
            }
        });
    }


    public getIntructors(): InstructorModel[] {
        return this.entities;
    }

   public getIntructorsObservable() {
        return this._af.database.list('/Instructors');
    }
      public getIntructorsObservableObject() {
        return this._af.database.object('/Instructors');
    }

    public getObservableObject(key: string) {
        return this._af.database.object('/Instructors/' + key);
    }


}