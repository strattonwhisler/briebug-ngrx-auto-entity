import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Customer } from '../../models/customer.model';
import { AppState } from '../app.state';
import { CustomerFacadeBase } from './customer.state';

@Injectable()
export class CustomerFacade extends CustomerFacadeBase {
  constructor(store: Store<AppState>) {
    super(Customer, store);
  }
}
