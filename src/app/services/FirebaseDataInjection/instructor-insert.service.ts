import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FirebaseListObservable } from 'angularfire2';

@Injectable()
export class InstructorInsertService {

  constructor(public fb: FirebaseService, private http: Http) { }

  private getJustIntructors(arr) {
    let seen = {};
    let uniqueInstructorNames = [];
    arr.forEach(function (item) {
      let instructorNames = item.Instructor.split(',');
      for (let i = 0; i < instructorNames.length; i++) {
        instructorNames[i] = instructorNames[i].trim();
        if (instructorNames[i] == "" || instructorNames[i] == null)
          instructorNames.splice(i, 1);
      }
      Array.prototype.push.apply(uniqueInstructorNames, instructorNames.filter(name => {
        return seen.hasOwnProperty(name) ? false : (seen[name] = true);
      }));
    });
    return uniqueInstructorNames;
  }


  public addToFirebase() {
    this.http.get('courses.json').take(1)
      .map((res: Response) => res.json())
      .subscribe(
      data => {
        let justInstructor = this.getJustIntructors(data);
        for (let i = 0; i < justInstructor.length; i++) {
          this.fb.pushWithKey('Instructors', { name: justInstructor[i] });
        }
      },
      err => console.log(err),
    );
  }
}
