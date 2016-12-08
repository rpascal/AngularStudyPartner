import { Injectable } from '@angular/core';
import {SessionService} from '../session/session.service'
import {PersonalSessionsService} from '../personal-sessions/personal-sessions.service'

@Injectable()
export class SessionSchedulerService {

  constructor(public ss : SessionService,
  public pss : PersonalSessionsService) { 

  }

  schedule(user) : void {
    let temp;
    let key = this.ss.add(temp);
    this.pss.update(user, key);
  }

}
