import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityIdentity } from '@briebug/ngrx-auto-entity';
import { Customer } from '../models/customer.model';
import { trackById } from '../app.utils';


@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html'
})
export class CustomerTableComponent {
  protected readonly trackById = trackById;

  @Input({ required: true }) customers: Customer[];

  @Output()
  readonly view = new EventEmitter<EntityIdentity>();
}
