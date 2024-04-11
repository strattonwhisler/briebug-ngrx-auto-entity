import { TestBed } from '@angular/core/testing';
import {
  autoEntityMetaReducer, Entity,
  EntityEffects,
  EntityOperators,
  ExtraEffects, Key,
  NGRX_AUTO_ENTITY_APP_STORE,
  NgrxAutoEntityService,
  provideAutoEntityStore, provideEntityService, withCustomStore,
  withoutEntityEffects,
  withoutExtraEffects
} from '@briebug/ngrx-auto-entity';
import { META_REDUCERS, MetaReducer, provideStore, Store } from '@ngrx/store';
import { identity, NEVER } from 'rxjs';
import { EffectSources, provideEffects } from '@ngrx/effects';
import { EntityIfNecessaryOperators } from './effects/if-necessary-operators';
import { Injectable, Provider } from '@angular/core';
import { _resetProvidedServices, NgRxAutoEntityFeatureKind } from './provider';

@Injectable()
class MyStore extends Store {}

@Entity({ modelName: 'Test' })
class Test {
  @Key id: number;
}

@Entity({ modelName: 'Alt' })
class Alt {
  @Key id: number;
}

@Injectable()
class TestService {}

@Injectable()
class AltService {}

describe('Function: getNgRxAutoEntityMetaReducer', () => {});

describe('Function: provideAutoEntityStore', () => {
  let effectSources: EffectSources;
  let entityService: NgrxAutoEntityService | null;
  let entityOps: EntityOperators | null;
  let entityIfNecessaryOps: EntityIfNecessaryOperators | null;
  let entityEffects: EntityEffects | null;
  let extraEffects: ExtraEffects | null;
  let metaReducers: MetaReducer[] | null;
  let appStore: Store | null;

  beforeEach(() => {
    effectSources = null;
    entityService = null;
    entityOps = null;
    entityIfNecessaryOps = null;
    entityEffects = null;
    extraEffects = null;
    metaReducers = null;
    appStore = null;
  });

  function resolveDependencies() {
    effectSources = TestBed.inject(EffectSources);
    entityService = TestBed.inject(NgrxAutoEntityService, null, { optional: true });
    entityOps = TestBed.inject(EntityOperators, null, { optional: true });
    entityIfNecessaryOps = TestBed.inject(EntityIfNecessaryOperators, null, { optional: true });
    entityEffects = TestBed.inject(EntityEffects, null, { optional: true });
    extraEffects = TestBed.inject(ExtraEffects, null, { optional: true });
    metaReducers = TestBed.inject(META_REDUCERS, null, { optional: true });
    appStore = TestBed.inject(NGRX_AUTO_ENTITY_APP_STORE, null, { optional: true }) as Store;
  }

  const mockEffectSourcesProvider = {
    useValue: {
      addEffects: jest.fn(),
      toActions: jest.fn().mockReturnValue(NEVER)
    }
  };

  // NOTE: Parity with NgRxAutoEntityRootModuleWithEffects
  describe('Features: none', () => {
    it('should provide the correct dependencies', () => {
      TestBed.configureTestingModule({
        providers: [provideStore(identity), provideEffects(), provideAutoEntityStore()]
      }).overrideProvider(EffectSources, mockEffectSourcesProvider);

      resolveDependencies();

      expect(entityService).toBeDefined();
      expect(entityOps).toBeDefined();
      expect(entityIfNecessaryOps).toBeDefined();
      expect(entityEffects).toBeDefined();
      expect(extraEffects).toBeDefined();
      expect(appStore).toBeDefined();

      expect(metaReducers).toContain(autoEntityMetaReducer);

      expect(effectSources.addEffects).toHaveBeenCalledWith(entityEffects);
      expect(effectSources.addEffects).toHaveBeenCalledWith(extraEffects);
    });
  });

  describe('Feature: withCustomStore', () => {});

  // NOTE: Parity with NgRxAutoEntityRootModuleNoEntityEffects
  describe('Feature: withoutEntityEffects', () => {
    it('should exclude EntityEffects from the providers list', () => {
      TestBed.configureTestingModule({
        providers: [provideStore(identity), provideEffects(), provideAutoEntityStore(withoutEntityEffects())]
      }).overrideProvider(EffectSources, mockEffectSourcesProvider);

      resolveDependencies();

      expect(entityService).toBeDefined();
      expect(entityOps).toBeDefined();
      expect(entityIfNecessaryOps).toBeDefined();
      expect(entityEffects).toBeNull();
      expect(extraEffects).toBeDefined();
      expect(appStore).toBeDefined();

      expect(metaReducers).toContain(autoEntityMetaReducer);

      expect(effectSources.addEffects).not.toHaveBeenCalledWith(entityEffects);
      expect(effectSources.addEffects).toHaveBeenCalledWith(extraEffects);
    });
  });

  describe('Feature: withoutExtraEffects', () => {
    it('should exclude ExtraEffects from the providers list', () => {
      TestBed.configureTestingModule({
        providers: [provideStore(identity), provideEffects(), provideAutoEntityStore(withoutExtraEffects())]
      }).overrideProvider(EffectSources, mockEffectSourcesProvider);

      resolveDependencies();

      expect(entityService).toBeDefined();
      expect(entityOps).toBeDefined();
      expect(entityIfNecessaryOps).toBeDefined();
      expect(entityEffects).toBeDefined();
      expect(extraEffects).toBeNull();
      expect(appStore).toBeDefined();

      expect(metaReducers).toContain(autoEntityMetaReducer);

      expect(effectSources.addEffects).toHaveBeenCalledWith(entityEffects);
      expect(effectSources.addEffects).not.toHaveBeenCalledWith(extraEffects);
    });
  });

  // NOTE: Parity with NgRxAutoEntityRootModuleNoEffects
  describe('Features: withoutEntityEffects, withoutExtraEffects', () => {
    it('should exclude EntityEffects and ExtraEffects from the providers list', () => {
      TestBed.configureTestingModule({
        providers: [provideStore(identity), provideEffects(), provideAutoEntityStore(withoutEntityEffects(), withoutExtraEffects())]
      }).overrideProvider(EffectSources, mockEffectSourcesProvider);

      resolveDependencies();

      expect(entityService).toBeDefined();
      expect(entityOps).toBeDefined();
      expect(entityIfNecessaryOps).toBeDefined();
      expect(entityEffects).toBeNull();
      expect(extraEffects).toBeNull();
      expect(appStore).toBeDefined();

      expect(metaReducers).toContain(autoEntityMetaReducer);

      expect(effectSources.addEffects).not.toHaveBeenCalledWith(entityEffects);
      expect(effectSources.addEffects).not.toHaveBeenCalledWith(extraEffects);
    });
  });
});

