import { IEntityState } from '@briebug/ngrx-auto-entity';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { accountReducer } from './account';
import { customerReducer, ICustomerState } from './customer';

export interface IAppState {
  account: IEntityState<Account>;
  customer: ICustomerState;
}

export type AppState = IAppState;

export const appReducer: ActionReducerMap<AppState> = {
  account: accountReducer,
  customer: customerReducer
};

export const appMetaReducers: Array<MetaReducer<AppState>> = !environment.production ? [] : [];
