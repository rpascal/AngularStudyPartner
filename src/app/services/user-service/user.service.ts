import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

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

    private subscriptions: Array<any> = [];

    constructor(private _af: AngularFire) { }


    getCurrentUserCallback(cb) {
        let sub = this._af.auth.subscribe(authState => {
            let innerSub = this._af.database.object('/User/' + authState.uid).subscribe(cb);
            this.subscriptions.push(innerSub);
        });
        this.subscriptions.push(sub);
    }
    getAllUsersCallback(cb) {
        let sub = this._af.database.list('/User').subscribe(cb);
        this.subscriptions.push(sub);
    }

    getAuthObservable() {
        return this._af.auth;
    }


    getAuthObservableCB(cb) {
        let sub = this._af.auth.subscribe(cb);
        this.subscriptions.push(sub);
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




    ngOnDestroy() {
        console.log('destroyed user', this.subscriptions);
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
            console.log(sub);
        })
    }

}