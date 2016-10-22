/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstructorInsertService } from './instructor-insert.service';

describe('Service: InstructorInsert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstructorInsertService]
    });
  });

  it('should ...', inject([InstructorInsertService], (service: InstructorInsertService) => {
    expect(service).toBeTruthy();
  }));
});
