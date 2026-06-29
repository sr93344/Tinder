import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginCreds, RegisterCreds } from '../../type/User';
import { ToastService } from '../../core/services/toast-service';
import { AsyncPipe } from '@angular/common';
import { themes } from '../themes';
import { LoadingService } from '../../core/services/loading-service';


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{
  protected creds : any = {};
  protected accountService = inject(AccountService);
  protected loadingService = inject(LoadingService);
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected themes = themes;

  // constructor(){
  //   effect(() => {
  //     console.log('Current User:' + this.accountService.currentUser()?.displayName);
  //   })
  // }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedThemes(theme: string){
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.close();
  }

  register(){
    this.accountService.register(this.creds as RegisterCreds).subscribe({
        next: (user) => {
          this.router.navigateByUrl("/members");
        },
        error: (err) => console.log(err)
    });
  }

  login(){
    this.accountService.login(this.creds as LoginCreds).subscribe({
        next: (user) => {
          this.creds = {};
          this.toastService.success("Login Successfully");
          //this.router.navigateByUrl("/members");
        },
        error: (err) => this.toastService.error(err.error.errors[0])
    });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  close(){
    const elem = document.activeElement as HTMLDivElement;
    if(elem) elem.blur();
  }

}
