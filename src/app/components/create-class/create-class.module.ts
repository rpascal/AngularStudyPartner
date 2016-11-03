import { NgModule } from '@angular/core';
import { CreateClassComponent } from './create-class.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateClassRoutingModule} from './create-class-routing.module';
import {AddClassComponent} from '../add-class/add-class.component';

import {CourseIntrucSearchComponent} from '../courseIntructorSearch/courseIntrucSearch.component';
import {InstructorCourseSearchComponent} from '../instructorCourseSearch/InstructorCourseSearch.component';
import {InputDebounceComponent} from "../InputDebounce/InputDebounceComponent.component";

@NgModule({
  imports: [
    SharedModule,
    CreateClassRoutingModule
  ],
  declarations: [CreateClassComponent, AddClassComponent, InputDebounceComponent, CourseIntrucSearchComponent, InstructorCourseSearchComponent]
})

export class CreateClassModule { }
