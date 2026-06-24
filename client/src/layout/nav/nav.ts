import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { User } from '../../models/User.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{
  protected user: any = signal<User | null>(null);
  email = model('');
  password = model('');
  protected isLoggedIn = signal(false);
  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user.set(this.accountService.loadCurrentUser());
    if(this.user()!=null){
      this.isLoggedIn.set(true);
    }
    
  }

  register(){
    this.accountService.register({email: this.email, password: this.password}).subscribe({
        next: (user) => {
          this.accountService.setCurrentUser(user);
          this.user.set(this.accountService.loadCurrentUser());
        },
        error: (err) => console.log(err)
    });
  }

  login(){
    this.accountService.login({email: this.email(), password: this.password()}).subscribe({
        next: (user) => {
          this.accountService.setCurrentUser(user);
          window.location.href = '/';
          // this.router.navigateByUrl("/");
          //this.user.set(null);
        },
        error: (err) => console.log(err)
    });
  }

  logout(){
    this.accountService.logout();
    // this.router.navigateByUrl("/");
    window.location.href = '/';
  }

}
