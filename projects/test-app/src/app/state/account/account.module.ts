import { NgModule, Optional, SkipSelf } from '@angular/core';
import { Account } from '../../models/account.model';
import { EntityService } from '@briebug/ngrx-auto-entity-service';
import { AccountFacade } from './account.facade';

@NgModule({
  providers: [AccountFacade, { provide: Account, useClass: EntityService }]
})
export class AccountStateModule {
  constructor(@Optional() @SkipSelf() parentModule: AccountStateModule) {
    if (parentModule) {
      throw new Error('AccountStateModule is already loaded. Import it in the StateModule only');
    }
  }
}
