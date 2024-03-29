import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Account } from '../../models/account.model';
import { AccountFacadeBase, allAccountsForCurrentCustomer } from './account.state';
import { AppState } from '../app.state';

@Injectable()
export class AccountFacade extends AccountFacadeBase {
  readonly currentForCurrentCustomer$ = this.store.select(allAccountsForCurrentCustomer);

  constructor(private store: Store<AppState>) {
    super(Account, store);
  }
}
