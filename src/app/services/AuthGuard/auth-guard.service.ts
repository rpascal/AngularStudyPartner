import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {FirebaseService} from '../firebase/firebase.service'
import { Router }        from '@angular/router';
@Injectable()
export class AuthGaurdService implements CanActivate {
constructor(public fb : FirebaseService, public router : Router) {}
   canActivate() {
    return this.fb.getAuth()
      .map((authState) => !!authState).take(1)
      .do(authenticated => {
         if (!authenticated) this.router.navigate(['']);
      });//.checkLoggedIn().take(1);
  }
}
