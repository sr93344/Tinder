import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err) => {
      if (err) {
        switch (err.status) {
          case HttpStatusCode.BadRequest:
            if (err.error.errors) {
              const ModelStateError = [];
              for (const key in err.error.errors) {
                ModelStateError.push(err.error.errors[key]);
              }
              throw ModelStateError.flat();
            }else{
              toast.error(err.error);
            }
            break;
          case HttpStatusCode.Unauthorized:
            toast.error("Unauthorized.");
            break;
          case HttpStatusCode.NotFound:
            router.navigateByUrl('/not-found');
            break;
          case HttpStatusCode.InternalServerError:
            const navigationExtras: NavigationExtras = {state: {error: err.error} };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toast.error("Something went wrong.");
            break;
        }
      }
      throw err;
    })
  );
};
