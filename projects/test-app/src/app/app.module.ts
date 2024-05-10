import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FeatureModule } from './state/feature/feature.module';
import { StateModule } from './state/state.module';
import { ConfigService } from './services/config.service';
import { CustomerModule } from './customers/customer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot([]),
    StateModule.forRoot(),
    FeatureModule,
    CustomerModule
  ],
  providers: [
    ConfigService,
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
