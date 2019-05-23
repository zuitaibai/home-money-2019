import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { IndexComponent } from './pages/index/index.component';
import { ListPayComponent } from './pages/list-pay/list-pay.component';
import { ListComeComponent } from './pages/list-come/list-come.component';
import { ListAccountsComponent } from './pages/list-accounts/list-accounts.component';
import { EditPayComeComponent } from './pages/edit-pay-come/edit-pay-come.component';
import { EditAccountsComponent } from './pages/edit-accounts/edit-accounts.component';
import { ListStatisticsComponent } from './pages/list-statistics/list-statistics.component';
import { CardsComponent } from './pages/cards/cards.component';
import { AddPayComeComponent } from './pages/add-pay-come/add-pay-come.component';
import { AddAccountsComponent } from './pages/add-accounts/add-accounts.component';
import { EditTypeComponent } from './pages/edit-type/edit-type.component';
import { DbComponent } from './pages/db/db.component';

import { RouteGuardService } from './service/route-guard.service';

const tit = '家庭账目管理系统';
const routes: Routes = [
    /* 对于列表页，在跳入编辑页再返回时，查询状态和分页状态不能保留，为这一个功能采取路由复用策略感觉有些绕路
        // @http://www.cnblogs.com/lslgg/p/7700888.html
        // 路由复用策略已禁用。(app.module.ts的providers中)
        // 目前问题：非详情页跳入列表页时，列表页上次状态还在保留（经使用，体验太差，路由复用策略考虑放弃，或更改之更科学）
        // 在app.component中的NavigationEnd中，当非是详情页时，删除my-reuse-strategy.ts中的cacheRouters的对应键快照
        // 可以在以下加入data识别配合
    */
   /*
    以上问题，目前已用sessionStorage解决，但还是感觉有些绕路
   */
    { path: '', component: HomeComponent, children: [
        { path: '', redirectTo: '/index', pathMatch: 'full' },
        {
            path: 'index',
            component: IndexComponent,
            data: {title: `${tit}`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listPay',
            component: ListPayComponent,
            data: {reuse: true, title: `${tit}-支出列表`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listPay/edit/:id',
            component: EditPayComeComponent,
            data: {type: 'pay', title: `${tit}-支出列表-编辑`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listCome',
            component: ListComeComponent,
            data: {reuse: true, title: `${tit}-收入列表`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listCome/edit/:id',
            component: EditPayComeComponent,
            data: {type: 'come', title: `${tit}-收入列表-编辑`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listAccounts',
            component: ListAccountsComponent,
            data: {reuse: true, title: `${tit}-帐目列表`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listAccounts/edit/:id',
            component: EditAccountsComponent,
            data: { title: `${tit}-帐目列表-编辑`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'listStatistics',
            component: ListStatisticsComponent,
            data: { title: `${tit}-统计列表`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'cards',
            component: CardsComponent,
            data: { title: `${tit}-卡面管理`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'addPayCome',
            component: AddPayComeComponent,
            data: { title: `${tit}-新建收支`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'addAccounts',
            component: AddAccountsComponent,
            data: { title: `${tit}-新建帐目`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'editType',
            component: EditTypeComponent,
            data: { title: `${tit}-类目编辑`},
            canActivate: [RouteGuardService]
        },
        {
            path: 'db',
            component: DbComponent,
            data: { title: `${tit}-数据库操作`},
            canActivate: [RouteGuardService]
        }
    ]},
    { path: 'login', component: LoginComponent, data: {title: `${tit}-登录`} },
    // { path: '**', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/index' } // 注掉for:debug server：当是生产环境下时，注掉这句以检测不存在路由是否404状态，
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
