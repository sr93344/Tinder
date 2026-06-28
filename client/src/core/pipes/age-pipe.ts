import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const today = new Date();
    const dob = new Date(value);
    const dt = new Date(dob.getFullYear(), today.getMonth(), today.getDate());
    let age = today.getFullYear() - dob.getFullYear();
    if(dt<dob) age--;
    return age;
  }
}
