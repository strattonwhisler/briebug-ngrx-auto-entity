import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { Customer } from '../../models/customer.model';
import { AppState } from '../app.state';
import { CustomerFacadeBase } from './customer.state';

@Injectable()
export class CustomerFacade extends CustomerFacadeBase {
  readonly currentKey = toSignal(this.currentKey$);

  constructor(store: Store<AppState>) {
    super(Customer, store);
  }
}
