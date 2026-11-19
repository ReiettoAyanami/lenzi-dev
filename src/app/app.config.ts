import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideLenziKit } from '@lenzi/ui-kit';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { lenziErrorInterceptor } from '@lenzi/ui-kit/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideLenziKit({ appId: 'lenzi-dev' }),
    provideHttpClient(withFetch(), withInterceptors([lenziErrorInterceptor])),
  ],
};