describe('Function: withCustomStore', () => {
  it('should return a CustomStoreFeature providing NGRX_AUTO_ENTITY_APP_STORE', () => {
    const feature = withCustomStore(MyStore);
    expect(feature).toEqual({
      ɵkind: NgRxAutoEntityFeatureKind.CustomStoreFeature,
      ɵproviders: [
        { provide: NGRX_AUTO_ENTITY_APP_STORE, useExisting: MyStore },
      ]
    });
  });
});

describe('Function: withoutEntityEffects', () => {
  it('should return an EntityEffectsFeature providing nothing', () => {
    const feature = withoutEntityEffects();
    expect(feature).toEqual({
      ɵkind: NgRxAutoEntityFeatureKind.EntityEffectsFeature,
      ɵproviders: []
    });
  });
});

describe('Function: withoutExtraEffects', () => {
  it('should return an ExtraEffectsFeature providing nothing', () => {
    const feature = withoutExtraEffects();
    expect(feature).toEqual({
      ɵkind: NgRxAutoEntityFeatureKind.ExtraEffectsFeature,
      ɵproviders: []
    });
  });
});

describe('Function: provideAutoEntityState', () => {});

describe('Function: provideEntityService', () => {
  afterEach(() => {
    _resetProvidedServices();
  });

  it('should provide a service using the entity as the token', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEntityService(Test, TestService)
      ]
    });

    const service = TestBed.inject(Test);
    expect(service).toBeDefined();
  });

  it('should support providing multiple services', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEntityService(Test, TestService),
        provideEntityService(Alt, AltService)
      ]
    });

    const testService = TestBed.inject(Test);
    expect(testService).toBeDefined();

    const altService = TestBed.inject(Alt);
    expect(altService).toBeDefined();
  });

  it('should reuse service instances for entities using the same service class', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEntityService(Test, TestService),
        provideEntityService(Alt, TestService)
      ]
    });

    const testService = TestBed.inject(Test);
    const altService = TestBed.inject(Test);

    expect(testService).toBe(altService);
  });
});
