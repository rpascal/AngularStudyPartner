import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FirebaseListObservable } from 'angularfire2';


@Injectable()
export class CourseInsertService {

  constructor(public fb: FirebaseService, private http: Http) { }

  private getJustCourses(arr) {
    let seen = {};
    let uniquecourseNames = [];
    arr.forEach(function (item) {
      let courseNames = item.Course.split(',');
      for (let i = 0; i < courseNames.length; i++) {
        courseNames[i] = courseNames[i].trim();
        if (courseNames[i] == "" || courseNames[i] == null)
          courseNames.splice(i, 1);
      }
      Array.prototype.push.apply(uniquecourseNames, courseNames.filter(name => {
        return seen.hasOwnProperty(name) ? false : (seen[name] = true);
      }));
    });
    return uniquecourseNames;
  }


  public addToFirebase() {
    this.http.get('courses.json').take(1)
      .map((res: Response) => res.json())
      .subscribe(
      data => {
        let justcourse = this.getJustCourses(data);
        for (let i = 0; i < justcourse.length; i++) {
          this.fb.pushWithKey('Courses', { course: justcourse[i] });
        }
      },
      err => console.log(err),
    );
  }

  public addMoreInfoToCourses() {
    let json: any[] = [];
    this.http.get('courses.json').take(1)
      .map((res: Response) => res.json())
      .subscribe(data => {
        for (let j = 0; j < data.length; j++) {
          json[j] = data[j];
        }
      }, err => console.log(err),
      () => {
        this.fb.getList('Courses').take(1).subscribe(it => {
          for (let i = 0; i < it.length; i++) {
            const key: string = it[i].$key;
            const course: string = it[i].course;
            for (let j = 0; j < json.length; j++) {
              const innerKey: string = key.valueOf();
              const innerCourse: string = course.valueOf();
              if (json[j].Course === innerCourse) {
                this.fb.updateItem('Courses', innerKey, {
                  title: json[j].Title,
                  department: json[j].Department
                })
                break;
              }
            }
          }
        }, err => console.log(err),
          () => console.log('donnnnne')
        );

      });
  }

  public deletes() {
    this.fb.getList('Courses').take(1).subscribe(it => {
      for (let i = 0; i < it.length; i++) {
        const key: string = it[i].$key;
        this.fb.deleteValue('Courses/' + key + '/Instructors');
      }
    });
    this.fb.getList('Instructors').take(1).subscribe(it => {
      for (let i = 0; i < it.length; i++) {
        const key: string = it[i].$key;
        this.fb.deleteValue('Instructors/' + key + '/Courses');
      }
    });

  }
  //casey was here
  //titty butts
  //dick ass

  public addInstructorsToCourse2() {
    let json: any[] = [];
    this.http.get('courses.json').take(1)
      .map((res: Response) => res.json())
      .subscribe(data => {
        for (let j = 0; j < data.length; j++) {
          json[j] = data[j];
        }
      }, err => console.log(err),
      () => {
        const courseWithInst = [];
        this.fb.getList('Courses').take(1).subscribe(it => {
          for (let i = 0; i < it.length; i++) {
            const key: string = it[i].$key;
            const course: string = it[i].course;
            const intructors: any[] = [];
            const seen = {};
            for (let j = 0; j < json.length; j++) {
              const courseJson: string = json[j].Course;
              if (course === courseJson) {
                const instructorNames = json[j].Instructor.split(',');
                for (let ii = 0; ii < instructorNames.length; ii++) {
                  instructorNames[ii] = instructorNames[ii].trim();
                  if (instructorNames[ii] == "" || instructorNames[ii] == null) {
                    instructorNames.splice(ii, 1);
                  }
                }
                Array.prototype.push.apply(intructors, instructorNames.filter(name => {
                  return seen.hasOwnProperty(name) ? false : (seen[name] = true);
                }));
              }
            }
            courseWithInst[i] = [key, intructors];
          }
        }, err => console.log(err),
          () => {
            const outputIn = [];
            const outputCo = [];
            this.fb.getList('Instructors').take(1).subscribe(intructors => {
              for (let l = 0; l < intructors.length; l++) {
                const key: string = intructors[l].$key;
                const name: string = intructors[l].name;
                for (let i = 0; i < courseWithInst.length; i++) {
                  const courseKey = courseWithInst[i][0];
                  const courseIntructors = courseWithInst[i][1];
                  for (let j = 0; j < courseIntructors.length; j++) {
                    const courseIntructor = courseIntructors[j];

                    if (courseIntructor === name) {
                      const intr = {};
                      intr[key] = true;
                      const cou = {};
                      cou[courseKey] = true;
                      outputIn.push(intr, courseKey);
                      outputCo.push(cou, key);
                    }
                  }
                }
              }
            }, err => console.log("error in updating"),
              () => {
                for (let i = 0; i < outputCo.length; i += 2) {
                  const key = outputCo[i + 1];
                  const content = outputCo[i];
                  this.fb.updateItem('Instructors/', key + '/Courses', content);
                }
                for (let i = 0; i < outputIn.length; i += 2) {
                  const key = outputIn[i + 1];
                  const content = outputIn[i];
                  this.fb.updateItem('Courses/', key + '/Instructors', content);
                }
              });

          }
        );
      });
  }
}
