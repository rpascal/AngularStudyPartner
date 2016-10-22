import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {


  username: string;
  password: string;
 //
 
  constructor(public fb: FirebaseService) { }



 
  ngOnInit() {

  }




  login(): void {
    this.fb.login(this.username, this.password);

  }

}
