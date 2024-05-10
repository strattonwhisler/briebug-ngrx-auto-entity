import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './services/config.service';

import { provideAppState } from './state/state.providers';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAppState(),
    ConfigService,
  ]
};
