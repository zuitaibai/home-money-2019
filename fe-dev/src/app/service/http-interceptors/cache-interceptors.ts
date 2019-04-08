import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { RequestCache } from './request-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCache) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!isCachable(req)) { return next.handle(req); }
        const cachedResponse = this.cache.get(req);
        if (req.headers.get('x-refresh')) {
            const results$ = sendRequest(req, next, this.cache);
            return cachedResponse ? results$.pipe(startWith(cachedResponse)) : results$;
        }
        return cachedResponse ? of(cachedResponse) : sendRequest(req, next, this.cache);
    }
}
function isCachable(req: HttpRequest<any>) {
    return req.method === 'GET' && -1 < req.url.indexOf('api/') && req.headers.get('mycache') !== 'no';
}
function sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                cache.put(req, event);
            }
        })
    );
}

