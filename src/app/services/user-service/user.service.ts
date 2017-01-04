import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';

import { Observable } from 'rxjs/Rx';

export class UserModel {
    $key: string;
    $exists: () => {};
    age: string;
    color: string;
    name: string;
    schedule: string;
    personalsessions: string;
}

@Injectable()
export class UserService {



    constructor(private _af: AngularFire) {

    }


    getCurrentUserCallback(cb) {
        this._af.auth.subscribe(authState => {
            this._af.database.object('/User/' + authState.uid).subscribe(cb);
        });
    }
    getAllUsersCallback(cb) {
        this._af.database.list('/User').subscribe(cb);
    }

    getAuthObservable() {
        return this._af.auth;
    }

    
    getAuthObservableCB(cb) {
        return this._af.auth.subscribe(cb);
    }

    getUsersObservable() {
        return this._af.database.list('User');
    }

     getUserObservableObject() {
        return this._af.database.object('User');
    }

    getUsersObservableObject(key: string) {
        return this._af.database.object('User/' + key);
    }


    updateUser(newUser: UserModel): void {
        let key = newUser.$key;
        delete newUser.$key;
        delete newUser.$exists;
        this._af.database.list('/User').update(key, newUser);
    }

}