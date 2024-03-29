import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './services/config.service';
import { provideAppState } from './state/app.state';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAppState(),
    ConfigService,
  ]
};
