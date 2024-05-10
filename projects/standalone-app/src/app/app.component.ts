import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AccountFacade } from './state/account';
import { CustomerFacade } from './state/customer';
import { CustomerTableComponent } from './customers/customer-table.component';
import { AccountTableComponent } from './accounts/account-table';
import { EditCustomerComponent } from './customers/edit-customer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    NgForOf,
    RouterLink,
    CustomerTableComponent,
    AccountTableComponent,
    ReactiveFormsModule,
    EditCustomerComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  protected readonly customers = inject(CustomerFacade);
  protected readonly accounts = inject(AccountFacade);

  constructor() {
    this.customers.loadManyIfNecessary();
  }
}
