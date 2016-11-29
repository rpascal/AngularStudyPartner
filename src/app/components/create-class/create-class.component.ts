import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';
import { ClassModel, ClassService } from '../../services/class-service/class.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent {


  private classes;//: Array<any>;//: FirebaseListObservable<any[]>;


  private masterClasses: Array<any>;
  private outputClasses: Array<any>;
  private scheduleKeys : Array<any>;


  constructor(public fb: FirebaseService,
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
    }

  }


  onSelectClass(value) {
    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    // tempEarliestTime.setHours(9);
    //   tempEarliestTime.setMinutes(0);

    // tempEarliestTime.setFullYear(2000);
    //   tempEarliestTime.setMonth(1);
    //   tempEarliestTime.setSeconds(0);
    //   tempEarliestTime.setDate(0);
    //   tempEarliestTime.setMilliseconds(0);

    // console.log(tempEarliestTime);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);
    //  tempLatestTime.setHours(17);
    //     tempLatestTime.setMinutes(0);
    //          tempLatestTime.setFullYear(2000);
    //     tempLatestTime.setMonth(1);
    //     tempLatestTime.setSeconds(0);
    //     tempLatestTime.setDate(0);
    //     tempLatestTime.setMilliseconds(0);





    this.UserService.getUser().subscribe(currentUser => {
      let temp: Array<any> = [];
      let users = this.UserService.getListOfUsers(value.Users);
      // value.Users.r
      users.forEach(user => {

        let schedule = this.scheduleService.getSchdule(user.schedule);

        let classes = this.classService.getCertainClasses(schedule);
        // console.log(classes);
        let temp2: Array<any> = [];
        classes.forEach(cla => {
          let start: Date = new Date(cla.startDate);
          let end: Date = new Date(cla.endDate);
          // console.log(start, tempLatestTime, ' blah');
          if (end > tempEarliestTime && start < tempLatestTime) {
            temp2.push({
              startDate: start,
              endDate: end,
              days: cla.Days
            });
          }
        });
        temp.push({
          user: user.$key,
          times: temp2
        });

      });

      temp.forEach(user => {

        user.times.sort((a, b) => {
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

        let i = 0;
        let gaps: Array<any> = [];
        for (i; i < user.times.length; i++) {

          if (user.times[i].days['Monday']) {
            this.gapsPush(gaps, i, tempEarliestTime, tempLatestTime, user);
          } else if (user.times[i].days['Tuesday']) {

          } else if (user.times[i].days['Wednesday']) {

          } else if (user.times[i].days['Thursday']) {

          } else if (user.times[i].days['Friday']) {

          } else if (user.times[i].days['Saturday']) {

          } else if (user.times[i].days['Sunday']) {

          }


        }

        user['gaps'] = {
          Monday: gaps,
          Tuesday: gaps
        };

      });




      let userTimes = temp.filter(item => {
        // console.log(item.user === currentUser.$key);
        if (item.user === currentUser.$key)
          return true;
        return false;
      });
      temp = temp.filter(item => {
        // console.log(item.user === currentUser.$key);
        if (item.user === currentUser.$key)
          return false;
        return true;
      });


      //   temp.sort((a,b) =>{
      //   let aStart : Date = new Date(a.startDate);
      //   let aEnd : Date = new Date(a.endDate);
      //   let bStart : Date = new Date(b.startDate);
      //   let bEnd : Date = new Date(b.endDate);



      //   if(aStart < bStart)
      //   return -1;
      //   else if(aStart > bStart)
      //   return 1;
      //   return 0;

      // });

      // var timeStart = new Date("Mon Jan 01 2007 11:00:00 GMT+0530").getTime();
      // var timeEnd = new Date("Mon Jan 01 2007 12:45:00 GMT+0530").getTime();
      // var hourDiff = timeEnd - timeStart; //in ms
      // var secDiff = hourDiff / 1000; //in s
      // var minDiff = hourDiff / 60 / 1000; //in minutes
      // var hDiff = hourDiff / 3600 / 1000; //in hours
      // var humanReadable = {};
      // humanReadable['hours'] = Math.floor(hDiff);
      // humanReadable['minutes'] = minDiff;
      // console.log(humanReadable);

      //       userTimes.forEach((user,i) => {
      //         let aS : Date = new Date(user.startDate);
      //         let aE : Date = new Date(user.endDate);
      //         temp.forEach((other,j) => {
      //             let bS : Date = new Date(other.startDate);
      //             let bE : Date = new Date(other.endDate);

      //            // console.log(tempEarliestTime - bE);
      //         });

      //       });



      console.log(userTimes, 'User');
      console.log(temp, 'Temp');

    });
  }


  gapsPush(gaps: Array<any>, i: number, tempEarliestTime, tempLatestTime, user) {
    if (i === 0) {
      gaps.push({
        start: tempEarliestTime,
        end: user.times[i].startDate
      });
    }
    // console.log(i === (user.times.length-1),i,user.times.length);
    if (i === (user.times.length - 1)) {
      gaps.push({
        start: user.times[i].endDate,
        end: tempLatestTime
      });
    } else {
      gaps.push({
        start: user.times[i].endDate,
        end: user.times[i + 1].startDate
      });
    }
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

}