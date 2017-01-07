import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';


export class CourseModel {
    $key: string;
    $exists: () => {};
    course: string;
    department: string;
    title: string;
    Instructors: {};

}


@Injectable()
export class CourseService {
    private subscriptions: Array<any> = [];

    constructor(private _af: AngularFire) { }


    public getCoursesObservable() {
        return this._af.database.list('/Courses');
    }
    public getCoursesObservableObjectCallBack(cb) {
        let sub = this._af.database.object('/Courses').subscribe(cb);
        this.subscriptions.push(sub);
    }
    public getCoursesObservableListCallBack(cb) {
        let sub = this._af.database.list('/Courses').subscribe(cb);
        this.subscriptions.push(sub);
    }
    public getObservableObject(key: string) {
        return this._af.database.object('/Courses/' + key);
    }

    ngOnDestroy() {
        console.log('destroyed course', this.subscriptions);
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
            console.log(sub);
        })
    }


}