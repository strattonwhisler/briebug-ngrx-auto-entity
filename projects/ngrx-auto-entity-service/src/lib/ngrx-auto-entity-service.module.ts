import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AutoEntityServiceConfig, DynamicAutoEntityServiceConfig } from './config';
import { _provideAutoEntityService } from './ngrx-auto-entity-service.provider';

@NgModule({
  imports: [HttpClientModule]
})
export class NgrxAutoEntityServiceModule {
  static forRoot(config: DynamicAutoEntityServiceConfig, deps?: any[]): ModuleWithProviders<NgrxAutoEntityServiceModule>;
  static forRoot(config: AutoEntityServiceConfig): ModuleWithProviders<NgrxAutoEntityServiceModule>;
  static forRoot(
    config: AutoEntityServiceConfig | DynamicAutoEntityServiceConfig,
    deps?: any[],
  ): ModuleWithProviders<NgrxAutoEntityServiceModule> {
    return {
      ngModule: NgrxAutoEntityServiceModule,
      providers: [..._provideAutoEntityService(config, deps)],
    };
  }
}

