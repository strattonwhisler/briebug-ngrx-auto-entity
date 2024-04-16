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

function includesFeature <FeatureKind extends NgRxAutoEntityFeatureKind>(features: NgRxAutoEntityFeatures[], featureKind: FeatureKind): boolean {
  return features.some(feature => feature.ɵkind === featureKind);
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

/** @internal */
export function _provideAutoEntityStore(
  config: NgRxAutoEntityConfig = defaultConfig,
  features: NgRxAutoEntityFeatures[] = []
): Provider[] {
  const effects = [];

  if (!config.withNoEntityEffects) {
    effects.push(EntityEffects);
  }

  if (!config.withNoExtraEffects) {
    effects.push(ExtraEffects);
  }

  if (!includesFeature(features, NgRxAutoEntityFeatureKind.CustomStoreFeature)) {
    features.push(withCustomStore(() => inject(Store)));
  }

  return [
    NgrxAutoEntityService,
    EntityOperators,
    EntityIfNecessaryOperators,
    ...effects,
    { provide: META_REDUCERS, useFactory: getNgRxAutoEntityMetaReducer, multi: true },
    { provide: NGRX_AUTO_ENTITY_CONFIG, useValue: config },
    { provide: ENVIRONMENT_INITIALIZER, useFactory: addNgRxAutoEntityEffects, multi: true },
    ...features.map((feature) => feature.ɵproviders),
  ];
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
 *     provideAutoEntityStore(),
 *   ]
 * })
 * ```
 *
 * @publicApi
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

/** @internal */
export function _provideAutoEntityState(): Provider[] {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: addNgRxAutoEntityInjector
    }
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
 *       provideAutoEntityState()
 *     ]
 *   }
 * ];
 * ```
 *
 * @publicApi
 * @param features List of Auto-Entity Features to include.
 * @returns A set of providers to set up an Auto-Entity Feature State.
 */
export function provideAutoEntityState(): EnvironmentProviders {
  return makeEnvironmentProviders(
    _provideAutoEntityState()
  );
}

const PROVIDED_SERVICES: Type<any>[] = [];

/**
 * Sets up providers for an Entity's Service.
 *
 * This will reuse existing services when possible.
 *
 * @usageNotes
 *
 * ### Providing an Entity's Service
 *
 * Basic example of providing an entity's service:
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideEntityService(Products, ProductsService)
 *   ]
 * })
 * ```
 *
 * @publicApi
 * @param modelType The model to provide a service for.
 * @param service The service to provide.
 * @returns A set of providers to set up an Entity's Service.
 */
export function provideEntityService(modelType: Type<any>, service: Type<any>): EnvironmentProviders {
  const providers: Provider[] = [
    { provide: modelType, useExisting: service }
  ];

  if (!PROVIDED_SERVICES.includes(service)) {
    providers.unshift(service);
    PROVIDED_SERVICES.push(service);
  }

  return makeEnvironmentProviders(providers);
}

export type CustomStoreFeature = NgRxAutoEntityFeature<NgRxAutoEntityFeatureKind.CustomStoreFeature>

export type CustomStoreFactory = (...deps: any[]) => Store<any>;

export function withCustomStore(getStore: CustomStoreFactory, deps?: any[]): CustomStoreFeature {
  const providers = [
    { provide: NGRX_AUTO_ENTITY_APP_STORE, useFactory: getStore, deps },
  ];
  return autoEntityFeature(NgRxAutoEntityFeatureKind.CustomStoreFeature, providers);
}

/**
 * Disables automatic providing of the Auto-Entity Store.
 * @internal
 */
export function _withNoStore(): CustomStoreFeature {
  return autoEntityFeature(NgRxAutoEntityFeatureKind.CustomStoreFeature, []);
}

export type NgRxAutoEntityFeatures =
  | CustomStoreFeature;


export const enum NgRxAutoEntityFeatureKind {
  CustomStoreFeature,
}
