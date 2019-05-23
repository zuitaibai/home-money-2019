import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ObjTpye } from '../../util/types';
import { map2Cn } from '../../util/local';
import { DateMethodService } from 'src/app/service/date-method.service';

@Component({
    selector: 'app-list-form',
    templateUrl: './list-form.component.html',
    styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit, AfterViewInit {

    pageCnName: string;

    pageObj: ObjTpye = {};
    qkSearchClass = '';

    @Input() routerPageType: string;
    @Input() inits: ObjTpye;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onFormChange: EventEmitter<ObjTpye> = new EventEmitter();

    // @ViewChild('form1') formDom: NgForm;
    // 此处原来在以下用：this.evFormSubmit(this.formDom)，结果由于@ViewChild会在父组件（本.ts）的钩子方法ngAfterViewInit调用之前赋值，
    // 而导致一系列问题如代码变动某ngModel时，视图经变更检查反应了变化，但在this.evFormSubmit时，
    // this.formDom早已被赋值（ngModel变动之前的值），还没有被有经过下一次变更检查，所以提交数据为上一次的变动

    // 此组件设置VSout1='all'等（包括reset）都是为了配合后台
    fmOpts = {
        VTname : '',
        VTdateSt : '',
        VTdateEd : '',
        VTdtype : '',
        VTother : '',
        VTpgSize : '',
        VSout1 : 'all',
        VSout2 : 'all',
        VSmember : 'all',
        VSmemberB : 'all',
        VSbank1 : 'all',
        VSbank2 : 'all',
        VSintype : 'all',
        VStype : 'all',
        VSdw : 'month'
    };

    constructor(private apiService: ApiService, private dateSv: DateMethodService) { }

    ngOnInit() {
        this.pageCnName = map2Cn(this.routerPageType);
        if (this.inits && Object.keys(this.inits).length > 0) {
            if (this.inits.date_sign_start) { this.fmOpts.VTdateSt = this.inits.date_sign_start; }
            if (this.inits.date_sign_end) { this.fmOpts.VTdateEd = this.inits.date_sign_end; }
            if (this.inits.tongjidw) { this.fmOpts.VSdw = this.inits.tongjidw; }
            if (this.inits.name) { this.fmOpts.VTname = this.inits.name; }
            if (this.inits.dtype) { this.fmOpts.VTdtype = this.inits.dtype; }
            if (this.inits.other) { this.fmOpts.VTother = this.inits.other; }
            if (this.inits.pageSize) { this.fmOpts.VTpgSize = this.inits.pageSize; }
            if (this.inits.type) { this.fmOpts.VStype = this.inits.type; }
        }
        if (this.routerPageType === 'listPay' || this.routerPageType === 'listCome') {
            this.apiService.getInitControlValue().subscribe((resData: ObjTpye) => {
                this.pageObj = { ...this.pageObj, ...resData };
                /* {
                    "outtype1Key": [ { "id": 1, "name": "食品酒水", "orderd": 1, "isOpen": 1 } ],
                    "bankTypeKey": [ { "id": 3, "name": "信用卡", "orderd": 2, "type": 0 } ],
                    "memberKey": [ { "id": 2, "name": "老公", "orderd": 1, "ifhome": 1 } ],
                    "for_from_memberKey": [ { "id": 18, "name": "同学", "orderd": 38, "ifhome": 0 } ]
                } */
                if (this.inits) {
                    if (this.inits.bankTypeKey) {
                        this.fmOpts.VSbank1 = this.inits.bankTypeKey;
                        this.evBankTypeKeyChange(this.inits.bankTypeKey, this.inits.bankKey || undefined);
                    }
                    if (this.inits.outtype1Key) {
                        this.fmOpts.VSout1 = this.inits.outtype1Key;
                        this.evOuttype1KeyChange(this.inits.outtype1Key, this.inits.outtype2Key || undefined);
                    }
                    if (this.inits.memberKey) { this.fmOpts.VSmember = this.inits.memberKey; }
                    if (this.inits.for_from_memberKey) { this.fmOpts.VSmemberB = this.inits.for_from_memberKey; }
                }
            });
        }
        if (this.routerPageType === 'listCome') {
            this.apiService.getIntypeKeyControlValue().subscribe((resData: ObjTpye) => {
                this.pageObj = { ...this.pageObj, ...resData };
                /* {"intypeKey":[ {"id":1,"name":"工资","orderd":1,"isOpen":1} ]}*/
                if (this.inits && this.inits.intypeKey) { this.fmOpts.VSintype = this.inits.intypeKey; }
            });
        }
    }

    ngAfterViewInit() {
        if (this.inits && this.inits.TRIGGER && Object.keys(this.inits).length > 1) {
            this.evFormSubmit();
        }
    }

    evOuttype1KeyChange(v: string|number, subInitSelect?: string|number|undefined) {
        this.fmOpts.VSout2 = 'all';
        if (v === 'all') {
            this.pageObj.outtype2Key = [];
            return;
        }
        this.apiService.getOut2Value(+v).subscribe(res => {
            this.pageObj.outtype2Key = res;
            if (subInitSelect) { this.fmOpts.VSout2 = '' + subInitSelect; }
        });
    }
    evBankTypeKeyChange(v: string|number, subInitSelect?: string|number|undefined) {
        this.fmOpts.VSbank2 = 'all';
        if (v === 'all') {
            this.pageObj.bankKey = [];
            return;
        }
        this.apiService.getMoney2Value(+v).subscribe(res => {
            this.pageObj.bankKey = res;
            if (subInitSelect) { this.fmOpts.VSbank2 = '' + subInitSelect; }
        });
    }
    evFormReset() {
        this.pageObj.bankKey = [];
        this.pageObj.outtype2Key = [];
        this.fmOpts.VTname
            = this.fmOpts.VTdateSt
            = this.fmOpts.VTdateEd
            = this.fmOpts.VTdtype
            = this.fmOpts.VTother
            = this.fmOpts.VTpgSize
            = '';
        this.fmOpts.VSout1
            = this.fmOpts.VSout2
            = this.fmOpts.VSmemberB
            = this.fmOpts.VSbank1
            = this.fmOpts.VSbank2
            = this.fmOpts.VSmember
            = this.fmOpts.VSintype
            = this.fmOpts.VStype
            = 'all';
        this.fmOpts.VSdw = 'month';
        // 统计列表页的重置需要保留this.inits数据
        if (this.inits && this.inits.TRIGGER && Object.keys(this.inits).length > 1) {
            if (this.inits.date_sign_start) { this.fmOpts.VTdateSt = this.inits.date_sign_start; }
            if (this.inits.date_sign_end) { this.fmOpts.VTdateEd = this.inits.date_sign_end; }
            if (this.inits.tongjidw) { this.fmOpts.VSdw = this.inits.tongjidw; }
        }
    }
    evFormSubmit() {
        const {
            VTname, VTdateSt, VTdateEd, VTdtype, VTother, VTpgSize, VSout1, VSout2,
            VSmember, VSmemberB, VSbank1, VSbank2, VSintype, VStype, VSdw
        } = { ...this.fmOpts };
        const pay = {
            name: VTname, date_sign_start: VTdateSt, date_sign_end: VTdateEd,
            outtype1Key: VSout1, outtype2Key: VSout2, for_from_memberKey: VSmemberB,
            bankTypeKey: VSbank1, bankKey: VSbank2, memberKey: VSmember, dtype: VTdtype, other: VTother, pageSize: VTpgSize
        };
        const come = {
            name: VTname, date_sign_start: VTdateSt, date_sign_end: VTdateEd, intypeKey: VSintype, bankTypeKey: VSbank1,
            bankKey: VSbank2, memberKey: VSmember, dtype: VTdtype, other: VTother, pageSize: VTpgSize
        };
        const acco = {
            name: VTname, date_sign_start: VTdateSt, date_sign_end: VTdateEd,
            type: VStype, dtype: VTdtype, other: VTother, pageSize: VTpgSize
        };
        const stat = { date_sign_start: VTdateSt, date_sign_end: VTdateEd, tongjidw: VSdw, pageSize: VTpgSize };
        function delPropEmptyValue() { // 过滤空参数，for后台
            for (const m of Object.keys(this)) {
                if (this[m] === '') { delete this[m]; }
            }
        }
        delPropEmptyValue.call(pay);
        delPropEmptyValue.call(come);
        delPropEmptyValue.call(acco);
        delPropEmptyValue.call(stat);
        this.onFormChange.emit({listAccounts: acco,  listStatistics: stat, listPay: pay, listCome: come}[this.routerPageType]);
    }
    evQuickSubmit(str: string) {
        this.qkSearchClass = str;
        let arr: ['', ''];
        const startEnd: ObjTpye = this.dateSv.dStartEnd().fmt;
        switch (str) {
            case '-year': arr = startEnd.yearLast; break;
            case 'year': arr = startEnd.year; break;
            case 'quarter': arr = startEnd.quarter; break;
            case 'month': arr = startEnd.month; break;
            case '-month': arr = startEnd.monthLast; break;
            case 'week': arr = startEnd.week; break;
            case '-day': arr = startEnd.dayLast; break;
            case 'day': arr = startEnd.day; break;
        }
        if (Array.isArray(arr) && arr.length === 2) {
            this.fmOpts.VTdateSt = arr[0];
            this.fmOpts.VTdateEd = arr[1];
            this.evFormSubmit();
        }
    }

}
