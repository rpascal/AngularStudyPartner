import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  userID;

  constructor(public userService: UserService) {


  }

  ngOnInit() {
    this.userService.getCurrentUserCallback(user => {
      this.userID = user;
    })
  }

  ngOnDestroy(){
    this.userService.destroy();
  }

}
