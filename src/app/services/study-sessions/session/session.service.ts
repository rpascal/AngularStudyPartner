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

        const add : {} =[];
        add['start'] = value.start;
        add['end'] = value.end;
        add['classKey'] = value.classKey;
        add['owner'] = value.owner;
        add['memebers'] = {};
        value.members.forEach(mem =>{
            var status =  (mem === value.owner)? "yes" : "pending";           
            add['memebers'][mem] = {status : status}
        });
        let key = this._af.database.list('Session').push(add).key;

        return key;
    }



}