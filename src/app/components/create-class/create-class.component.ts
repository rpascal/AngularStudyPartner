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


  private masterClasses: Array<any>;
  private outputClasses: Array<any>;
  private scheduleKeys : Array<any>;


    private overlaps: Array<any>;
  private masterOverLap: Array<any>;
  
  private DaysOfWeek: Array<string> = ['Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'];


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


  filterOverlap(search) {
    this.overlaps = this.masterOverLap.filter(value => {
      return value.dayOfWeek === search ? true : false;
    });
  }

  onSelectClass(value) {
    let endHour = 17;
    let endMin = 0;
    let startMin = 0;
    let startHour = 9;
    let tempEarliestTime: Date = new Date(2000, 1, 1, startHour, startMin, 0, 0);
    let tempLatestTime: Date = new Date(2000, 1, 1, endHour, endMin, 0, 0);

    this.UserService.getUser().subscribe(currentUser => {
      let temp: Array<any> = [];
      let users = this.UserService.getListOfUsers(value.Users);
      users.forEach(user => {

        let schedule = this.scheduleService.getSchdule(user.schedule);

        let classes = this.classService.getCertainClasses(schedule);
        let temp2: Array<any> = [];
        classes.forEach(cla => {
          let start: Date = new Date(cla.startDate);
          let end: Date = new Date(cla.endDate);
          console.log()
          if (end >= tempEarliestTime && start <= tempLatestTime) {
            temp2.push({
              startDate: start,
              endDate: end,
              days: cla.Days
            });
          }
        });
        temp.push({
          user: user.$key,
          name: user.name,
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

        let Mgaps: Array<any> = [];
        let Tgaps: Array<any> = [];
        let Wgaps: Array<any> = [];
        let Thgaps: Array<any> = [];
        let Fgaps: Array<any> = [];
        let Sagaps: Array<any> = [];
        let Sugaps: Array<any> = [];

        for (let i = 0; i < user.times.length; i++) {
          if (user.times[i].days['Monday']) {
            Mgaps.push(user.times[i]);
          }
          if (user.times[i].days['Tuesday']) {
            Tgaps.push(user.times[i]);
          }
          if (user.times[i].days['Wednesday']) {
            Wgaps.push(user.times[i]);
          }

          if (user.times[i].days['Thursday']) {
            Thgaps.push(user.times[i]);
          }
          if (user.times[i].days['Friday']) {
            Fgaps.push(user.times[i]);
          }
          if (user.times[i].days['Saturday']) {
            Sagaps.push(user.times[i]);
          }
          if (user.times[i].days['Sunday']) {
            Sugaps.push(user.times[i]);
          }
        }










        user['perDay'] = {
          Monday: Mgaps,
          Tuesday: Tgaps,
          Wednesday: Wgaps,
          Thursday: Thgaps,
          Friday: Fgaps,
          Saturday: Sagaps,
          Sunday: Sugaps
        };

        Mgaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Monday']);
        Tgaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Tuesday']);
        Wgaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Wednesday']);
        Thgaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Thursday']);
        Fgaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Friday']);
        Sagaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Saturday']);
        Sugaps = this.gapsPush(tempEarliestTime, tempLatestTime, user.perDay['Sunday']);
        if (Mgaps.length === 0) {
          Mgaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Tgaps.length === 0) {
          Tgaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Wgaps.length === 0) {
          Wgaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Thgaps.length === 0) {
          Thgaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Fgaps.length === 0) {
          Fgaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Sagaps.length === 0) {
          Sagaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }
        if (Sugaps.length === 0) {
          Sugaps.push({
            start: tempEarliestTime,
            end: tempLatestTime
          });
        }

        user['gaps'] = {
          Monday: Mgaps,
          Tuesday: Tgaps,
          Wednesday: Wgaps,
          Thursday: Thgaps,
          Friday: Fgaps,
          Saturday: Sagaps,
          Sunday: Sugaps
        };





      });




      let userTimes = temp.filter(item => {
        if (item.user === currentUser.$key)
          return true;
        return false;
      });
      temp = temp.filter(item => {
        if (item.user === currentUser.$key)
          return false;
        return true;
      });


      let overlaps: Array<any> = [];

      this.pushOverlaps(userTimes, temp, overlaps, 'Monday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Tuesday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Wednesday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Thursday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Friday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Saturday');
      this.pushOverlaps(userTimes, temp, overlaps, 'Sunday');


      // console.log(overlaps);

      overlaps.sort((a, b) => {
        return b.min - a.min
      });
      this.overlaps = overlaps;
      this.masterOverLap = overlaps;
      this.filterOverlap('Monday');
      // console.log(userTimes, 'User');
      //console.log(temp, 'Temp');

    });
  }


  pushOverlaps(userTimes, temp, mondayBreaks: Array<any>, day: string) {
    let userKey = userTimes[0].user;

    userTimes[0].gaps[day].forEach(userGap => {
      let uS: Date = new Date(userGap.start);
      let uE: Date = new Date(userGap.end);
      temp.forEach(other => {
        let otherKey = other.user;
        other.gaps[day].forEach(otherMondays => {
          let oS: Date = new Date(otherMondays.start);
          let oE: Date = new Date(otherMondays.end);

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
            mondayBreaks.push({
              userKey: userKey,
              otherKey: otherKey,
              otherName: other.name,
              start: gS,
              end: gE,
              min: minDiff,
              dayOfWeek: day
            });
          }
        });
      });
    });

  }

  gapsPush(tempEarliestTime, tempLatestTime, user) {
    let gaps: Array<any> = [];
    for (let i = 0; i < user.length; i++) {

      if (i === 0) {
        gaps.push({
          start: tempEarliestTime,
          end: user[i].startDate
        });
      }
      // console.log(i === (user.times.length-1),i,user.times.length);
      if (i === (user.length - 1)) {
        gaps.push({
          start: user[i].endDate,
          end: tempLatestTime
        });
      } else {
        gaps.push({
          start: user[i].endDate,
          end: user[i + 1].startDate
        });
      }
    }
    return gaps;

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