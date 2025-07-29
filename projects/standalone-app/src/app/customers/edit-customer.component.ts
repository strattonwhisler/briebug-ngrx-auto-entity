import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CustomerFacade } from '../state/customer';
import { distinctUntilChanged, scan, shareReplay, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Customer } from '../models/customer.model';
import { TypedForm } from '../models/form.models';
import { Observable, OperatorFunction } from 'rxjs';

type CustomerForm = TypedForm<Omit<Customer, 'id'>>;

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="customerForm()" (ngSubmit)="submit()">
      <div class="form-actions">
        @if (customers.edited() != null) {
          <button type="submit" [disabled]="!customerForm().dirty">Save</button>
          <button type="button" (click)="cancel()">Cancel</button>
        } @else {
          <button type="button" (click)="edit()">Edit</button>
        }
      </div>

      <div class="form-group">
        <label for="isActive">Is Active</label>
        <input type="checkbox" id="isActive" formControlName="isActive" />
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" formControlName="name" />
      </div>
      <div class="form-group">
        <label for="catchPhrase">Catch Phrase</label>
        <input type="text" id="catchPhrase" formControlName="catchPhrase" />
      </div>
      <div style="display: grid; grid: 1fr 1fr / 1fr 1fr 1fr;" formGroupName="address">
        <div class="form-group" style="grid-column: 1 / span 3;">
          <label for="address-street1">Street 1</label>
          <input type="text" id="address-street1" formControlName="street1" />
        </div>
        <div class="form-group">
          <label for="address-city">City</label>
          <input type="text" id="address-city" formControlName="city" />
        </div>
        <div class="form-group">
          <label for="address-state">State</label>
          <input type="text" id="address-state" formControlName="state" />
        </div>
        <div class="form-group">
          <label for="address-zip">Zip</label>
          <input type="text" id="address-zip" formControlName="zip" />
        </div>
      </div>
    </form>
  `,
  styles: ``
})
export class EditCustomerComponent {
  protected readonly customers = inject(CustomerFacade);
  protected readonly fb = inject(FormBuilder);

  private customerForm$: Observable<CustomerForm> = this.customers.current$.pipe(
    distinctUntilChanged(),
    scan((form, value) => {
      if (form) {
        form.patchValue(value);
      } else {
        form = createCustomerForm(this.fb, value);
      }
      return form;
    }, null as CustomerForm),
    shareReplay(1)
  );

  protected customerForm = toSignal(this.customerForm$);

  constructor() {
    this.customerForm$.pipe(
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
      //TODO: Angular change is deeply partial while AE change is shallowly partial
    ).subscribe(change => this.customers.change(change as Partial<Customer>));
  }

  protected edit(): void {
    this.customerForm().enable();
    this.customers.edit(this.customers.current());
  }

  protected cancel(): void {
    this.customers.endEdit();
    //TODO: reset form
    this.customerForm().patchValue(this.customers.current());
    this.customerForm().disable();
  }

  protected submit(): void {
    this.customers.endEdit();
  }
}

function createCustomerForm (fb: FormBuilder, customer: Customer): CustomerForm {
  return fb.group({
    isActive: [customer?.isActive ?? true],
    name: [customer?.name ?? ''],
    catchPhrase: [customer?.catchPhrase ?? ''],
    address: fb.group({
      street1: [customer?.address?.street1 ?? ''],
      city: [customer?.address?.city ?? ''],
      state: [customer?.address?.state ?? ''],
      zip: [customer?.address?.zip ?? ''],
    })
  });
}
