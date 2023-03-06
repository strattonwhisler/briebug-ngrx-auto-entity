import { EntityActionTypes } from '../actions/action-types';
import { LoadAllSuccess } from '../actions/load-all-actions';
import { IEntityState } from '../util/entity-state';
import { ReductionBasis } from './reducer';
import { mergeMany, safeGetKey, setNewState } from './reduction.utils';
import { DomainInfo } from '../models';

export const loadAllReducer = ({ state, action, stateName, featureName, entityState }: ReductionBasis) => {
  switch (action.actionType) {
    case EntityActionTypes.LoadAll: {
      const newState: IEntityState<any> = {
        ...entityState,
        tracking: {
          ...entityState.tracking,
          isLoading: true
        }
      };

      const next = setNewState(featureName, stateName, state, newState);
      return next;
    }
    case EntityActionTypes.LoadAllFailure: {
      const newState: IEntityState<any> = {
        ...entityState,
        tracking: {
          ...entityState.tracking,
          isLoading: false
        }
      };

      const next = setNewState(featureName, stateName, state, newState);
      return next;
    }
    case EntityActionTypes.LoadAllSuccess: {
      const loadAllEntities = (action as LoadAllSuccess<any>).entities;
      const loadedIds = loadAllEntities.map(entity => safeGetKey(action, entity));

      const newDomain: DomainInfo = {
        domain: { start: 0, end: loadAllEntities.length },
        ids: loadedIds,
      };

      const newState: IEntityState<any> = {
        ...entityState,
        entities: mergeMany({}, loadAllEntities, action),
        ids: loadedIds,
        tracking: {
          ...entityState.tracking,
          isLoading: false,
          loadedAt: Date.now()
        },
        paging: {
          domains: [newDomain],
          totalPageableCount: loadAllEntities.length
        },
      };

      const next = setNewState(featureName, stateName, state, newState);
      return next;
    }
  }
};
