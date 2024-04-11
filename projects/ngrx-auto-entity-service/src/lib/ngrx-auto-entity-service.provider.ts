import { APP_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTO_ENTITY_CONFIG, AutoEntityServiceConfig } from './config';
import { EntityService } from './entity.service';
import { noop } from 'rxjs';

/** @internal */
export function _provideAutoEntityService(config: AutoEntityServiceConfig | (() => AutoEntityServiceConfig)): Provider[] {
  return [
    EntityService,
    typeof config === 'function'
      ? { provide: AUTO_ENTITY_CONFIG, useFactory: config }
      : { provide: AUTO_ENTITY_CONFIG, useValue: config }
  ];
}

export function _assertHttpClientProvided(): () => void {
  const http = inject(HttpClient, { optional: true });
  if (http == null) {
    console.error("[NGRX-AES] ! No provider for HttpClient. Make sure `provideHttpClient()` is included in you application's providers.");
  }
  return noop;
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
 * @param config An Auto-Entity Entity Service configuration object or a function that returns an Auto-Entity Entity Service configuration object.
 * @returns A set of providers to set up an Auto-Entity Service.
 */
export function provideAutoEntityService(config: AutoEntityServiceConfig | (() => AutoEntityServiceConfig)): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: _assertHttpClientProvided,
      multi: true,
    },
    ..._provideAutoEntityService(config)
  ]);
}
