import { Component, OnInit } from '@angular/core';

import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';
import { defPageSize } from '../../util/local';
import { ModalService } from '../../service/modal.service';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-list-come',
    templateUrl: './list-come.component.html',
    styleUrls: ['./list-come.component.css']
})
export class ListComeComponent implements OnInit {

    columns: ThObjType[];
    dataSource: TdObjType[][];
    pageNums: PageNumsType;
    thisPageTotal = '';
    formInits: ObjTpye;

    routerPageType = 'listCome';

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
            { text: '类别', key: 4 },
            { text: '币种', key: 5 },
            { text: '收入账户', key: 6 },
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
        this.apiService.getListCome(this.storePageOptions).subscribe((resData: ObjTpye) => {
            let pageTotal = 0;
            this.dataSource = resData.list.map( (item: ObjTpye, index: number) => {
                pageTotal += item.money;
                const re: ObjTpye[] = [
                    // 日期
                    { text: item.date_sign, id: item.id, for_oth: item.other, for_addtime: item.date_dbCreate, for_inwho: item.actOn_memberKey, classes: { tc: true }, attrs: { title: `添加时间：${item.date_dbCreate}`}},
                    // 金额
                    { text: item.money, classes: { red: true, b: true } },
                    // 名称
                    { text: item.name, styles: { 'font-weight': 'bold' }, attrs: { title: item.other ? '备注：' + item.other : '' } },
                    // 类别
                    { text: item.intypeKeyName},
                    // 币种
                    { text: `${item.bankTypeKeyName}：${item.bankKeyName}`},
                    // 收入账户
                    { text: item.memberKeyName},
                    // 自分类
                    { text: item.dtype},
                    { id: item.id, eles: ['btn:edit|编辑', 'btn:del|删除', 'btn:detail|详情'], classes: { tc: true }},
                    { id: item.id, eles: ['ckbx'], checked: false, styles: { 'padding-left': 0, 'padding-right': 0, 'text-align': 'center' } }
                ];
                return re;
            });
            this.thisPageTotal = String(pageTotal);
            this.pageNums = resData.page;
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
