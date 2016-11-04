import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';


@Component({
  selector: 'add-class',
  templateUrl: './add-class.component.html',
})
export class AddClassComponent implements OnInit {
  @Output() value: EventEmitter<any> = new EventEmitter();

  public output;

  private startDate = new Date();
  private endDate = new Date();

  private startHour;
  private startMin;
  private endHour;
  private endMin;

  constructor(public fb: FirebaseService) {

  }


  ngOnInit() {
    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        this.emitData(user.schedule);
      })
    });
  }

  emitData(scheduleKey) {

    

    this.fb.getList('Schedule/' + scheduleKey).take(1).subscribe(data => {
      const tempKeys = [];
      for (let i = 0; i < data.length; i++) {
        let keyy = data[i].$key;
        tempKeys.push(keyy);
      };
 
      this.output = (this.fb.getList('Class').map(classes =>
        classes.filter(a => {
          if (tempKeys.indexOf(a.$key) > -1) {
            return true;
          }
          return false;
        })
      ) as FirebaseListObservable<any[]>);
      this.value.emit(this.output);
    })

  }


  submit(){
    let key : string;
    this.fb.getListQuery('Class', { preserveSnapshot: true}).map(i =>{
      return i})
    .subscribe(snapshots=>{
       this.startDate.setHours(this.startHour);
    this.startDate.setMinutes(this.startMin);
    this.endDate.setHours(this.endHour);
    this.endDate.setMinutes(this.endMin);
    console.log(snapshots);

    //or(let)
        snapshots.forEach(snapshot => {
          
        let startD = new Date(snapshot.val().startDate);
        let startE = new Date(snapshot.val().endDate);
       //console.log(startD, startE, this.startDate,this.endDate);
        if(this.startDate.getHours() === startD.getHours() &&
           this.startDate.getMinutes() === startD.getMinutes() &&
           this.endDate.getHours() === startE.getHours() &&
           this.endDate.getMinutes() === startE.getMinutes()){
            console.log('aaa');  
             //return true;
             key = snapshot.key;  
        }
      
         // console.log(snapshot.key, snapshot.val());
        });

          
      console.log(key);
    },(er)=>{},()=>{
      console.log('hello');
     // this.submit2(key);
    }).unsubscribe();
  }

  submit2(oldKey) {
    this.startDate.setHours(this.startHour);
    this.startDate.setMinutes(this.startMin);
    this.endDate.setHours(this.endHour);
    this.endDate.setMinutes(this.endMin);

    let push = {
      startDate: this.startDate.toString(),
      endDate: this.endDate.toString()
    };


 //   (this.fb.getList('Class').map(classes =>
 //       classes.filter(a => {
 //         console.log('ccc');
 //         if (a) {
 //           return true;
 //         }
 //         return false;
 //       })
 //   ) as FirebaseListObservable<any[]>).subscribe(blah => {
//      console.log(blah);
//    });

  //let list  = this.fb.getList('Class').take(1);

//  let list  = (this.fb.getList('Class').map(classes =>
//        classes.filter(a => {
//         let startD = new Date(a.startDate);
//        let startE = new Date(a.endDate);
//       console.log(startD, startE);
//        if(this.startDate.getHours() === startD.getHours() &&
//           this.startDate.getMinutes() === startD.getMinutes() &&
//           this.endDate.getHours() === startE.getHours() &&
//           this.endDate.getMinutes() === startE.getMinutes()){
//            console.log('aaa');  
//             return true;
//             //key = cla[i].$key;  
//        }
//        return false;
//        })
//      ) as FirebaseListObservable<any[]>)

 //   let list =this.fb.getListQuery('Class', { preserveSnapshot: true});
 //   list.subscribe(snapshots=>{
 //       snapshots.forEach(snapshot => {
 //         console.log(snapshot.key, snapshot.val());
 // /      });
 //   },(er)=>{},()=>{


 //let key;
     //  console.log(cla);
     //  for(let i = 0; i < cla.length; i++){
       

  // key = cla[i].$key;

       //  let startD = new Date(cla[i].startDate);
      //   let startE = new Date(cla[i].endDate);
       // console.log(startD, startE);
      //   if(this.startDate.getHours() === startD.getHours() &&
       //     this.startDate.getMinutes() === startD.getMinutes() &&
        //    this.endDate.getHours() === startE.getHours() &&
         //   this.endDate.getMinutes() === startE.getMinutes()){
          //    console.log('aaa');  
           //   key = cla[i].$key;  
        // }
    //   }

let key;
       console.log(oldKey);
      if(!!oldKey || oldKey === ''){
        key = oldKey;
      }else{
        console.log('push');
         key = this.fb.pushWithKey('/Class', push).key;
      }
   



   

//    console.log('aaa');


    //let key = this.fb.pushWithKey('/Class', push).key;
    this.fb.getUserId().take(1).subscribe(uid => {
      this.fb.getObject('User/' + uid).take(1).subscribe(user => {
        console.log('yo');
        if (!!user.schedule) {
          let schedule = user.schedule;
          let submit = {};
          submit[key] = true;
          this.fb.updateItem('Schedule', schedule, submit).then(value =>{
              this.emitData(user.schedule);
          });
        } else {
          let submit = {};
          submit[key] = true;
          let innerKey = this.fb.pushWithKey('Schedule', submit).key;
          this.fb.updateItem('User', uid, { schedule: innerKey }).then(value =>{
              this.emitData(user.schedule);
          });
        }

      });
    });

      
   // }).unsubscribe(

   // );



     // this.fb.getList('Class').subscribe(cla => {   },(er)=>{},() =>{     });
  }
  


}