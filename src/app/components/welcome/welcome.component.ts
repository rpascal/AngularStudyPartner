import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  userID;

  constructor(public fb : FirebaseService) { 
    this.fb.getUserId().subscribe(uid => {
         this.userID = uid;
    });
  }

  ngOnInit() {
  }

}
