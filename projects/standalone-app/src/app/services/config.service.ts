import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable()
export class ConfigService {
  url = Promise.resolve(environment.API_BASE_URL);
}
