import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { ProductFacadeBase } from './product.state';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductFacade extends ProductFacadeBase {
  constructor(private store: Store<AppState>) {
    super(Product, store);
  }
}
