import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';
import { UserService, UserModel } from '../../services/user-service/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user : UserModel; 
  userDate : number;

  constructor(public fb : FirebaseService,
  public userService : UserService) { 

    this.userService.getUser().subscribe(user=>{
      this.user = user;
    })
  }
  test() {
    this.userService.updateUser(this.user);
  }
  ngOnInit() {
  }

}
