import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'AgePipe'})
export class AgePipe implements PipeTransform {
  transform(value , args): number {
    console.log(value);

    return value.take(1).subscribe(value => {
      value.filter(person => {
        return person.name.startsWith(args);
    });
    });
  }
}