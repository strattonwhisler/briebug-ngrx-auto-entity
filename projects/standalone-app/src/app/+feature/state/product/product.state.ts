import { buildFeatureState, IEntityState } from '@briebug/ngrx-auto-entity';
import { Action, createReducer } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { selectFeatureState } from '../feature.selector';
import { FEATURE_STATE_NAME } from '../feature.state-name';

export const PRODUCT_STATE_NAME = 'product';

export interface IProductState extends IEntityState<Product> {
}

export const {
  initialState,
  facade: ProductFacadeBase,
  selectors: { selectAllSorted: allProducts },
  actions: {
    loadMany: manyProductsLoading,
    loadManySuccess: manyProductsLoadedSuccessfully,
    loadManyIfNecessary: manyProductsLoadingIfNecessary,
    editByKey: productEditedById,
    endEdit: productEditEnded
  }
} = buildFeatureState(Product, FEATURE_STATE_NAME, selectFeatureState);

const reduce = createReducer(initialState);

export function productReducer(state = initialState, action: Action): IProductState {
  return reduce(state, action);
}
