import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Account } from '../../models/account.model';
import { AccountFacadeBase, allAccountsForCurrentCustomer } from './account.state';
import { AppState } from '../app.state';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class AccountFacade extends AccountFacadeBase {
  readonly currentForCurrentCustomer$ = this.store.select(allAccountsForCurrentCustomer);
  readonly currentForCurrentCustomer = toSignal(this.currentForCurrentCustomer$);
}
