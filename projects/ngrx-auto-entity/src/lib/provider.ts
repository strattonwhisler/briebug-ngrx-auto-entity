import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  InjectionToken,
  Injector,
  makeEnvironmentProviders,
  Provider,
  Type
} from '@angular/core';
import { META_REDUCERS, Store } from '@ngrx/store';
import { EffectSources } from '@ngrx/effects';

import { EntityEffects } from './effects/effects-all';
import { ExtraEffects } from './effects/effects-extra';
import { EntityIfNecessaryOperators } from './effects/if-necessary-operators';
import { EntityOperators } from './effects/operators';
import { autoEntityMetaReducer } from './reducer/meta-reducer';
import { NgrxAutoEntityService } from './service/service';
import { addInjector } from './service/service-injection';
import { NGRX_AUTO_ENTITY_APP_STORE } from './effects/if-necessary-operator-utils';

export interface NgRxAutoEntityFeature<FeatureKind extends NgRxAutoEntityFeatureKind> {
  ɵkind: FeatureKind;
  ɵproviders: Provider[];
}

function isAutoEntityFeature <FeatureKind extends NgRxAutoEntityFeatureKind>(value: any): value is NgRxAutoEntityFeature<FeatureKind> {
  return value && value.ɵkind != null && value.ɵproviders != null;
}

function autoEntityFeature<FeatureKind extends NgRxAutoEntityFeatureKind>(
  kind: FeatureKind,
  providers: Provider[],
): NgRxAutoEntityFeature<FeatureKind> {
  return { ɵkind: kind, ɵproviders: providers };
}

export const NGRX_AUTO_ENTITY_CONFIG = new InjectionToken<NgRxAutoEntityConfig>('@briebug/ngrx-auto-entity Config')

export interface NgRxAutoEntityConfig {
  /**
   * Prevent Auto-Entity from registering its entity effects.
   */
  withNoEntityEffects?: true | undefined;

  /**
   * Prevent Auto-Entity from registering its extra effects.
   *
   * This includes all select, deselect, and edit effects.
   */
  withNoExtraEffects?: true | undefined;
}

const defaultConfig: NgRxAutoEntityConfig = {};

export function getNgRxAutoEntityMetaReducer() {
  return autoEntityMetaReducer;
}

export function addNgRxAutoEntityEffects(): () => void {
  const config = inject(NGRX_AUTO_ENTITY_CONFIG);

  return () => {
    // NOTE: The following trick learned from @ngrx/data!

    // Warning: this alternative approach relies on an undocumented API
    // to add effect directly rather than through `provideEffects`.
    // The danger is that provideEffects evolves and we no longer perform a crucial step.

    const effectSources = inject(EffectSources);
    const entityEffects = inject(EntityEffects, { optional: config.withNoEntityEffects });
    const extraEffects = inject(ExtraEffects, { optional: config.withNoExtraEffects });

    entityEffects && effectSources.addEffects(entityEffects);
    extraEffects && effectSources.addEffects(extraEffects);
  };
}

export function _provideAutoEntityStore(
  config: NgRxAutoEntityConfig = defaultConfig,
  features: NgRxAutoEntityFeatures[] = []
): Provider[] {
  return [
    NgrxAutoEntityService,
    EntityOperators,
    EntityIfNecessaryOperators,
    config.withNoEntityEffects ? [] : EntityEffects,
    config.withNoExtraEffects ? [] : ExtraEffects,
    { provide: META_REDUCERS, useFactory: getNgRxAutoEntityMetaReducer, multi: true },
    { provide: NGRX_AUTO_ENTITY_CONFIG, useValue: config },
    { provide: ENVIRONMENT_INITIALIZER, useFactory: addNgRxAutoEntityEffects, multi: true },
    ...features.map((feature) => feature.ɵproviders),
  ].flat();
}

export function provideAutoEntityStore(config: NgRxAutoEntityConfig, ...features: NgRxAutoEntityFeatures[]): EnvironmentProviders;
export function provideAutoEntityStore(...features: NgRxAutoEntityFeatures[]): EnvironmentProviders;
/**
 * Sets up providers for the Auto-Entity Store.
 *
 * @usageNotes
 *
 * ### Providing Auto-Entity
 *
 * Basic example of providing the root Auto-Entity Store:
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideAutoEntityStore(
 *       withEntityService(Customer, CustomerService)
 *     ),
 *   ]
 * })
 * ```
 *
 * @param args
 * @returns A set of providers to set up the Auto-Entity Store.
 */
