import { Component, Input, ElementRef, EventEmitter, OnInit } from '@angular/core';
import {  ClassService } from '../../services/class-service/class.service';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService } from '../../services/user-service/user.service';
import {SessionSchedulerService} from '../../services/study-sessions/session-scheduler/session-scheduler.service'

@Component({
  selector: 'session-scheduler',
  templateUrl: './session-scheduler.component.html',
})
export class SessionSchedulerComponent implements OnInit {
    @Input() input;
    @Input() id : number;


private date;
 private startHour;
  private startMin;
  private endHour;
  private endMin;

  constructor(
    public classService: ClassService,
    public scheduleService: ScheduleService,
    public UserService: UserService,
    public sss : SessionSchedulerService) {

  }

  ngOnInit(){
      this.startHour = new Date(this.input.start).getHours();
      this.startMin = new Date(this.input.start).getMinutes();
      this.endHour = new Date(this.input.end).getHours();
      this.endMin = new Date(this.input.end).getMinutes();
  }

submit() {
  let start: Date = new Date(this.date.year, this.date.month-1, this.date.day, this.startHour, this.startMin,0,0);
  let end: Date = new Date(this.date.year, this.date.month-1, this.date.day, this.endHour, this.endMin,0,0);
  this.input.start = start.toString();
  this.input.end = end.toString();
 
 
 this.sss.schedule(this.input);
  console.log(this.input)


}
 
}