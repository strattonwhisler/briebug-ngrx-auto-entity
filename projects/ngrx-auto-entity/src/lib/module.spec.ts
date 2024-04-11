import { TestBed } from '@angular/core/testing';
import { META_REDUCERS, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule, EffectSources } from '@ngrx/effects';

import { EntityEffects } from './effects/effects-all';
import { ExtraEffects } from './effects/effects-extra';
import { EntityIfNecessaryOperators } from './effects/if-necessary-operators';
import { EntityOperators } from './effects/operators';
import { autoEntityMetaReducer } from './reducer/meta-reducer';
import { NgrxAutoEntityModule } from './module';
import { NEVER } from 'rxjs';

let effectSources: EffectSources;
let entityOps: EntityOperators;
let entityIfNecessaryOps: EntityIfNecessaryOperators;
let entityEffects: EntityEffects;
let extraEffects: ExtraEffects;
let metaReducers: MetaReducer[];

function resolveDependencies() {
  effectSources = TestBed.inject(EffectSources);
  entityOps = TestBed.inject(EntityOperators, null, { optional: true });
  entityIfNecessaryOps = TestBed.inject(EntityIfNecessaryOperators, null, { optional: true });
  entityEffects = TestBed.inject(EntityEffects, null, { optional: true });
  extraEffects = TestBed.inject(ExtraEffects, null, { optional: true });
  metaReducers = TestBed.inject(META_REDUCERS, null, { optional: true });
}

const mockEffectSourcesProvider = {
  useValue: {
    addEffects: jest.fn(),
    toActions: jest.fn().mockReturnValue(NEVER)
  }
};

describe('Module: NgRxAutoEntityRootModuleWithEffects', () => {
  it('should provide the correct dependencies', () => {
    TestBed
      .configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          NgrxAutoEntityModule.forRoot()
        ]
      })
      .overrideProvider(EffectSources, mockEffectSourcesProvider);

    resolveDependencies();

    expect(entityOps).toBeDefined();
    expect(entityIfNecessaryOps).toBeDefined();
    expect(entityEffects).toBeDefined();
    expect(extraEffects).toBeDefined();

    expect(metaReducers).toContain(autoEntityMetaReducer);

    expect(effectSources.addEffects).toHaveBeenCalledWith(entityEffects);
    expect(effectSources.addEffects).toHaveBeenCalledWith(extraEffects);
  });
});

describe('Module: NgRxAutoEntityRootModuleNoEntityEffects', () => {
  it('should provide the correct dependencies', () => {
    TestBed
      .configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          NgrxAutoEntityModule.forRootNoEntityEffects()
        ]
      })
      .overrideProvider(EffectSources, mockEffectSourcesProvider);

    resolveDependencies();

    expect(entityOps).toBeDefined();
    expect(entityIfNecessaryOps).toBeDefined();
    expect(entityEffects).toBeNull();
    expect(extraEffects).toBeDefined();

    expect(metaReducers).toContain(autoEntityMetaReducer);

    expect(effectSources.addEffects).not.toHaveBeenCalledWith(entityEffects);
    expect(effectSources.addEffects).toHaveBeenCalledWith(extraEffects);
  });
});

describe('Module: NgRxAutoEntityRootModuleNoEffects', () => {
  it('should provide the correct dependencies', () => {
    TestBed
      .configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          NgrxAutoEntityModule.forRootNoEffects()
        ]
      })
      .overrideProvider(EffectSources, mockEffectSourcesProvider);

    const effectSources = TestBed.inject(EffectSources);

    resolveDependencies();

    expect(entityOps).toBeDefined();
    expect(entityIfNecessaryOps).toBeDefined();
    expect(entityEffects).toBeNull();
    expect(extraEffects).toBeNull();

    expect(metaReducers).toContain(autoEntityMetaReducer);

    expect(effectSources.addEffects).not.toHaveBeenCalledWith(entityEffects);
    expect(effectSources.addEffects).not.toHaveBeenCalledWith(extraEffects);
  });
});

describe('Module: NgRxAutoEntityFeatureModule', () => {
  it('should provide the correct dependencies', () => {
    TestBed
      .configureTestingModule({
        imports: [
          NgrxAutoEntityModule.forFeature()
        ]
      })
  });
});

