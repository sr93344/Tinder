import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading-service';
import { delay, finalize, of, tap } from 'rxjs';
import { CacheService } from '../services/cache-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const cache = inject(CacheService);
  if(req.method === 'GET'){
    const cachedResponse = cache.get(req.url);
    if(cachedResponse){
      return of(cachedResponse)
    }
  }

  loadingService.loading();
  return next(req).pipe(
    delay(500),
    tap(res => {
      cache.set(req.url, res);
    }),
    finalize(() => {
      loadingService.idle();
    })
  )
};
