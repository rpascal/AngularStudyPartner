import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';


export class ClassModel {
   $key: string;
   $exists: () => {};
   
   startDate: string;
   endDate: string;

   public getStartDate() : Date {
       return new Date(this.startDate);
   }
   public getEndDate() : Date {
       return new Date(this.endDate);
   }
   public setStartDate(date : Date) {
       this.startDate = date.toString();
   }
   public setEndDate(date : Date) {
       this.endDate = date.toString();
   }

}

@Injectable()
export class ClassService {

   public entities: ClassModel[];

   private _authState: FirebaseAuthState;

   constructor(private _af: AngularFire) {
      _af.auth.subscribe(authState => {
         this._authState = authState;

         if (authState) {
            _af.database.list('/Class').subscribe(classes => {
               this.entities = classes;
            });
         }
      });
   }

   public add(entity: ClassModel) {
      if (!entity) return console.log('invalid entity!');

     // if (this._authState) {
     //    entity.Instructor = this._authState.uid;
     // }

      // trying to find an existing one ..
       console.log(entity.getStartDate());
      const existing = this.entities &&
         this.entities.length &&
         this.entities.find(ee => {
            let e : ClassModel =  new ClassModel();
            e.setStartDate(new Date(ee.startDate));
            e.setEndDate(new Date(ee.endDate))
            //console.log(tempEntity.getStartDate());

         return   e.getStartDate().getHours() == entity.getStartDate().getHours() &&
            e.getEndDate().getHours() == entity.getEndDate().getHours() &&
            e.getStartDate().getMinutes() == entity.getStartDate().getMinutes() &&
            e.getEndDate().getMinutes() == entity.getEndDate().getMinutes()
         
        }
           //  && e.Instructor == entity.Instructor
         );
      if (existing) {
         // we found one ..
         console.log('FOUND:', existing.$key);
         return existing.$key;
      }

      delete entity.$exists;

      // update or create?
      if (entity.$key) {
         // update ..
         const key = entity.$key; // temporary save our key!
         delete entity.$key; // we dont want to push this into our firebase-database ..
         this._af.database.list('/Class').update(key, entity); // update entry
        console.log('update');
         return key;
    }
      else {
          console.log('push');
         // create ..
         return this._af.database.list('Class').push(entity).key;
      }


   }
}