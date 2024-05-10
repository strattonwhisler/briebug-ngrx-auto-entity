import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EntityService } from '@briebug/ngrx-auto-entity-service';
import { Customer } from '../../models/customer.model';
import { CustomerFacade } from './customer.facade';

@NgModule({
  providers: [CustomerFacade, { provide: Customer, useClass: EntityService }]
})
export class CustomerStateModule {
  constructor(@Optional() @SkipSelf() parentModule: CustomerStateModule) {
    if (parentModule) {
      throw new Error('CustomerStateModule is already loaded. Import it in the StateModule only');
    }
  }
}
