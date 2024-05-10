import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NGRX_AUTO_ENTITY_APP_STORE, NgrxAutoEntityModule } from '@briebug/ngrx-auto-entity';
import { NgrxAutoEntityServiceModule } from '@briebug/ngrx-auto-entity-service';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appMetaReducers, appReducer } from './app.state';
import { CustomRouterStateSerializer } from './shared/utils';
import { ConfigService } from '../services/config.service';
import { AccountStateModule } from './account';
import { CustomerStateModule } from './customer';

export function provideAppStore(store: Store<any>) {
  return store;
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducer, {
      metaReducers: appMetaReducers,
      runtimeChecks: {
        strictStateImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ connectInZone: true }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([]),
    NgrxAutoEntityModule.forRoot(),
    NgrxAutoEntityServiceModule.forRoot(
      configService => {
        return {
          urlPrefix: (...args) => configService.apiBaseUrl
        };
      },
      [ConfigService]
    ),
    AccountStateModule,
    CustomerStateModule
  ],
  providers: [
    { provide: NGRX_AUTO_ENTITY_APP_STORE, useFactory: provideAppStore, deps: [Store] },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ]
})
export class StateModule {
  static forRoot(): ModuleWithProviders<StateModule> {
    return {
      ngModule: StateModule
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: StateModule) {
    if (parentModule) {
      throw new Error('StateModule is already loaded. Import it in the AppModule only');
    }
  }
}
