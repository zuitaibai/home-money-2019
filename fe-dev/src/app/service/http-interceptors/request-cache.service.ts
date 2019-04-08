import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
export interface RequestCacheEntry {
    url: string;
    response: HttpResponse<any>;
    lastRead: number;
}
export abstract class RequestCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
    abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
}
const maxAge = 1000 * 60;
@Injectable()
export class RequestCacheWithMap implements RequestCache {
    cache = new Map<string, RequestCacheEntry>();
    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = req.urlWithParams;
        const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }
        const isExpired = cached.lastRead < (Date.now() - maxAge);
        return isExpired ? undefined : cached.response;
    }
    put(req: HttpRequest<any>, response: HttpResponse<any>): void {
        const url = req.urlWithParams;
        const val = { url, response, lastRead: Date.now() };
        this.cache.set(url, val);
        const expired = Date.now() - maxAge;
        this.cache.forEach(entry => {
            if (entry.lastRead < expired) {
                this.cache.delete(entry.url);
            }
        });
    }
}
