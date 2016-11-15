import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';


export class ClassModel {
    $key: string;
    $exists: () => {};
    userKey: string;
    startDate: string;
    endDate: string;

    public getStartDate(): Date {
        return new Date(this.startDate);
    }
    public getEndDate(): Date {
        return new Date(this.endDate);
    }
    public setStartDate(date: Date) {
             date.setFullYear(2000);
        date.setMonth(1);
        date.setSeconds(0);
        date.setUTCDate(5);
        date.setMilliseconds(0);
        this.startDate = date.toString();
    }
    public setEndDate(date: Date) {
             date.setFullYear(2000);
        date.setMonth(1);
        date.setSeconds(0);
        date.setUTCDate(5);
        date.setMilliseconds(0);
        this.endDate = date.toString();
    }

}

export class timeFrame {
    private startDate: string;
    private endDate: string;

    public getStartDate(): Date {
        return new Date(this.startDate);
    }
    public getEndDate(): Date {
        return new Date(this.endDate);
    }
    public setStartDate(date: Date) {
        date.setFullYear(2000);
        date.setMonth(1);
        date.setSeconds(0);
        date.setUTCDate(5);
        date.setMilliseconds(0);
        this.startDate = date.toString();
    }
    public setEndDate(date: Date) {
        date.setFullYear(2000);
        date.setMonth(1);
        date.setSeconds(0);
        date.setUTCDate(5);
        date.setMilliseconds(0);
        this.endDate = date.toString();
    }



    
}

@Injectable()
export class ClassService implements OnDestroy {

    public entities: ClassModel[];
    public temp: FirebaseListObservable<any>;
    private _authState: FirebaseAuthState;
    private classObservable: FirebaseListObservable<any>;
    public classSubscription;
    constructor(private _af: AngularFire) {
        _af.auth.subscribe(authState => {
            this._authState = authState;

            if (authState) {
                this.classObservable = _af.database.list('/Class');
                this.classSubscription = this.classObservable.subscribe(classes => {
                    this.entities = classes;
                    this.temp = this.classObservable;
                });
            }
        });
    }

    public getClasses(): FirebaseListObservable<any> {
       return this.temp;
    }

    public getCertainClasses(schedule : {}) : Array<any>{
        return this.entities.filter(entity =>{
            return schedule.hasOwnProperty(entity.$key);
            //return true;
        });
    }
    public ngOnDestroy() {
        console.log('destroyed');
        this.classSubscription.unsubscribe();
    }

    public add(entity: ClassModel) {
        if (!entity) return console.log('invalid entity!');


        console.log(entity.getStartDate());
        const existing = this.entities &&
            this.entities.length &&
            this.entities.find(ee => {
                let e: ClassModel = new ClassModel();
                e.setStartDate(new Date(ee.startDate));
                e.setEndDate(new Date(ee.endDate))

                return e.getStartDate().getHours() == entity.getStartDate().getHours() &&
                    e.getEndDate().getHours() == entity.getEndDate().getHours() &&
                    e.getStartDate().getMinutes() == entity.getStartDate().getMinutes() &&
                    e.getEndDate().getMinutes() == entity.getEndDate().getMinutes()

            }
            );
        if (existing) {
            console.log('FOUND:', existing.$key);
            // entity = existing;
            entity.$key = existing.$key;
            // return existing.$key;
        }

        delete entity.$exists;

        // update or create?
        if (entity.$key) {
            const key = entity.$key; // temporary save our key!

            let tempUser = {};
            tempUser[entity.userKey] = true;
            console.log(entity.userKey);
            delete entity.userKey;

            delete entity.$key; // we dont want to push this into our firebase-database ..
            this._af.database.list('/Class').update(key, entity); // update entry
            this._af.database.list('/Class').update(key + '/Users/', tempUser);

            console.log('update');
            return key;
        }
        else {
            console.log('push'); let tempUser = {};
            tempUser[entity.userKey] = true;
            delete entity.userKey;
            // create ..
            let key = this._af.database.list('Class').push(entity).key;
            this._af.database.list('/Class').update(key + '/Users/', tempUser);
            return key;
        }
    }
}