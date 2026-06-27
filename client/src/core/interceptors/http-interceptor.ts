import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account-service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  var accountService = inject(AccountService);
  var token = accountService.currentUser()?.token;
  const modifiedReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) 
    : req;
  return next(modifiedReq);
};
