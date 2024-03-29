import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Store } from '@ngrx/store';
import { trackById } from '../app.utils';
import { allProducts, manyProductsLoadingIfNecessary, productEditedById, productEditEnded } from './state/product/product.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgForOf],
  template: `
    <h1>Products</h1>

    <button (click)="editByKey(1)">Edit</button>
    <button (click)="endEdit()">End Edit</button>

    <ul>
      @for (product of allProducts$ | async; track byId) {
        <li>{{product.name}}</li>
      }
    </ul>
  `
})
export class FeatureComponent {
  protected readonly byId = trackById;

  protected readonly store = inject(Store);

  allProducts$ = this.store.select(allProducts);

  constructor() {
    this.store.dispatch(manyProductsLoadingIfNecessary());
    setTimeout(() => this.store.dispatch(manyProductsLoadingIfNecessary()), 2000);
  }

  editByKey(id: number) {
    this.store.dispatch(productEditedById({ key: id }));
  }

  endEdit() {
    this.store.dispatch(productEditEnded());
  }
}
