import { ModuleWithProviders, NgModule } from '@angular/core';

import { _provideAutoEntityState, _provideAutoEntityStore, _withNoStore } from './provider';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NgRxAutoEntityModuleConfig {
  excludeEffects?: boolean;
}

@NgModule({})
export class NgRxAutoEntityRootModuleWithEffects {}

@NgModule({})
export class NgRxAutoEntityRootModuleNoEntityEffects {}

@NgModule({})
export class NgRxAutoEntityRootModuleNoEffects {}

@NgModule({})
export class NgRxAutoEntityFeatureModule {}

@NgModule({})
export class NgrxAutoEntityModule {
  static forRoot(): ModuleWithProviders<NgRxAutoEntityRootModuleWithEffects> {
    return {
      ngModule: NgRxAutoEntityRootModuleWithEffects,
      providers: [..._provideAutoEntityStore({}, [_withNoStore()])]
    };
  }

  static forRootNoEntityEffects(): ModuleWithProviders<NgRxAutoEntityRootModuleNoEntityEffects> {
    return {
      ngModule: NgRxAutoEntityRootModuleNoEntityEffects,
      providers: [
        ..._provideAutoEntityStore(
          {
            withNoEntityEffects: true
          },
          [_withNoStore()]
        )
      ]
    };
  }

  static forRootNoEffects(): ModuleWithProviders<NgRxAutoEntityRootModuleNoEffects> {
    return {
      ngModule: NgRxAutoEntityRootModuleNoEffects,
      providers: [
        ..._provideAutoEntityStore(
          {
            withNoEntityEffects: true,
            withNoExtraEffects: true
          },
          [_withNoStore()]
        )
      ]
    };
  }

  static forFeature(): ModuleWithProviders<NgRxAutoEntityFeatureModule> {
    return {
      ngModule: NgRxAutoEntityFeatureModule,
      providers: [..._provideAutoEntityState()]
    };
  }
}
