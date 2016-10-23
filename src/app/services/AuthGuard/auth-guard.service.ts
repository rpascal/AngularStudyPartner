import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {FirebaseService} from '../firebase/firebase.service'

@Injectable()
export class AuthGaurdService implements CanActivate {
constructor(public fb : FirebaseService) {}
   canActivate() {
    return this.fb.checkLoggedIn().take(1);
  }
}
