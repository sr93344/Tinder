import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../type/User';
import { of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Service()
export class AccountService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl + 'account/';
    currentUser = signal<User | null>(null);

    // ---- Email Login (existing) ----
    login(values: LoginCreds) {
        return this.http.post<User>(this.baseUrl + 'login', values).pipe(
            tap(user => {
                if(user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    // ---- Email Register (existing) ----
    register(values: RegisterCreds) {
        return this.http.post<User>(this.baseUrl + 'register', values).pipe(
            tap(user => {
                if(user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }


    // ---- Shared ----
    setCurrentUser(user: User) {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('user');
    }

    loadCurrentUser() {
        const user = localStorage.getItem('user');
        if (!user) return;
        this.setCurrentUser(JSON.parse(user));
    }
}

