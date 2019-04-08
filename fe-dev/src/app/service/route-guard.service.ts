import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { CheckLoginService } from './check-login.service';
import { ApiService } from '../service/api.service';
@Injectable()
export class RouteGuardService implements CanActivate {

    constructor(
        private router: Router,
        // private loginSv: CheckLoginService,
        private apiServ: ApiService
    ) { }

    /* canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.loginSv.getUser('login')) {
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    } */
    // 异步守卫
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.apiServ.checkLogin().toPromise()
            .then((res: {[key: string]: any}) => {
                if (!res.login) { this.router.navigate(['/login']); }
                return res.login;
            })
            .catch(() => {
                this.router.navigate(['/login']);
                return false;
            });
    }
}
