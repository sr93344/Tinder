import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from '../shared/http-interceptor-interceptor';
import { InitService } from '../core/services/init-service';

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
      withInterceptors([httpInterceptorInterceptor]) // Registers your middleware globally
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
          }, 500)
        }
      })
       
    })
  ]
};
