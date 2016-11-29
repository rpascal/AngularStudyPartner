import { Pipe, PipeTransform } from '@angular/core';
import { ScheduleService } from '../../services/schedule-service/schedule.service';
import { UserService, UserModel } from '../../services/user-service/user.service';



@Pipe({
  name: 'classFilter'
})
export class ClassFilterPipe implements PipeTransform {

  constructor(
    public scheduleService: ScheduleService,
    public UserService: UserService) {

  }
  transform(value: any, args?: any) : any {
    console.log(value);
    let temp = value;
    this.UserService.getUser().subscribe(user => {
      this.scheduleService.getObjectObservable(user.schedule).subscribe(d1 => {
        if (!!value)
          temp = value.filter(value2 => {
            let bool = true;
            console.log(bool, '1');
            bool = d1.hasOwnProperty(value2.$key);
            console.log(bool, '2');
            return bool;
          });
      });
    //  console.log(bool, '3');
      
    });
    return temp;
  }

}
