import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';
import { ClassModel, ClassService } from '../../services/class-service/class.service';
import { Http, Response } from '@angular/http';

import { InstructorService } from '../../services/instructorService/instructor.service';
import { CourseService } from '../../services/courseService/course.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit {


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
  }

  ngOnInit() {

    this.classService.getAllClassesCallbackObject(classes => {
      //console.log(classes);
      this.masterClasses = classes;
      this.filterClasses();
    });

    this.scheduleService.getCurrentUsersScheduleCallback(userSchedule => {
      this.scheduleKeys = userSchedule;
      delete this.scheduleKeys['$exists'];
      delete this.scheduleKeys['$key'];
      this.filterClasses();
      //console.log(this.scheduleKeys);
    })
  }


  filterClasses(): void {
    if (this.scheduleKeys != null && this.masterClasses != null) {

      this.outputClasses = [];
      for (var property in this.scheduleKeys) {
        this.masterClasses[property].$key = property;
        this.outputClasses.push(this.masterClasses[property]);
      }
      this.outputClasses.sort((a, b) => {
        let aStart: Date = new Date(a.startDate);
        let bStart: Date = new Date(b.startDate);
        if (aStart < bStart)
          return -1;
        else if (aStart > bStart)
          return 1;
        return 0;
      });
      this.outputClasses.forEach((value, i) => {
        const value2 = value;
        const ii = i;
        this.courseService.getObservableObject(value2.courseKey).subscribe(v => {
          this.outputClasses[ii]['courseNum'] = v.course;
        })
        this.instructorService.getObservableObject(value2.intructorKey).subscribe(v => {
          this.outputClasses[ii]['intructorName'] = v.name;
        })
      })
    }



  }


  filterOverlap(search) {
    this.selectedDay = search;
    this.overlaps = this.currentUserData['overlaps'][search];
  }


  onSelectClass(value) {
    //console.log(value);
    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);


    const masterObservable = Observable.combineLatest(
      this.UserService.getAuthObservable().take(1),
      this.UserService.getUserObservableObject().take(1),
      this.classService.getObservableObject().take(1),
      this.scheduleService.getObservableObject().take(1),
    ).take(1);
    const subscription = masterObservable.subscribe(data => {
      let currentUserUID = data[0].uid;
      let allUsers = data[1];
      let classes = data[2];
      let schedules = data[3];
      let currentUser = allUsers[currentUserUID];
      // console.log(data);


      let usersArray: Array<any> = this.getUsersWithClasses(
        value,
        allUsers,
        schedules,
        classes);

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
      this.newPushOverlaps(currentUserData, otherUsersData, value.$key);
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


  getUsersWithClasses(selectedClass, users, schedule, classes): Array<any> {
    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);

    let usersArray: Array<any> = [];
    let usersForClass: Array<any> = [];
    for (var property in selectedClass.Users) {
      users[property].$key = property;
      usersForClass.push(users[property]);
    }

    usersForClass.forEach(user => {
      let userschedule = schedule[user.$key];
      let arrayOfClasses: Array<any> = [];
      for (var property in userschedule) {
        classes[property].$key = property;
        arrayOfClasses.push(classes[property]);
      }
      let classesArray: Array<any> = [];
      arrayOfClasses.forEach(cla => {
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




  newPushOverlaps(currentUserData: Array<any>, otherUsersData: Array<any>,
    classKey: string) {
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
                currentUser: currentUserData['user'],
                otherUser: otherUser.user,
                start: gS,
                end: gE,
                minutes: minDiff,
                classKey: classKey,
                owner: currentUserData['user'].$key,
                members: [
                  currentUserData['user'].$key,
                  otherUser.user.$key
                ]
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
          // let gaps : {} = [];
          let gaps: Array<any> = [];
          // gaps[day] = [];
          for (let i = 0; i < classesPerDay.length; i++) {

            if (i === 0) {
              gaps.push({
                start: tempEarliestTime,
                end: classesPerDay[i].startDate
              });

            }
            if (i === (classesPerDay.length - 1)) {
              gaps.push({
                start: classesPerDay[i].endDate,
                end: tempLatestTime
              });

            } else {
              gaps.push({
                start: classesPerDay[i].endDate,
                end: classesPerDay[i + 1].startDate
              });
            }

          }
          user['free'][day] = gaps;
        }
      });

    });

  }


  onDeleteClass(value) {

    Observable.combineLatest(
     this.UserService.getAuthObservable().take(1),
      this.scheduleService.getObservableObject().take(1))
      .take(1).subscribe(data => {
        let currentUserUID = data[0].uid;
        let schedule = data[1];
        this.fb.deleteValue('Schedule/' + currentUserUID + '/' + value.$key);
        let exists : boolean = this.scheduleService.checkExist(currentUserUID, schedule, value.$key);
        if(!exists){
          this.fb.deleteValue('Class/' + value.$key);
        }
      });
  }


}