import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { User } from '../../models/User.model';

@Service()
export class AccountService {
    private http = inject(HttpClient);
    private baseUrl = 'https://localhost:5001/api/account/';

    // ---- Email Login (existing) ----
    login(values: any) {
        return this.http.post<User>(this.baseUrl + 'login', values);
    }

    // ---- Email Register (existing) ----
    register(values: any) {
        return this.http.post<User>(this.baseUrl + 'register', values);
    }


    // ---- Shared ----
    setCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    logout() {
        localStorage.removeItem('user');
    }

    loadCurrentUser() {
        const user = localStorage.getItem('user');
        if (!user) return;
        return JSON.parse(user);
    }
}
