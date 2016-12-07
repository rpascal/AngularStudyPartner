import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';
import { ClassModel, ClassService } from '../../services/class-service/class.service';


import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent {


  private masterClasses: Array<any>;
  private outputClasses: Array<any>;
  private scheduleKeys: Array<any>;

  private selectedDay: string;

  private currentUserData: Array<any>;

  private overlaps: Array<any>;

  private DaysOfWeek: Array<string> = ['Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'];


  constructor(public instructorService: InstructorService,
  public courseService: CourseService,
  public fb: FirebaseService,
    public scheduleService: ScheduleService,
    public UserService: UserService,
    public classService: ClassService) {

    this.classService.getObservable().subscribe(vlasses => {
      this.masterClasses = vlasses;
      this.filterClasses();
    });
    this.UserService.getUser().take(1).subscribe(user => {
      this.scheduleService.getListObservable(user.schedule).subscribe(d1 => {
        this.scheduleKeys = d1;
        this.filterClasses();
      });
    });

  }


  filterClasses(): void {
    if (this.scheduleKeys != null && this.masterClasses.length > 0) {
      this.outputClasses = this.masterClasses.filter(value => {

        let bool = false;
        for (let i = 0; i < this.scheduleKeys.length; i++) {
          if (this.scheduleKeys[i].$key === value.$key) {
            bool = true;
            break;
          }
        }
        return bool;
      });

      this.outputClasses.forEach((value, i) => {
        if (value.courseKey) {
          this.courseService.getObservableObject(value.courseKey).subscribe(v => {
            this.outputClasses[i]['courseNum'] = v.course;
          })
           this.instructorService.getObservableObject(value.intructorKey).subscribe(v => {
            this.outputClasses[i]['intructorName'] = v.name;
          })
        }

      })

      console.log(this.outputClasses);


      this.outputClasses.sort((a, b) => {
        let aStart: Date = new Date(a.startDate);
        let bStart: Date = new Date(b.startDate);
        if (aStart < bStart)
          return -1;
        else if (aStart > bStart)
          return 1;
        return 0;
      });
    }

  }


  filterOverlap(search) {
    this.selectedDay = search;
    this.overlaps = this.currentUserData['overlaps'][search];
  }


  onSelectClass(value) {
    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);

    this.UserService.getUser().subscribe(currentUser => {

      let usersArray: Array<any> = this.getUsersWithClasses(value);
      this.sortArrayByTimes(usersArray);
      this.newGapsPush(tempEarliestTime, tempLatestTime, usersArray);

      let currentUserData: Array<any>;
      let otherUsersData: Array<any>;
      let i = usersArray.findIndex(item => {
        if (item.user.$key === currentUser.$key)
          return true;
        return false;
      });
      currentUserData = usersArray[i];
      otherUsersData = usersArray.slice();
      otherUsersData.splice(i, 1);
      this.newPushOverlaps(currentUserData, otherUsersData);
      //this.overlaps = currentUserData['overlaps']['Friday'];

      this.currentUserData = currentUserData;
      this.filterOverlap('Monday');



    });
  }



  sortArrayByTimes(usersArray: Array<any>): void {
    usersArray.forEach(user => {
      user.classes.sort((a, b) => {
        let aStart: Date = new Date(a.startDate);
        let aEnd: Date = new Date(a.endDate);
        let bStart: Date = new Date(b.startDate);
        let bEnd: Date = new Date(b.endDate);

        if (aStart < bStart)
          return -1;
        else if (aStart > bStart)
          return 1;
        return 0;
      });
    });

  }

  getUsersWithClasses(selectedClass): Array<any> {

    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);

    let usersArray: Array<any> = [];
    let users = this.UserService.getListOfUsers(selectedClass.Users);
    users.forEach(user => {
      let schedule = this.scheduleService.getSchdule(user.schedule);
      let classes = this.classService.getCertainClasses(schedule);

      let classesArray: Array<any> = [];
      classes.forEach(cla => {
        let start: Date = new Date(cla.startDate);
        let end: Date = new Date(cla.endDate);

        if (end >= tempEarliestTime && start <= tempLatestTime) {

          classesArray.push(cla);
        }
      });
      usersArray.push({
        user: user,
        classes: classesArray
      });
    });

    return usersArray;
  }

  newPushOverlaps(currentUserData: Array<any>, otherUsersData: Array<any>) {
    currentUserData['overlaps'] = {};

    this.DaysOfWeek.forEach(day => {
      let overlaps: {} = [];
      overlaps[day] = [];
      currentUserData['free'][day].forEach(usersFreeTimes => {

        let uS: Date = new Date(usersFreeTimes.start);
        let uE: Date = new Date(usersFreeTimes.end);
        otherUsersData.forEach(otherUser => {
          otherUser['free'][day].forEach(otherUserFreeTimes => {
            let oS: Date = new Date(otherUserFreeTimes.start);
            let oE: Date = new Date(otherUserFreeTimes.end);

            if ((uS >= oS && uS <= oE) || (uE >= oS && uE <= oE)) {
              let gS: Date;
              let gE: Date;
              if (uS < oS) {
                gS = oS;
              } else if (uS > oS) {
                gS = uS;
              } else {
                gS = uS;
              }
              if (uE < oE) {
                gE = uE;
              } else if (uE > oE) {
                gE = oE;
              } else {
                gE = oE;
              }
              var hourDiff = gE.getTime() - gS.getTime(); //in ms
              var secDiff = hourDiff / 1000; //in s
              var minDiff = hourDiff / 60 / 1000; //in minutes
              var hDiff = hourDiff / 3600 / 1000; //in hours
              overlaps[day].push({
                otherUser: otherUser,
                start: gS,
                end: gE,
                minutes: minDiff
              });
            }
          });
        });

      });
      overlaps[day].sort((a, b) => {
        return b.minutes - a.minutes
      });
      currentUserData['overlaps'][day] = overlaps[day];

    });

  }

  newGapsPush(tempEarliestTime, tempLatestTime, userArray: Array<any>) {

    userArray.forEach(user => {

      user['free'] = {};
      this.DaysOfWeek.forEach(day => {
        let classesPerDay = user.classes.filter(cl => {
          if (cl.Days[day] == true) {
            return true;
          }
          return false;
        });
        if (classesPerDay.length === 0) {
          user['free'][day] = [{
            start: tempEarliestTime,
            end: tempLatestTime
          }];
        } else {
          let gaps: {} = [];
          gaps[day] = [];
          for (let i = 0; i < classesPerDay.length; i++) {

            if (i === 0) {
              gaps[day].push({
                start: tempEarliestTime,
                end: classesPerDay[i].startDate
              });

            }
            if (i === (classesPerDay.length - 1)) {
              gaps[day].push({
                start: classesPerDay[i].endDate,
                end: tempLatestTime
              });

            } else {
              gaps[day].push({
                start: classesPerDay[i].endDate,
                end: classesPerDay[i + 1].startDate
              });
            }

          }
          user['free'][day] = gaps[day];
        }
      });
      //console.log(user);

    });

  }


  onDeleteClass(value) {
    this.UserService.getUser().subscribe(user => {
      let schedule = user.schedule;
      this.fb.deleteValue('Schedule/' + schedule + '/' + value.$key);
      const t = this.scheduleService.checkExists(value.$key, schedule);
      if (!t) {
        this.fb.deleteValue('Class/' + value.$key);
      }
    });
  }

  scheduleAppointment(lis) {
    console.log(lis, this.selectedDay);

  }

}