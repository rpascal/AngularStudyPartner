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

@NgModule({
  imports:      [ CommonModule ],
  declarations: [],
  providers: [FirebaseService,CourseService,InstructorService, ClassService, ScheduleService, UserService],
  exports:      [ CommonModule, FormsModule,HttpModule,NgbModule]
})

export class SharedModule { }
