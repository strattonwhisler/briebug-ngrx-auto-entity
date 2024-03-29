import { buildState, IEntityState } from '@briebug/ngrx-auto-entity';
import { Action } from '@ngrx/store';
import { Account } from '../models/account.model';

export const ACCOUNT_STATE_NAME = 'account';

export const {
  initialState,
  facade: AccountFacadeBase,
  selectors: { selectAllSorted: allAccounts },
  actions: {
    loadMany: manyAccountsLoading,
    loadManySuccess: manyAccountsLoadedSuccessfully,
    editByKey: accountEditedById,
    endEdit: accountEditEnded
  }
} = buildState(Account);

export function accountReducer(state = initialState, action: Action): IEntityState<Account> {
  return state;
}
