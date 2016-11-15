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
   public allUsers : Array<UserModel>;
   private userObservable : FirebaseObjectObservable<any>;

   constructor(private _af: AngularFire) {
       console.log('user');
      _af.auth.subscribe(authState => {
         if (authState) {
            _af.database.list('User').subscribe(users=>{
                this.allUsers = users;
            });
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
   getListOfUsers(keys : {}){
       return this.allUsers.filter(user =>{
           return keys.hasOwnProperty(user.$key);
       })
   }

   getUsers() : Array<UserModel>{
       return this.allUsers;
   }
   updateUser(newUser : UserModel) : void {
       let key = newUser.$key;
       delete newUser.$key;
       delete newUser.$exists;
      this._af.database.list('/User').update(key, newUser); 
   }
 
}