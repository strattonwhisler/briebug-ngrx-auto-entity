import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgForOf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, scan, share } from 'rxjs/operators';
import { AccountFacade } from './state/account';
import { CustomerFacade } from './state/customer';
import { CustomerTableComponent } from './customers/customer-table.component';
import { AccountTableComponent } from './accounts/account-table';
import { Customer } from './models/customer.model';

class CustomerForm extends FormGroup {
  constructor(model?: Partial<Customer>) {
    super({
      isActive: new FormControl(model?.isActive ?? true, { nonNullable: true }),
      name: new FormControl(model?.name ?? '', { nonNullable: true }),
      catchPhrase: new FormControl(model?.catchPhrase ?? '', { nonNullable: true }),
      address: new FormGroup({
        street1: new FormControl(model?.address?.street1 ?? '', { nonNullable: true }),
        city: new FormControl(model?.address?.city ?? '', { nonNullable: true }),
        state: new FormControl(model?.address?.state ?? '', { nonNullable: true }),
        zip: new FormControl(model?.address?.zip ?? '', { nonNullable: true })
      })
    });
  }
}

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

  private customerForm$ = this.customers.edited$.pipe(
    distinctUntilChanged(),
    scan((form, customer) => {
      if (form) {
        form.patchValue(customer);
        return form;
      } else {
        return new CustomerForm(customer);
      }
    }, null as CustomerForm),
    share(),
  );

  protected customerForm = toSignal(this.customerForm$);

  constructor() {
    this.customers.loadManyIfNecessary();

    // this.customerForm$.pipe(
    //   switchMap(form => form.valueChanges),
    //   takeUntilDestroyed()
    // ).subscribe(changes => this.customers.change(changes as Customer));
  }
}
