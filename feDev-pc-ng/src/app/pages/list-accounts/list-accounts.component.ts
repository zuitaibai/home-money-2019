import { Component, OnInit } from '@angular/core';

import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';
import { defPageSize } from '../../util/local';
import { ModalService } from '../../service/modal.service';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-list-accounts',
    templateUrl: './list-accounts.component.html',
    styleUrls: ['./list-accounts.component.css']
})
export class ListAccountsComponent implements OnInit {

    columns: ThObjType[];
    dataSource: TdObjType[][];
    pageNums: PageNumsType;
    thisPageTotal = '';
    formInits: ObjTpye;

    routerPageType = 'listAccounts';

    storePageOptions: ObjTpye = {
        currentPage: 1,
        pageSize: defPageSize
    };

    constructor(
        private apiService: ApiService,
        private modalSer: ModalService,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {

        this.columns = [
            { text: '日期', key: 0, attrs: { width: 90 } },
            { text: 'ID', key: 3, styles: {fontSize: 12} },
            { text: '金额', key: 1, classes: {} },
            { text: '名称', key: 2 },
            { text: '类别', key: 4 },
            { text: '还了没', key: 14 },
            { text: '由', key: 5/* , attrs: { width: 270 } */  },
            { text: '至', key: 6/* , attrs: { width: 270 } */ },
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
        this.apiService.getListAcc(this.storePageOptions).subscribe((resData: ObjTpye) => {
            let pageTotalA = 0;
            let pageTotalB = 0;
            const listAccountsType = { 100 : '转存', 0: '存根', 1: '借入', 2: '还入', 3: '生意收入', '-1': '借出', '-2': '还出', '-3': '生意投资'};
            const dataSource = resData.list.map( (item: ObjTpye, index: number) => {
                if (item.type === -1 || item.type === -2 || item.type === -3) {
                    pageTotalB += item.money;
                } else if (item.type !== 100) {
                    pageTotalA += item.money;
                }
                let moneyStyles = {};
                let from = '';
                let to = '';
                if (item.type === 100) {
                    moneyStyles = {color: 'rgba(83, 129, 127, .6)'/* , textDecoration: 'line-through' */};
                } else if (item.type === -1 || item.type === -2 || item.type === -3 || item.type === 100) {
                    moneyStyles = {color: 'blue'};
                }
                if (item.type === 100 || item.type === -1 || item.type === -2 || item.type === -3) {
                    from = `${item.memberKey_fromName} ◆ ${item.bankTypeKey_fromName} • ${item.bankKey_fromName}`; //⊳
                    if(item.type === -1 || item.type === -2) to = item.otherpartyName ? `[${item.otherpartyName}]` : '';
                }
                if (item.type === 100 || item.type === 0 || item.type === 1 || item.type === 2 || item.type === 3) {
                    to = `${item.memberKey_toName} ◆ ${item.bankTypeKey_toName} • ${item.bankKey_toName}`;
                    if(item.type === 1 || item.type === 2) from = item.otherpartyName ? `[${item.otherpartyName}]` : '';
                }
                // let isFinish = {'0': '✘', '1': '✔', '2': '◕'}[item.isFinished];
                // if(item.isFinished == 1 || item.isFinished == 2) isFinish += ` (${{'1':'还出', '-1':'还入'}[item.type]||''}id: ${item.finishedFormIds})`;
                // if(item.isFinished == 1 || item.isFinished == 2) isFinish += ` (${{'1':'还出', '-1':'还入'}[item.type]||''}${item.finishedFormIds.split(',').length}笔)`;

                let yihuanColJoinTxt = item.isFinished == 0 ? '' : ` 已${{'1':'还出', '-1':'还入'}[item.type]||''}的记录id: ${item.finishedFormIds}`;
                let huanok = false, huanpt = false, huanno = false, forDetailStatus = {icoClass: '', fId: ''};
                let tr5text = '';
                let classes = {};
                if(item.type === 1 || item.type === -1){
                    if(item.isFinished==0) {
                        huanno = true;
                        forDetailStatus.icoClass = 'huanno';
                    }
                    else if(item.isFinished==1) {
                        huanok = true;
                        forDetailStatus.icoClass = 'huanok';
                    }
                    else if(item.isFinished==2) {
                        huanpt = true;
                        forDetailStatus.icoClass = 'huanpt';
                    }
                    tr5text = yihuanColJoinTxt;
                    classes = {huanok, huanpt, huanno};
                }
                else if(item.type === 2 || item.type === -2){
                    let targetId = item.finishedFormIds || '';
                    if(item.type === 2) tr5text = `(还的那笔借出帐目的id是: ${targetId})`;
                    else tr5text = `(还的那笔借入帐目的id是: ${targetId})`;
                    classes = { colorbbb: true};
                    forDetailStatus.fId = targetId;
                }

                const re: ObjTpye[] = [
                    // 日期
                    { text: item.date_sign, ifTrGray: item.type === 100, id: item.id, for_oth: item.other, for_addtime: item.date_dbCreate, for_inwho: item.actOn_memberKey, classes: { tc: true }, attrs: { title: `添加时间：${item.date_dbCreate}`}},
                    // ID
                    { text: `${item.id}`, styles: {fontSize: 12, color: '#ccc', fontStyle: 'italic'}},
                    // 金额
                    { text: item.money, classes: { red: true, b: true }, styles: {...moneyStyles, fontSize: '14px'} },
                    // 名称
                    { text: item.name, styles: { 'font-weight': 'bold' }, attrs: { title: item.other ? '备注：' + item.other : '' } },
                    // 类别
                    { text: listAccountsType[item.type] || '', isFrom: String(item.type == 1 || item.type == 2), isTo: String(item.type == -1 || item.type == -2), type: item.type },
                    //是否已还  otherName: 对方姓名
                    { text: tr5text, otherName: (item.type === 1 || item.type === 2 || item.type === -1 || item.type === -2) ? (item.otherpartyName || '') : '', keyN: item.isFinished, classes, forDetailStatus },
                    // 由
                    { text: from },
                    // 至
                    { text: to },
                    // 自分类
                    { text: item.dtype },
                    { id: item.id, type:item.type, eles: ['btn:edit|编辑', 'btn:del|删除', 'btn:detail|详情'], classes: { tc: true }},
                    { id: item.id, eles: ['ckbx'], checked: false, styles: { 'padding-left': 0, 'padding-right': 0, 'text-align': 'center' } }
                ];
                return re;
            });
            /*
                // 长度补齐，md，挺费工啊
                const mObj = { maxes1 : [], maxes2 : [], maxes3 : [], maxes4 : [], maxes5 : [], maxes6 : [] };
                dataSource.forEach((tr: ObjTpye[]) => {
                    const item1 = tr[4].text;
                    const item2 = tr[5].text;
                    const item1Arr = item1.split('::');
                    const item2Arr = item2.split('::');
                    if (item1Arr.length === 3) {
                        mObj.maxes1.push(item1Arr[0].length);
                        mObj.maxes2.push(item1Arr[1].length);
                        mObj.maxes3.push(item1Arr[2].length);
                    }
                    if (item2Arr.length === 3) {
                        mObj.maxes4.push(item2Arr[0].length);
                        mObj.maxes5.push(item2Arr[1].length);
                        mObj.maxes6.push(item2Arr[2].length);
                    }
                });
                const maxObj = { max1 : Math.max.apply(Math, mObj.maxes1), max2 : Math.max.apply(Math, mObj.maxes2), max3 : Math.max.apply(Math, mObj.maxes3), max4 : Math.max.apply(Math, mObj.maxes4), max5 : Math.max.apply(Math, mObj.maxes5), max6 : Math.max.apply(Math, mObj.maxes6) };
                dataSource.forEach((tr: ObjTpye[]) => {
                    const item1 = tr[4].text;
                    const item2 = tr[5].text;
                    const item1Arr = item1.split('::');
                    const item2Arr = item2.split('::');
                    if (item1Arr.length === 3) {
                        // 使用全角空格
                        tr[4].text = item1Arr.map((v: string, index: number) => {
                            return (v + '　　　　　　　　　　　　　　　　　　　　').substring(0, maxObj['max' + (index + 1)]);
                        }).join(' — ');
                    }
                    if (item2Arr.length === 3) {
                        // 使用全角空格
                        tr[5].text = item2Arr.map((v: string, index: number) => {
                            return (v + '　　　　　　　　　　　　　　　　　　　　').substring(0, maxObj['max' + (index + 4)]);
                        }).join(' — ');
                    }
                });
            */
            this.dataSource = dataSource;
            this.thisPageTotal = `${pageTotalA} - ${pageTotalB} = ${pageTotalA - pageTotalB}`;
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
