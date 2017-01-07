import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {


  username: string;
  password: string;

  constructor(public fb: FirebaseService) { }

  ngOnInit() {
      console.log('login logged');
  }

  login(): void {
    this.fb.login(this.username, this.password);
  }

}
