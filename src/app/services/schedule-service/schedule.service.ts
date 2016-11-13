import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {UserModel} from '../user-service/user.service';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import {FirebaseService} from '../firebase/firebase.service'


@Injectable()
export class ScheduleService {

   public entities : Array<any>;

   private _authState: FirebaseAuthState;
   private scheduleObservable : FirebaseListObservable<any>;
   private subscription;
   constructor(private _af: AngularFire, private fb : FirebaseService) {

      _af.auth.subscribe(authState => {
         this._authState = authState;
         if (authState) {
           this.scheduleObservable = _af.database.list('/Schedule');
           this.subscription = this.scheduleObservable.subscribe(classes => {
               this.entities = classes;
            });
         }
      });
   }


   public getEntities() {
       return this.entities;
   }
   public checkExists(key : string, currentScheudle : string) : boolean {
      const temp : Array<any> = this.entities.slice();
      temp.splice(temp.findIndex(data =>{
          if(data.$key === currentScheudle)
          return true;
          return false
      }),1);
      const existing = temp &&
         temp &&
         temp.find(ee => {
            if(ee.hasOwnProperty(key))
                return true;
             return false;
        }
      );
      return existing;
   }

   public update(user : UserModel, classKey : string) : string{
      if (!!user.schedule) {
        let submit = {};
        submit[classKey] = true;
        this.fb.updateItem('Schedule', user.schedule, submit);
      } else {
        let submit = {};
        submit[classKey] = true;
        let innerKey = this.fb.pushWithKey('Schedule', submit).key;
        user.schedule = innerKey;
        this.fb.updateItem('User', user.$key, { schedule: innerKey });
      }
      return user.schedule;
   }
}