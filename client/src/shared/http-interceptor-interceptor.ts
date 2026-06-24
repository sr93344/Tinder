import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../core/services/account-service';

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  var accountService = inject(AccountService);
  var token = accountService.loadCurrentUser()?.token;
  const modifiedReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) 
    : req;
  return next(modifiedReq);
};
