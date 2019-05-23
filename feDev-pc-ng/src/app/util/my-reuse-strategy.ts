import {RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class MyReuseStrategy implements RouteReuseStrategy {

    public cacheRouters: { [key: string]: any } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.routeConfig && route.routeConfig.data && route.routeConfig.data.reuse;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.cacheRouters[route.routeConfig.path] = {
            snapshot: route,
            handle
        };
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && !!this.cacheRouters[route.routeConfig.path];
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (route.routeConfig && route.routeConfig.path && this.cacheRouters[route.routeConfig.path]) {
            return this.cacheRouters[route.routeConfig.path].handle;
        }
        return null;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return (!!curr.routeConfig) && future.routeConfig === curr.routeConfig;
    }
}
