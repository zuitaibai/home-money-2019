import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ModalService } from '../../service/modal.service';
import { ObjTpye } from '../../util/types';
import { defPageSize } from '../../util/local';
import { ApiService } from '../../service/api.service';
import { DateMethodService } from '../../service/date-method.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

interface PDataItface {
    listArr: {[key: string]: any}[];
    page: {[key: string]: any};
    total: {[key: string]: any};
}

@Component({
    selector: 'app-list-statistics',
    templateUrl: './list-statistics.component.html',
    styleUrls: ['./list-statistics.component.css']
})
export class ListStatisticsComponent implements OnInit, OnDestroy {

    th1Name = '月';
    pageData: PDataItface = {
        listArr: [],
        page: {},
        total: {}
    };

    formInits: ObjTpye;

    routerPageType = 'listStatistics';

    storePageOptions: ObjTpye = {
        currentPage: 1,
        pageSize: defPageSize
    };

    subscript: Subscription;
    constructor(
        private apiService: ApiService,
        private modalSer: ModalService,
        private dateSv: DateMethodService,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.fds.clearAll();

        const dates = new Date(new Date().getFullYear(), 0, 1);
        this.formInits = {
            date_sign_start: this.dateSv.format(dates),
            date_sign_end: this.dateSv.format(new Date()),
            tongjidw: 'month',
            TRIGGER: true
        };
        // form赋值变动发emit触发: TRIGGER: onFormChange
        // this.requestForList();
    }
    ngOnDestroy() {
        this.modalSer.eventEmit.emit({ modalIfShow: 'no' });
        if (this.subscript) { this.subscript.unsubscribe(); }
    }

    requestForList() {
        this.apiService.getListStatistics(this.storePageOptions).subscribe(resResult => {
            resResult.listArr.forEach((v: {[key: string]: any}) => {
                const date = new Date(v.date);
                // v.datefmt = [ date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2) ].join(' - ');
                v.datefmt = v.date.replace(/-/g, ' - ');
            });
            this.pageData = resResult;
        });
    }

    onPagingChange(page: number) {
        this.storePageOptions.currentPage = page;
        this.requestForList();
    }
    onFormChange(obj: ObjTpye) {
        if (!obj.pageSize) {
            obj.pageSize = defPageSize;
        }
        this.storePageOptions = {
            ...obj,
            currentPage: 1
        };
        if (obj.tongjidw === 'month') {
            this.th1Name = '月';
        } else if (obj.tongjidw === 'year') {
            this.th1Name = '年';
        } else if (obj.tongjidw === 'day') {
            this.th1Name = '日';
        }
        this.requestForList();
    }
    evClickDetail(type: string, date: string, money: number) {
        let subscb: Observable<any>;
        const titinner = `： [${date}] ¥<span class="bold">${money}</span>`;
        let tit = '';
        if (type === 'come') {
            tit = '收入' + titinner + ' （生意利润不包含在收入总数里）';
            subscb = this.apiService.getStatisticsPopCome(date);
        } else if (type === 'pay') {
            tit = '支出' + titinner + ' （生意亏损不包含在支出总数里）';
            subscb = this.apiService.getStatisticsPopPay(date);
        } else if (type === 'resumm') {
            tit = '账户差额' + titinner;
            subscb = this.apiService.getStatisticsPopResumm(date);
        } else if (type === 'resum') {
            tit = '余额' + titinner;
            subscb = this.apiService.getStatisticsPopResum(date);
        }
        this.modalSer.eventEmit.emit({
            modalSize: 'small',
            modalTit: tit,
            modalOverlay: 'no',
            modalIfShow: 'yes',
            modalInner: 'loading',
            modalCompName: type
        });
        this.subscript = subscb.subscribe(res => {
            this.modalSer.eventEmit.emit({
                modalSize: 'small',
                modalTit: tit,
                modalOverlay: 'no',
                modalIfShow: 'yes',
                modalInner: '',
                modalCompName: type,
                modalData: res,
                modalOtherData: {totalUnlawful: money},
                onClose: (arg: any) => { }
            });
        });
    }
}
