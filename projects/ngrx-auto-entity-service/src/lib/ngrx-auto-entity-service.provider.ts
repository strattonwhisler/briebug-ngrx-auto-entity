import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AUTO_ENTITY_CONFIG, AutoEntityServiceConfig, DynamicAutoEntityServiceConfig } from './config';
import { EntityService } from './entity.service';

/** @internal */
export function _provideAutoEntityService(config: AutoEntityServiceConfig | DynamicAutoEntityServiceConfig, deps?: any[]): Provider[] {
  return [
    EntityService,
    createConfigProvider(config, deps)
  ];
}

/**
 * Sets up providers for the auto-entity entity service.
 *
 * @usageNotes
 *
 * ### Providing Auto-Entity Service
 *
 * Basic example of using the Auto-Entity Entity Service with your entities:
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     // …
 *     provideAutoEntityService({
 *       urlPrefix: 'https://example.com/api'
 *     }),
 *   ]
 * });
 * ```
 *
 * ### Dynamic configuration
 *
 * You can also provide the Auto-Entity Entity Service configuration dynamically:
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     // …
 *     provideAutoEntityService(() => {
 *       const configService = inject(ConfigService);
 *       return {
 *         urlPrefix: configService.apiBaseUrl
 *       }
 *     })
 *   ]
 * });
 * ```
 *
 * @publicApi
 * @param config An Auto-Entity Entity Service configuration object or a factory function that returns an Auto-Entity Entity Service configuration object.
 * @param deps A list of dependencies to inject into the factory function.
 * @returns A set of providers to set up an Auto-Entity Service.
 */
export function provideAutoEntityService(config: AutoEntityServiceConfig | DynamicAutoEntityServiceConfig, deps?: any[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(HttpClientModule),
    ..._provideAutoEntityService(config, deps)
  ]);
}

const createConfigProvider = (config: AutoEntityServiceConfig | DynamicAutoEntityServiceConfig, deps?: any[]): Provider =>
  typeof config === 'function'
    ? {
      provide: AUTO_ENTITY_CONFIG,
      useFactory: config,
      deps
    }
    : { provide: AUTO_ENTITY_CONFIG, useValue: config };
