import { Component, inject, output, signal } from '@angular/core';
import { RegisterCreds } from '../../../type/User';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  cancelRegisterEvent = output<boolean>();
  accountService = inject(AccountService);
  toastService = inject(ToastService);

  register(){
    this.accountService.register(this.creds).subscribe(res =>{
      console.log(res);
      this.toastService.info("User Registered Successfully. Please Login");
    }, err => {
      console.log(err);
    });
  }

  cancel(){
    this.cancelRegisterEvent.emit(false);
  }
}
