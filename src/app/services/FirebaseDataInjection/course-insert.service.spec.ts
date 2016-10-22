/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CourseInsertService } from './course-insert.service';

describe('Service: CourseInsert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseInsertService]
    });
  });

  it('should ...', inject([CourseInsertService], (service: CourseInsertService) => {
    expect(service).toBeTruthy();
  }));
});
