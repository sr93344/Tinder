import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from '../shared/http-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
       withRouterConfig({
        onSameUrlNavigation: 'reload' // Instructs Angular to re-trigger guards/resolvers
      })
    ),
    provideHttpClient(
      withInterceptors([httpInterceptorInterceptor]) // Registers your middleware globally
    )
  ]
};
