import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';


export class ClassModel {
    $key: string;
    $exists: () => {};
    userKey: string;
    startDate: string;
    endDate: string;
    Days : {} = {};

    public addDay(key, value){
        this.Days[key] = value;
    }

    public getStartDate(): Date {
        return new Date(this.startDate);
    }
    public getEndDate(): Date {
        return new Date(this.endDate);
    }
     public setStartDate(hour,min) {
        // date.setFullYear(2000);
        // date.setMonth(1);
        // date.setSeconds(0);
        // date.setUTCDate(5);
        // date.setMilliseconds(0);
        this.startDate = new Date(2000,1,1,hour,min,0,0).toString();
    }
    public setEndDate(hour,min) {
        // date.setFullYear(2000);
        // date.setMonth(1);
        // date.setSeconds(0);
        // date.setUTCDate(5);
        // date.setMilliseconds(0);
        this.endDate =new Date(2000,1,1,hour,min,0,0).toString();
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
    public setStartDate(hour,min) {
        // date.setFullYear(2000);
        // date.setMonth(1);
        // date.setSeconds(0);
        // date.setUTCDate(5);
        // date.setMilliseconds(0);
        this.startDate = new Date(2000,1,1,hour,min,0,0).toString();
    }
    public setEndDate(hour,min) {
        // date.setFullYear(2000);
        // date.setMonth(1);
        // date.setSeconds(0);
        // date.setUTCDate(5);
        // date.setMilliseconds(0);
        this.endDate =new Date(2000,1,1,hour,min,0,0).toString();
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

    public getClasses(){//: FirebaseListObservable<any> {
       return this.entities;
    }
    public getObservable(){
        return this.classObservable;
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


      //  console.log(entity.getStartDate());
        const existing = this.entities &&
            this.entities.length &&
            this.entities.find(ee => {
                let e: ClassModel = new ClassModel();
                e.setStartDate(new Date(ee.startDate).getHours(),new Date(ee.startDate).getMinutes());
                e.setEndDate(new Date(ee.endDate).getHours(),new Date(ee.endDate).getMinutes());
                e.Days = ee.Days;
                

                let days = e.Days['Monday'] === entity.Days['Monday'] &&
                e.Days['Tuesday'] === entity.Days['Tuesday'] &&
                e.Days['Wednesday'] === entity.Days['Wednesday'] &&
                e.Days['Thursday'] === entity.Days['Thursday'] &&
                e.Days['Friday'] === entity.Days['Friday'] &&
                e.Days['Saturday'] === entity.Days['Saturday'] &&
                e.Days['Sunday'] === entity.Days['Sunday'];
                return e.getStartDate().getHours() == entity.getStartDate().getHours() &&
                    e.getEndDate().getHours() == entity.getEndDate().getHours() &&
                    e.getStartDate().getMinutes() == entity.getStartDate().getMinutes() &&
                    e.getEndDate().getMinutes() == entity.getEndDate().getMinutes() 
                    &&       days;

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
            console.log('push');
             let tempUser = {};
            tempUser[entity.userKey] = true;
            delete entity.userKey;
            console.log(entity);
            // create ..
            let key = this._af.database.list('Class').push(entity).key;
            this._af.database.list('/Class').update(key + '/Users/', tempUser);
            return key;
        }
    }
}