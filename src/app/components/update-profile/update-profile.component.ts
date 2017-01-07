import { Component, OnInit } from '@angular/core';
import { UserService, UserModel } from '../../services/user-service/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user: UserModel;
  userDate: number;

  constructor(
    public userService: UserService) {

    this.userService.getCurrentUserCallback(user => {
      this.user = user;
    })


  }
  test() {
    this.userService.updateUser(this.user);
  }
  ngOnInit() {
  }

}
