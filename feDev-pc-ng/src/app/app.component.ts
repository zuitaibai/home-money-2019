import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap} from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title
    ) {}

    ngOnInit() {
        /*
            // for: 当非是详情页时，删除my-reuse-strategy.ts中的cacheRouters的对应键快照
            // 当前路由复用策略方式已取消使用
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd)
            ).subscribe((event) => );
        */

        // 设置页面title
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data)
        ).subscribe((event) => {
            this.titleService.setTitle(event.title);
        });
    }

}
