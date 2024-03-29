import { importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { IEntityState, NGRX_AUTO_ENTITY_APP_STORE, NgrxAutoEntityModule } from '@briebug/ngrx-auto-entity';
import { EntityService, NgrxAutoEntityServiceModule } from '@briebug/ngrx-auto-entity-service';
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

export function provideAppStore(store: Store<any>) {
  return store;
}

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
    importProvidersFrom(
      NgrxAutoEntityModule.forRoot(),
      NgrxAutoEntityServiceModule.forRoot(
        (configService: ConfigService) => ({
          urlPrefix: (...args) => configService.url
        }),
        [ConfigService]
      )
    ),
    { provide: Customer, useExisting: EntityService },
    { provide: Account, useExisting: EntityService },
    { provide: NGRX_AUTO_ENTITY_APP_STORE, useFactory: provideAppStore, deps: [Store] },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ]);
}
