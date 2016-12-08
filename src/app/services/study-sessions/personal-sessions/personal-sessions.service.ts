import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { FirebaseService } from '../../firebase/firebase.service'


@Injectable()
export class PersonalSessionsService {

  public entities: Array<any>;

  private _authState: FirebaseAuthState;
  private scheduleObservable: FirebaseListObservable<any>;
  private subscription;
  constructor(private _af: AngularFire, private fb: FirebaseService) {

    _af.auth.subscribe(authState => {
      this._authState = authState;
      if (authState) {
        this.scheduleObservable = _af.database.list('/PersonalSessions');
        this.subscription = this.scheduleObservable.subscribe(classes => {
          this.entities = classes;
        });
      }
    });
  }

  public getEntities() {
    return this.entities;
  }

  public getSessions(key: string) {
    const temp: Array<any> = this.entities.slice();
    return temp.find(ee => {
      return ee.$key === key;
    }
    );
  }


  public update(user, key: string): string {
    if (!!user.personalsessions) {
      let submit = {};
      submit[key] = true;
      this.fb.updateItem('PersonalSession', user.personalsessions, submit);
    } else {
      let submit = {};
      submit[key] = true;
      let innerKey = this.fb.pushWithKey('PersonalSession', submit).key;
      let submit2 = {};
      submit2[innerKey] = true;
      //user.schedule = innerKey;
      this.fb.updateItem('User', user.$key , { personalsessions: innerKey });
      // this.fb.updateItem('User', otherKey+'/studysessions', submit2);
    }
    return user.studysessions;
  }

}