export function provideAutoEntityStore(...args: (NgRxAutoEntityConfig | NgRxAutoEntityFeatures)[]): EnvironmentProviders {
  const config = isAutoEntityFeature(args[0]) ? undefined : args.shift() as NgRxAutoEntityConfig;
  const features = args as NgRxAutoEntityFeatures[];

  return makeEnvironmentProviders(
    _provideAutoEntityStore(
      config,
      features
    )
  );
}

let INJECTOR_DEPTH = 0;

export function addNgRxAutoEntityInjector() {
  const injector = inject(Injector);

  // Update the core NgRxAutoEntityService INJECTORS to include the current injector
  // This creates a list of injectors that should eventually encompass the entire application
  // as lazy loaded modules are subsequently created, to be evaluated in reverse order
  INJECTOR_DEPTH = INJECTOR_DEPTH + 1;
  addInjector(
    Injector.create({
      providers: [],
      parent: injector,
      name: 'AutoEntityInjector' + INJECTOR_DEPTH
    })
  );
}

export function _provideAutoEntityState(features: NgRxAutoEntityStateFeatures[] = []): Provider[] {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: addNgRxAutoEntityInjector
    },
    ...features.map((feature) => feature.ɵproviders),
  ];
}

/**
 * Sets up providers for an Auto-Entity Feature State.
 *
 * @usageNotes
 *
 * ### Providing an Auto-Entity Feature State
 *
 * Basic example of providing an Auto-Entity Feature State:
 * ```
 * export const routes: Routes = [
 *   {
 *     path: '',
 *     component: ProductsPageComponent,
 *     providers: [
 *       provideState(featureState),
 *       provideAutoEntityState(
 *         withEntityService(Products, ProductsService)
 *       )
 *     ]
 *   }
 * ];
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(appReducer),
 *     provideEffects(),
 *     provideAutoEntityStore(
 *       withAppStore(() => inject(Store))
 *     )
 *   ]
 * })
 * ```
 *
 * @param features List of Auto-Entity Features to include.
 * @returns A set of providers to set up an Auto-Entity Feature State.
 */
export function provideAutoEntityState(...features: NgRxAutoEntityStateFeatures[]): EnvironmentProviders {
  return makeEnvironmentProviders(
    _provideAutoEntityState(features)
  );
}

export type AppStoreFeature = NgRxAutoEntityFeature<NgRxAutoEntityFeatureKind.AppStoreFeature>

export type AppStoreFactory = (...deps: any[]) => Store<any>;

export function withAppStore(getAppStore: AppStoreFactory, deps?: any[]): AppStoreFeature {
  const providers = [
    { provide: NGRX_AUTO_ENTITY_APP_STORE, useFactory: getAppStore, deps },
  ];
  return autoEntityFeature(NgRxAutoEntityFeatureKind.AppStoreFeature, providers);
}

export type EntityServiceFeature = NgRxAutoEntityFeature<NgRxAutoEntityFeatureKind.EntityServiceFeature>;

const PROVIDED_SERVICES: Type<any>[] = [];

/**
 * Includes providers for an Entity's Service.
 *
 * @param modelType The model to provide a service for.
 * @param service The service to provide.
 * @returns A set of providers to set up an Entity's Service.
 */
export function withEntityService(modelType: Type<any>, service: Type<any>): EntityServiceFeature {
  const providers: Provider[] = [
    { provide: modelType, useExisting: service }
  ];

  if (!PROVIDED_SERVICES.includes(service)) {
    providers.push(service);
    PROVIDED_SERVICES.push(service);
  }

  return autoEntityFeature(NgRxAutoEntityFeatureKind.EntityServiceFeature, providers);
}

export type NgRxAutoEntityFeatures =
  | AppStoreFeature
  | EntityServiceFeature;

export type NgRxAutoEntityStateFeatures =
  | EntityServiceFeature;

export const enum NgRxAutoEntityFeatureKind {
  AppStoreFeature,
  EntityServiceFeature,
}
