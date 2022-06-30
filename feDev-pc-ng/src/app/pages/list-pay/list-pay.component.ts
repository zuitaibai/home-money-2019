import { Component, OnInit } from '@angular/core';

import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';
import { defPageSize } from '../../util/local';
import { ModalService } from '../../service/modal.service';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-list-pay',
    templateUrl: './list-pay.component.html',
    styleUrls: ['./list-pay.component.css']
})
export class ListPayComponent implements OnInit {

    columns: ThObjType[];
    dataSource: TdObjType[][];
    pageNums: PageNumsType;
    thisPageTotal = '';
    formInits: ObjTpye;
    doSearchFlag = false;

    routerPageType = 'listPay';

    storePageOptions: ObjTpye = {
        currentPage: 1,
        pageSize: defPageSize
    };

    constructor(
        private apiService: ApiService,
        private modalSer: ModalService,
        private fds: ForDetailBackSessionMngService
    ) { }

    ngOnInit() {

        this.columns = [
            { text: '日期', key: 0, attrs: { width: 90 } },
            { text: '金额', key: 1, classes: {} },
            { text: '名称', key: 2 },
            { text: '消费对象', key: 3 },
            { text: '类别', key: 4 },
            { text: '币种', key: 5 },
            { text: '支出账户', key: 6 },
            { text: '自分类', key: 7 },
            { text: '操作', key: 8 },
            { text: '', key: 9, isSelectAll: true, styles: {cursor: 'pointer', padding: 0, background: '#fff'}, attrs: { width: 20, valign: 'bottom', title: '全选/反选' } }
        ];
        const obj = this.fds.makeListSearchParams(this.routerPageType);
        if (obj) {
            this.storePageOptions = obj;
            this.formInits = obj; // 更新列表页表单组件中的各控件
        }
        this.requestForList();
    }

    requestForList() {
        this.apiService.getListPay(this.storePageOptions).subscribe((resData: ObjTpye) => {
            let dayTotal = 0;
            let pageTotal = 0;
            let ifADayLastOne = false;
            const arrLength = resData.list.length;
            this.dataSource = resData.list.map( (item: ObjTpye, index: number) => {
                pageTotal += item.money;
                if (arrLength === 1) {
                    dayTotal = item.money;
                    ifADayLastOne = true;
                } else {
                    if ( ifADayLastOne || index === 0 ) {
                        dayTotal = item.money;
                        ifADayLastOne = false;
                    }
                    if (index + 1 <= arrLength - 1) { // index+1: next Item
                        if (resData.list[index + 1].date_sign === item.date_sign) {
                            dayTotal += resData.list[index + 1].money;
                        } else {
                            ifADayLastOne = true;
                        }
                    } else { // is the arr's last item
                        if (resData.list[arrLength - 2].date_sign !== item.date_sign) {
                            dayTotal = item.money;
                        }
                        ifADayLastOne = true;
                    }
                }
                const re: ObjTpye[] = [
                    // 日期
                    { text: item.date_sign, id: item.id, for_oth: item.other, for_addtime: item.date_dbCreate, for_inwho: item.actOn_memberKey, classes: { tc: true, 'bd-btm-dark': ifADayLastOne }, styles: {textAlign: 'right', position: 'relative'}, attrs: { title: `添加时间：${item.date_dbCreate}`}},
                    // 金额
                    { text: item.money, classes: { red: true, b: true, 'bd-btm-dark': ifADayLastOne } },
                    // 名称
                    { text: item.name, classes: { 'bd-btm-dark': ifADayLastOne }, styles: { 'font-weight': 'bold' }, attrs: { title: item.other ? '备注：' + item.other : '' } },
                    // 消费对象
                    { text: item.for_from_memberKeyName, classes: { 'bd-btm-dark': ifADayLastOne } },
                    // 类别
                    { text: `${item.outtype1KeyName}：${item.outtype2KeyName}`, classes: { 'bd-btm-dark': ifADayLastOne } },
                    // 币种
                    { text: `${item.bankTypeKeyName}：${item.bankKeyName}`, classes: { 'bd-btm-dark': ifADayLastOne } },
                    // 支出账户
                    { text: item.memberKeyName, classes: { 'bd-btm-dark': ifADayLastOne } },
                    // 自分类
                    { text: item.dtype, classes: { 'bd-btm-dark': ifADayLastOne } },
                    { id: item.id, eles: ['btn:edit|编辑', 'btn:del|删除', 'btn:detail|详情'], classes: { tc: true, 'bd-btm-dark': ifADayLastOne }},
                    { id: item.id, eles: ['ckbx'], classes: { 'bd-btm-dark': ifADayLastOne }, checked: false, styles: { 'padding-left': 0, 'padding-right': 0, 'text-align': 'center' } }
                ];
                if (ifADayLastOne) { re[0].onedayAllMoneys = dayTotal; }
                return re;
            });
            this.thisPageTotal = String(pageTotal);
            this.pageNums = resData.page;
            this.doSearchFlag = !this.doSearchFlag;
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
        this.pageNums.currentPage = 1;
        this.requestForList();
    }
    onDelSuccess(str: string) {
        if (str === 'delSuccess') {
            this.requestForList();
        }
    }

    ngOnDestroy() {
        this.modalSer.eventEmit.emit({ modalIfShow: 'no' });
    }

}
