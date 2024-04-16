import { makeEnvironmentProviders } from '@angular/core';
import { provideAutoEntityState, provideEntityService } from '@briebug/ngrx-auto-entity';
import { EntityService } from '@briebug/ngrx-auto-entity-service';
import { ActionReducerMap, combineReducers, createFeature, provideState } from '@ngrx/store';

import { IProductState, PRODUCT_STATE_NAME, productReducer } from './product.state';
import { Product } from '../models/product.model';
import { FEATURE_STATE_NAME } from './feature.state-name';


export interface FeatureState {
  [PRODUCT_STATE_NAME]: IProductState;
}

export const featureReducer: ActionReducerMap<FeatureState> = {
  product: productReducer
};

export const featureState = createFeature({
  name: FEATURE_STATE_NAME,
  reducer: combineReducers(featureReducer)
});

export function provideFeatureState() {
  return makeEnvironmentProviders([
    provideState(featureState),
    provideAutoEntityState(),
    provideEntityService(Product, EntityService)
  ]);
}
