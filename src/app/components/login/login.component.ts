import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { Router }        from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {


  username: string;
  password: string;

  constructor(public fb: FirebaseService, public router : Router) { }

  ngOnInit() {
  }

  login(): void {
    this.fb.login(this.username, this.password).then(
      (success) => {
        this.router.navigate(['/home']);
      }).catch(
      (err) => {
        console.log(err);
      });
  }

  ngOnDestroy(){
    this.fb.destroy();
  }

}
