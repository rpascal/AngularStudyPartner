import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FirebaseService} from '../services/firebase/firebase.service';
import {ClassService} from '../services/class-service/class.service';
import {ScheduleService} from '../services/schedule-service/schedule.service';
import {UserService} from '../services/user-service/user.service';
import {InstructorService} from '../services/instructorService/instructor.service';
import {CourseService} from '../services/courseService/course.service';
import {SessionSchedulerService} from '../services/study-sessions/session-scheduler/session-scheduler.service';

import {SessionService} from '../services/study-sessions/session/session.service';
import {PersonalSessionsService} from '../services/study-sessions/personal-sessions/personal-sessions.service';
import {ObservableCombiner} from '../services/ObservableCombiner/observable-combiner.service'

@NgModule({
  imports:      [ CommonModule ],
  declarations: [],

  providers: [ObservableCombiner,FirebaseService,PersonalSessionsService,SessionService,SessionSchedulerService,CourseService,InstructorService, ClassService, ScheduleService, UserService],
  exports:      [ CommonModule, FormsModule,HttpModule,NgbModule]
})

export class SharedModule { }
