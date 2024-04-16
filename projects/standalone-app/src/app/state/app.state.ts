import { inject, makeEnvironmentProviders } from '@angular/core';
import { IEntityState, provideAutoEntityStore, provideEntityService } from '@briebug/ngrx-auto-entity';
import { EntityService, provideAutoEntityService } from '@briebug/ngrx-auto-entity-service';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, RouterStateSerializer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer, provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { CustomRouterStateSerializer } from './shared/utils';
import { ConfigService } from '../services/config.service';
import { Customer } from '../models/customer.model';
import { Account } from '../models/account.model';
import { CUSTOMER_STATE_NAME, customerReducer, ICustomerState } from './customer.state';
import { ACCOUNT_STATE_NAME, accountReducer } from './account.state';
import { environment } from '../../environments/environment';
import { MyEntityService } from '../services/my-entity.service';


export interface IAppState {
  [ACCOUNT_STATE_NAME]: IEntityState<Account>;
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
    provideEntityService(Customer, EntityService),
    provideEntityService(Account, MyEntityService),
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ]);
}
