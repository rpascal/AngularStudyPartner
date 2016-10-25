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
    this.fb.getUserId().take(1).subscribe(uid => {
         this.fb.getObject('User/'+uid).take(1).subscribe(data => {
           this.userID = data;
         });
    });
  }

  ngOnInit() {
  }

}
