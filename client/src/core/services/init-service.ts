import { inject, Service } from '@angular/core';
import { AccountService } from './account-service';

@Service()
export class InitService {
    private accountService = inject(AccountService);

    init(){
        this.accountService.loadCurrentUser();
    }
}
