import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '../core/interceptors/http-interceptor';
import { InitService } from '../core/services/init-service';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
       withRouterConfig({
        onSameUrlNavigation: 'reload' // Instructs Angular to re-trigger guards/resolvers
      }),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([httpInterceptor, 
        errorInterceptor, 
        // loadingInterceptor -- disabling for now.
      ]) // Registers your middleware globally
    ),
    provideAppInitializer(() => {
      const initService = inject(InitService);
      initService.init();

      return new Promise<void>((resolve)=>{
        const splash = document.getElementById("initial-splash");
        if(splash){
          setTimeout(()=>{
            splash.remove();
            resolve();
          }, 200)
        }
      })
       
    })
  ]
};
