import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseService {

  constructor(private auth: FirebaseAuth, private router: Router,
    public af: AngularFire) { }


  getUserId() {
    return this.af.auth.map((uid) => uid.uid);
  }
  

  login(username: string, password: string): void {
    this.af.auth.login({ email: username, password: password }).then(
      (success) => {
        console.log(success);
        this.router.navigate(['/home']);
      }).catch(
      (err) => {
        console.log(err);
      });
  }
  logOut(): void {
    console.log(this.af.database.list('User'));
    this.auth.logout();
  }

  checkLoggedIn(): Observable<boolean> {
    return this.auth
      .map((authState: FirebaseAuthState) => !!authState)
      .do(authenticated => {
        if (!authenticated) this.router.navigate(['']);
      });
  }

  pushWithKey(path, v){
    const items =  this.af.database.list(path);
    console.log('psuhed');
    return items.push(v);
  }

  getList(path): FirebaseListObservable<any> {
    return this.af.database.list(path);
  }
   getListQuery(path, query): FirebaseListObservable<any> {
    return this.af.database.list(path , query);
  }
  getObject(path): FirebaseObjectObservable<any> {
    return this.af.database.object(path);
  }
  updateItem(path: string, key: string, newStuff) {
    const submitStuff = newStuff;
    return this.getList(path).update(key, submitStuff);
  }
  deleteValue(path: string) {
    this.getList(path).remove().then(_ => console.log('deleted!'));
  }

}


