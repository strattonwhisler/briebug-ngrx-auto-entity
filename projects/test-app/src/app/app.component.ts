import { Component } from '@angular/core';
import { CustomerFacade } from './state/customer';
import { AccountFacade } from './state/account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(protected customers: CustomerFacade, protected accounts: AccountFacade) {
    this.customers.loadManyIfNecessary();
  }
}
