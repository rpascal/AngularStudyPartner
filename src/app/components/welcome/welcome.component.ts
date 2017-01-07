import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  userID;

  constructor(public cs: UserService) {


  }

  ngOnInit() {
    this.cs.getCurrentUserCallback(user => {
      this.userID = user;
    })
  }

  ngOnDestroy(){
    
  }

}
