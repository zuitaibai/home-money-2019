import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CacheInterceptor } from './cache-interceptors';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
];
