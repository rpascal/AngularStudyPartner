import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';

import { Observable } from 'rxjs/Rx';

export class UserModel {
   $key: string;
   $exists: () => {};
   age: string;
   color: string;
   name: string;
   schedule : string;
}

@Injectable()
export class UserService  {

   public currentUser : UserModel;
   private userObservable : FirebaseObjectObservable<any>;

   constructor(private _af: AngularFire) {
       console.log('user');
      _af.auth.subscribe(authState => {
         if (authState) {
           this.userObservable = _af.database.object('/User/' + authState.uid);
           this.userObservable.subscribe(user=>{
               this.currentUser = user;
           });
        }
      });
   }
   getUser()   {
       return this.userObservable;
   }
   updateUser(newUser : UserModel) : void {
       let key = newUser.$key;
       delete newUser.$key;
       delete newUser.$exists;
      this._af.database.list('/User').update(key, newUser); 
   }
 
}