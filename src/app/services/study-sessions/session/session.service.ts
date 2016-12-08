import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { FirebaseService } from '../../firebase/firebase.service'


@Injectable()
export class SessionService {

    public entities: Array<any>;

    private _authState: FirebaseAuthState;
    private scheduleObservable: FirebaseListObservable<any>;
    private subscription;
    constructor(private _af: AngularFire, private fb: FirebaseService) {
        _af.auth.subscribe(authState => {
            this._authState = authState;
            if (authState) {
                this.scheduleObservable = _af.database.list('/Session');
                this.subscription = this.scheduleObservable.subscribe(classes => {
                    this.entities = classes;
                });
            }
        });
    }

    public getEntities() {
        return this.entities;
    }


    public add(value): string {
        const entity = value;
        delete entity.$exists;

        let users = {};
        users[entity.userKey] = true;
        users[entity.otherKey] = false;
        delete entity.userKey;
        delete entity.otherKey;
        delete entity.otherName;

        let key = this._af.database.list('Session').push(entity).key;
        this._af.database.list('/Session').update(key + '/Users/', users);
        return key;
    }



}