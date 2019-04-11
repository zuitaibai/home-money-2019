import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';
import { ModalService } from '../../service/modal.service';
import { map2Cn } from '../../util/local';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.css']
})
export class ListTableComponent implements OnInit, OnChanges {

    ifSelectAllFlag: boolean;
    tempCalcNum = { sum: 0, len: 0 };

    @Input() columns: ThObjType[];
    @Input() dataSource: TdObjType[][];
    @Input() routerPageType: string;
    @Input() onePageTotal: string;
    @Input() pageNums: PageNumsType;
    @Input() listStatusOpts: ObjTpye = {};

    // tslint:disable-next-line:no-output-on-prefix
    @Output() delSuccess: EventEmitter<string> = new EventEmitter();

    constructor(
        private modalService: ModalService,
        private apiService: ApiService,
        private router: Router,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() { }
    doTempCalc() {
        const m = this.dataSource.map((v: TdObjType[]) => v[0].ifTrChecked ? +v[1].text : 0).filter((v: number) => v !== 0);
        const sum = m.reduce((x: number, y: number) => x + +y, 0);
        const len = m.length;
        this.tempCalcNum = { sum, len };
    }
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (changes.pageNums && changes.pageNums.currentValue && changes.pageNums.previousValue) {
            if (changes.pageNums.currentValue.currentPage !== changes.pageNums.previousValue.currentPage) {
                this.ifSelectAllFlag = false;
            }
        }
    }
    goToEdit(id: number) {
        this.fds.writeStorage(this.routerPageType, this.listStatusOpts);
        this.router.navigate([`/${this.routerPageType}/edit`, id]);
    }
    evTriggerSelectingRow(tr: TdObjType[]) {
        tr[0].ifTrChecked = !tr[0].ifTrChecked;
        tr[tr.length - 1].checked = !tr[tr.length - 1].checked;
        this.evSelectingRow();
        this.doTempCalc();
    }
    evSelectingRow() {
        this.ifSelectAllFlag = this.dataSource.every(item => item[item.length - 1].checked);
    }
    evSelectingAll() {
        const ifAll = this.ifSelectAllFlag = !this.ifSelectAllFlag;
        this.dataSource.forEach(item => {
            item[item.length - 1].checked = this.ifSelectAllFlag;
            item[0].ifTrChecked = ifAll;
        });
        this.doTempCalc();
    }
    evDelItem(id: number, index: number) {
        if (!confirm('确认要删？')) { return; }
        // 收入与支出列表的单删使用一个接口
        if (this.routerPageType === 'listPay' || this.routerPageType === 'listCome') {
            this.apiService.delPayInListItem(id).subscribe( res => {
                if (res && res.affectedRows >= 1) {
                    alert('删除成功！');
                    // 此处不用本地更新是因为还有页脚数字s需要更新
                    // this.dataSource.splice(index, 1);
                    this.delSuccess.emit('delSuccess');
                } else {
                    alert('删除失败！');
                }
            });
        } else if (this.routerPageType === 'listAccounts') {
            this.apiService.delAccListItem(id).subscribe( res => {
                if (res && res.affectedRows >= 1) {
                    alert('删除成功！');
                    // 此处不用本地更新是因为还有页脚数字s需要更新
                    // this.dataSource.splice(index, 1);
                    this.delSuccess.emit('delSuccess');
                } else {
                    alert('删除失败！');
                }
            });
        }
    }
    evDetailItem(tr: TdObjType[]) {
        tr.forEach(item => item.ifTdActive = true);
        const cn = map2Cn(this.routerPageType);
        this.modalService.eventEmit.emit({
            modalSize: 'large',
            modalTit: `${cn} -> 详情`,
            modalInner: this.makeHtml(tr),
            modalOverlay: 'yes',
            modalIfShow: 'yes',
            onClose: (arg: any) => {
                tr.forEach(item => item.ifTdActive = false);
            }
        });
    }
    evDelAll() {
        const idsArr = [];
        const indexsArr: number[] = [];
        this.dataSource.forEach((item, index) => {
            if (item[0].ifTrChecked) {
                idsArr.push(item[0].id);
                indexsArr.push(index);
            }
        });
        if (idsArr.length === 0) {
            alert('你tmd倒是选一个啊！');
            return;
        }
        if (confirm('确定要删？')) {
            // 收入与支出列表的批删使用一个接口
            if (this.routerPageType === 'listPay' || this.routerPageType === 'listCome') {
                this.apiService.delPayInListItems({ids: idsArr.join(',')}).subscribe( res => {
                    if (res && res.affectedRows >= 1) {
                        alert('删除成功！');
                        // 此处不用本地更新是因为还有页脚数字s需要更新
                        // this.dataSource = this.dataSource.filter((item, index) => !indexsArr.includes(index));
                        this.delSuccess.emit('delSuccess');
                    } else {
                        alert('删除失败！');
                    }
                });
            } else if (this.routerPageType === 'listAccounts') {
                this.apiService.delAccListItems({ids: idsArr.join(',')}).subscribe( res => {
                    if (res && res.affectedRows >= 1) {
                        alert('删除成功！');
                        // 此处不用本地更新是因为还有页脚数字s需要更新
                        // this.dataSource = this.dataSource.filter((item, index) => !indexsArr.includes(index));
                        this.delSuccess.emit('delSuccess');
                    } else {
                        alert('删除失败！');
                    }
                });
            }
        }
    }
    makeHtml(tr: TdObjType[]) {
        if (this.routerPageType === 'listPay') {
            return `
                <h3 class="n_h3">${tr[2].text}</h3>
                <table class="n_table" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><th width="100">日期：</th><td class="bold">${tr[0].text}</td></tr>
                    <tr><th>金额：</th><td class="n_money">${tr[1].text}</td></tr>
                    <tr><th>消费对象：</th><td>${tr[3].text}</td></tr>
                    <tr><th>类别：</th><td>&lt; ${tr[4].text} &gt;</td></tr>
                    <tr><th>币种：</th><td>${tr[5].text}</td></tr>
                    <tr><th>支出账户：</th><td>${tr[6].text}</td></tr>
                    <tr><th>自分类：</th><td>${tr[7].text || ''}</td></tr>
                    <tr><th valign="top">备注：</th><td class="n_td">${tr[0].for_oth || ''}</td></tr>
                    <tr class="n_gray"><th>添加时间：</th><td>${tr[0].for_addtime}</td></tr>
                    <tr class="n_gray"><th>ID：</th><td>${tr[0].id}</td></tr>
                    <tr class="n_gray"><th>录入人：</th><td>${tr[0].for_inwho || ''}</td></tr>
                </table>`;
        } else if (this.routerPageType === 'listCome') {
            return `
                <h3 class="n_h3">${tr[2].text}</h3>
                <table class="n_table" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><th width="100">日期：</th><td class="bold">${tr[0].text}</td></tr>
                    <tr><th>金额：</th><td class="n_money">${tr[1].text}</td></tr>
                    <tr><th>类别：</th><td>&lt; ${tr[3].text} &gt;</td></tr>
                    <tr><th>币种：</th><td>${tr[4].text}</td></tr>
                    <tr><th>收入账户：</th><td>${tr[5].text}</td></tr>
                    <tr><th>自分类：</th><td>${tr[6].text || ''}</td></tr>
                    <tr><th valign="top">备注：</th><td class="n_td">${tr[0].for_oth || ''}</td></tr>
                    <tr class="n_gray"><th>添加时间：</th><td>${tr[0].for_addtime}</td></tr>
                    <tr class="n_gray"><th>ID：</th><td>${tr[0].id}</td></tr>
                    <tr class="n_gray"><th>录入人：</th><td>${tr[0].for_inwho || ''}</td></tr>
                </table>`;
        } else if (this.routerPageType === 'listAccounts') {
            return `
                <h3 class="n_h3">${tr[2].text}</h3>
                <table class="n_table" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><th width="100">日期：</th><td class="bold">${tr[0].text}</td></tr>
                    <tr><th>金额：</th><td class="n_money">${tr[1].text}</td></tr>
                    <tr><th>类别：</th><td>&lt; ${tr[3].text} &gt;</td></tr>
                    <tr><th>由：</th><td>${tr[4].text}</td></tr>
                    <tr><th>至：</th><td>${tr[5].text}</td></tr>
                    <tr><th>自分类：</th><td>${tr[6].text || ''}</td></tr>
                    <tr><th valign="top">备注：</th><td class="n_td">${tr[0].for_oth || ''}</td></tr>
                    <tr class="n_gray"><th>添加时间：</th><td>${tr[0].for_addtime}</td></tr>
                    <tr class="n_gray"><th>ID：</th><td>${tr[0].id}</td></tr>
                    <tr class="n_gray"><th>录入人：</th><td>${tr[0].for_inwho || ''}</td></tr>
                </table>`;
        }
    }

}
