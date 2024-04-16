import { inject, makeEnvironmentProviders } from '@angular/core';
import { provideAutoEntityStore } from '@briebug/ngrx-auto-entity';
import { provideAutoEntityService } from '@briebug/ngrx-auto-entity-service';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, RouterStateSerializer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { CustomRouterStateSerializer } from './shared/utils';
import { ConfigService } from '../services/config.service';
import { CUSTOMER_STATE_NAME, customerReducer, ICustomerState, provideCustomerState } from './customer';
import { ACCOUNT_STATE_NAME, accountReducer, IAccountState, provideAccountState } from './account';
import { environment } from '../../environments/environment';

export interface IAppState {
  [ACCOUNT_STATE_NAME]: IAccountState;
  [CUSTOMER_STATE_NAME]: ICustomerState;
}

export type AppState = IAppState;

export const appReducer: ActionReducerMap<AppState> = {
  [ACCOUNT_STATE_NAME]: accountReducer,
  [CUSTOMER_STATE_NAME]: customerReducer
};

export const appMetaReducers: Array<MetaReducer<AppState>> = !environment.production ? [] : [];

export function provideAppState() {
  return makeEnvironmentProviders([
    provideStore(appReducer, {
      metaReducers: appMetaReducers,
      runtimeChecks: {
        strictStateImmutability: true
      }
    }),
    provideStoreDevtools({
      connectInZone: true
    }),
    provideRouterStore(),
    provideEffects(),
    provideAutoEntityStore(),
    provideAutoEntityService(() => {
      const configService = inject(ConfigService);
      return {
        urlPrefix: (...args) => configService.apiBaseUrl
      }
    }),
    provideAccountState(),
    provideCustomerState(),
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ]);
}
