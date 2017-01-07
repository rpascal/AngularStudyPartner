import { Injectable } from '@angular/core';
import { AngularFire} from 'angularfire2';


export class InstructorModel {
    $key: string;
    $exists: () => {};
    name: string;
    Courses: {};

}


@Injectable()
export class InstructorService {

     private subscriptions: Array<any> = [];
    constructor(private _af: AngularFire) {   }

    public getIntructorsObservable() {
        return this._af.database.list('/Instructors');
    }
    public getIntructorsObservableObject() {
        return this._af.database.object('/Instructors');
    }

    public getIntructorsObservableObjectCallBack(cb) {
        let sub = this._af.database.object('/Instructors').subscribe(cb);
        this.subscriptions.push(sub);
    }
    public getIntructorsObservableListCallBack(cb) {
        let sub = this._af.database.list('/Instructors').subscribe(cb);
        this.subscriptions.push(sub);
    }


    public getObservableObject(key: string) {
        return this._af.database.object('/Instructors/' + key);
    }

    ngOnDestroy() {
        console.log('destroyed instructors', this.subscriptions);
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
            console.log(sub);
        })
    }
}