import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Store } from '@ngrx/store';
import { manyAccountsLoading } from './state/account.state';
import { customerEditedById, customerEditEnded, manyCustomersLoadingIfNecessary } from './state/customer.state';
import { CustomerTableComponent } from './customers/customer-table.component';
import { CustomerFacade } from './state/customer.facade';
import { AccountFacade } from './state/account.facade';
import { AccountTableComponent } from './accounts/account-table';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from './models/customer.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgForOf, RouterLink, CustomerTableComponent, AccountTableComponent, ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  protected readonly customers = inject(CustomerFacade);
  protected readonly accounts = inject(AccountFacade);

  protected readonly store = inject(Store);

  protected fb = inject(FormBuilder);

  // protected customerForm = new FormGroup({
  //   isActive: new FormControl(true, { nonNullable: true }),
  //   name: new FormControl('', { nonNullable: true }),
  //   catchPhrase: new FormControl('', { nonNullable: true }),
  //   address: new FormGroup({
  //     street1: new FormControl('', { nonNullable: true }),
  //     city: new FormControl('', { nonNullable: true }),
  //     state: new FormControl('', { nonNullable: true }),
  //     zip: new FormControl('', { nonNullable: true })
  //   })
  // });

  protected customerForm = this.fb.nonNullable.group({
    isActive: [true],
    name: [''],
    catchPhrase: [''],
    address: this.fb.nonNullable.group({
      street1: [''],
      city: [''],
      state: [''],
      zip: ['']
    })
  });

  constructor() {
    // accounts.loadAll();
    // customers.loadMany();

    this.store.dispatch(manyAccountsLoading());
    this.store.dispatch(manyCustomersLoadingIfNecessary());
    setTimeout(() => this.store.dispatch(manyCustomersLoadingIfNecessary()), 2000);

    this.customerForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(changes => this.customers.change(changes as Customer));

    // setTimeout(() => customers.clear(), 3000);
    //
    // setTimeout(() => {
    //   accounts.current$
    //     .pipe(
    //       first(current => !!current),
    //       distinctUntilChanged()
    //     )
    //     .subscribe(current => accounts.update(current));
    //   accounts.selectByKey(1);
    // }, 3000);
    //
    // setInterval(() => {
    //   const id1 = 1; // Math.round(Math.random() * 100 + Math.random() * 20);
    //   accounts.all$
    //     .pipe(
    //       map(accts => accts.find(account => account.id === id1)),
    //       first()
    //     )
    //     .subscribe(account =>
    //       accounts.replace({
    //         ...account,
    //         amount: Math.random() * 1000
    //       })
    //     );
    //
    //   const id2 = 10; // Math.round(Math.random() * 100 + Math.random() * 20);
    //   accounts.all$
    //     .pipe(
    //       map(accts => accts.find(account => account.id === id2)),
    //       first()
    //     )
    //     .subscribe(account =>
    //       accounts.replace({
    //         ...account,
    //         amount: Math.random() * 1000
    //       })
    //     );
    //
    //   const id3 = 100; // Math.round(Math.random() * 100 + Math.random() * 20);
    //   accounts.all$
    //     .pipe(
    //       map(accts => accts.find(account => account.id === id3)),
    //       first()
    //     )
    //     .subscribe(account =>
    //       accounts.replace({
    //         ...account,
    //         amount: Math.random() * 1000
    //       })
    //     );
    //
    //   const id4 = Math.round(Math.random() * 100 + Math.random() * 20);
    //   accounts.all$
    //     .pipe(
    //       map(accts => accts.find(account => account.id === id4)),
    //       first()
    //     )
    //     .subscribe(account =>
    //       accounts.replace({
    //         ...account,
    //         amount: Math.random() * 1000
    //       })
    //     );
    // }, 250);
  }

  editByKey(id: number) {
    this.store.dispatch(customerEditedById({ key: id }));
  }

  endEdit() {
    this.store.dispatch(customerEditEnded());
  }
}
