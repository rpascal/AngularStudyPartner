import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user; 
  userDate : number;
  constructor(public fb : FirebaseService) { 
      this.fb.getUserId().take(1).subscribe(uid => {
         this.fb.getObject('User/'+uid).take(1).subscribe(data => {
           this.user = data;
           this.userDate = new Date(data.color).getHours();
           console.log(this.userDate);
         });
    });

  }
  test() {
    console.log(this.user.name);
    this.fb.getUserId().take(1).subscribe(uid => {
      let d = new Date();
      d.setHours(5,32);
      //let submit = {name: this.user.name, color : this.user.color, age : (parseInt)(this.user.age) }
      let submit = {name: this.user.name, color : d, age : (parseInt)(this.user.age) }
      this.fb.updateItem('User',uid,submit);
    });
  }
  ngOnInit() {
  }

}
