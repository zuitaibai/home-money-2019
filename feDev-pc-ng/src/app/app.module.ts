import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';
import { AngularDraggableModule } from 'angular2-draggable';

import { RequestCache, RequestCacheWithMap } from './service/http-interceptors/request-cache.service';
import { httpInterceptorProviders } from './service/http-interceptors/index';
import { RouteGuardService } from './service/route-guard.service';

import { ListFormComponent } from './layout/list-form/list-form.component';
import { NavComponent } from './layout/nav/nav.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { IndexComponent } from './pages/index/index.component';
import { PagingDomComponent } from './layout/paging-dom/paging-dom.component';
import { ListTableComponent } from './layout/list-table/list-table.component';
import { ListPayComponent } from './pages/list-pay/list-pay.component';
import { EditPayComeComponent } from './pages/edit-pay-come/edit-pay-come.component';
import { EditAccountsComponent } from './pages/edit-accounts/edit-accounts.component';
import { ListComeComponent } from './pages/list-come/list-come.component';
import { ListAccountsComponent } from './pages/list-accounts/list-accounts.component';
import { ListStatisticsComponent } from './pages/list-statistics/list-statistics.component';
import { ModalComponent } from './layout/modal/modal.component';
import { PagingDataComponent } from './layout/paging-data/paging-data.component';
import { Remove0ValItemsPipe } from './util/remove-0-val-items.pipe';
import { StatisticsPopInnerComponent } from './layout/statistics-pop-inner/statistics-pop-inner.component';
import { CardsComponent } from './pages/cards/cards.component';
import { NotesComponent } from './pages/notes/notes.component';
import { AddPayComeComponent } from './pages/add-pay-come/add-pay-come.component';
import { AddAccountsComponent } from './pages/add-accounts/add-accounts.component';
import { PayComeFormComponent } from './layout/actform/pay-come-form/pay-come-form.component';
import { AccountsFormComponent } from './layout/actform/accounts-form/accounts-form.component';
import { MemberTypeComponent } from './layout/actform/layout/member-type/member-type.component';
import { DateCtrComponent } from './layout/actform/layout/date-ctr/date-ctr.component';
import { MoneyType1Component } from './layout/actform/layout/money-type1/money-type1.component';
import { MoneyType2Component } from './layout/actform/layout/money-type2/money-type2.component';
import { MyReuseStrategy } from './util/my-reuse-strategy';
import { RouteReuseStrategy } from '@angular/router';
import { EditTypeComponent } from './pages/edit-type/edit-type.component';
import { DbComponent } from './pages/db/db.component';
import { ForbiddenValidatorDirective } from './layout/actform/validators/forbidden.directive';
import { CalculatorComponent } from './layout/calculator/calculator.component';
import { CheckboxGroupComponent } from './layout/actform/layout/checkbox-group/checkbox-group.component';
import { TryCtrGroupComponent } from './layout/actform/try-ctr-group/try-ctr-group.component';
import { RadiobtnGroupComponent } from './layout/actform/layout/radiobtn-group/radiobtn-group.component';
import { listTableInnerModalComponent } from './layout/list-table-inner-modal/list-table-inner-modal.component';
import { HtmlPipe } from './util/innerhtmlpipe';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavComponent,
        ListFormComponent,
        IndexComponent,
        PagingDomComponent,
        ListTableComponent,
        ListPayComponent,
        EditPayComeComponent,
        EditAccountsComponent,
        ListComeComponent,
        ModalComponent,
        PagingDataComponent,
        ListAccountsComponent,
        ListStatisticsComponent,
        Remove0ValItemsPipe,
        StatisticsPopInnerComponent,
        CardsComponent,
        NotesComponent,
        AddPayComeComponent,
        AddAccountsComponent,
        PayComeFormComponent,
        AccountsFormComponent,
        MemberTypeComponent,
        DateCtrComponent,
        MoneyType1Component,
        MoneyType2Component,
        EditTypeComponent,
        DbComponent,
        LoginComponent,
        ForbiddenValidatorDirective,
        CalculatorComponent,
        CheckboxGroupComponent,
        TryCtrGroupComponent,
        RadiobtnGroupComponent,
        listTableInnerModalComponent,
        HtmlPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        NgxEchartsModule,
        AngularDraggableModule
    ],
    providers: [
        RouteGuardService,
        // { provide: RouteReuseStrategy, useClass: MyReuseStrategy },
        { provide: RequestCache, useClass: RequestCacheWithMap },
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
