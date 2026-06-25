import { Component, output, signal } from '@angular/core';
import { RegisterCreds } from '../../../type/User';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  cancelRegisterEvent = output<boolean>();

  register(){
    console.log(this.creds);
  }

  cancel(){
    this.cancelRegisterEvent.emit(false);
  }
}
