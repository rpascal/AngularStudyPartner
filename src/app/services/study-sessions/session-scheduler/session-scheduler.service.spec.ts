/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionSchedulerService } from './session-scheduler.service';

describe('Service: SessionScheduler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionSchedulerService]
    });
  });

  it('should ...', inject([SessionSchedulerService], (service: SessionSchedulerService) => {
    expect(service).toBeTruthy();
  }));
});
