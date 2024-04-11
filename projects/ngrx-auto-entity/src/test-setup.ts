import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import * as jestExtendedMatchers from 'jest-extended';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

expect.extend(jestExtendedMatchers);
