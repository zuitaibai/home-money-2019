import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';
import { ModalService } from '../../service/modal.service';
import { map2Cn, nameMap } from '../../util/local';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.css']
})
export class ListTableComponent implements OnInit, OnChanges {

    pageCnName: string;
    pageEnName = nameMap._listAccount.rd;

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

    ngOnInit() {
        this.pageCnName = map2Cn(this.routerPageType);
    }
    doTempCalc() {
        const m = this.dataSource.map((v: TdObjType[]) => v[0].ifTrChecked ? +v[this.routerPageType==this.pageEnName?2:1].text : 0).filter((v: number) => v !== 0);
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
    evDelItem(id: number, type: number|undefined, index: number) {
        let confirmer = '确认要删？';
        if(type == 1 || type == -1){
            let t1 = '入', t2 = '出';
            if(type == 1){
                t1 = '出';
                t2 = '入';
            }
            confirmer += `\n\n！！！！！注意：此借${t2}连带的所有[还${t1}]记录将被同步删除`;
        }
        if (!confirm(confirmer)) { return; }
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
        } else if (this.routerPageType === this.pageEnName) {
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
    evDetailItem(tr: TdObjType[], dataSource: TdObjType[][]) {
        dataSource.forEach(tr => {
            tr.forEach(item => item.ifTdActive = false);
        });
        tr.forEach(item => item.ifTdActive = true);
        const cn = map2Cn(this.routerPageType);

        if(this.routerPageType == this.pageEnName) this.apiService.getDetailAccounts(tr[0].id).subscribe((res: ObjTpye) => {
            this.modalService.eventEmit.emit({
                modalSize: 'large',
                modalTit: `${cn} -> 详情`,
                modalInner: this.makeHtml(tr, res.finisheds||{}),
                modalOverlay: 'no',
                modalIfShow: 'yes',
                onClose: (arg: any) => {
                    dataSource.forEach(tr => {
                        tr.forEach(item => item.ifTdActive = false);
                    });
                }
            });
        })
        else{
            this.modalService.eventEmit.emit({
                modalSize: 'large',
                modalTit: `${cn} -> 详情`,
                modalInner: this.makeHtml(tr),
                modalOverlay: 'no',
                modalIfShow: 'yes',
                onClose: (arg: any) => {
                    dataSource.forEach(tr => {
                        tr.forEach(item => item.ifTdActive = false);
                    });
                }
            });
        }


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
            } else if (this.routerPageType === this.pageEnName) {
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
    makeHtml(tr: TdObjType[], finishedsObj?: ObjTpye) {
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
        } else if (this.routerPageType === this.pageEnName) {
            let isFinish = '';
            let finishList = '';
            let fid = '';
            if(tr[4].type == 1 || tr[4].type == -1){
                let txt = '还入';
                if(tr[4].type == 1) txt = '还出';
                isFinish = `<strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${txt}状态</strong>：<span class="${tr[5].forDetailStatus.icoClass||''}"></span>`;
                if(tr[5].keyN == 0) finishList = '<tr><th>还帐历史：</th><td class="n_ccc">一笔都还没还呢</td></tr>';
                else{
                    if(finishedsObj){
                        finishList = `<tr><th>还帐历史：</th><td class="tbpadding">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                <th>ID</th>
                                    <th>日期</th>
                                    <th>金额</th>
                                    <th>名称</th>
                                    <th>自分类</th>
                                </tr>
                                ${
                                    finishedsObj.list.map((ssj: ObjTpye) => {
                                        let ss = ssj.date_sign.replace('T', ' ');
                                        let arr = ss.split(':');
                                        ss = arr[0];
                                        if(ss.length>1) ss = arr[0] + ':' + arr[1];
                                        return '<tr><td>'+ssj.id+'</td><td>'+ss+'</td><td>'+ssj.money+'</td><td>'+ssj.name+'</td><td>'+(ssj.dtype||'')+'</td></tr>';
                                    }).join('\n')
                                }
                            </table></td></tr>
                        `;
                    }
                }
            }
            else if(tr[4].type == 2) fid = `&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span class="mmopfu_">(还的那笔借出帐目的id是: ${tr[5].forDetailStatus.fId||''})</span>`;
            else if(tr[4].type == -2) fid = `&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span class="mmopfu_">(还的那笔借入帐目的id是: ${tr[5].forDetailStatus.fId||''})</span>`;

            return `
                <h3 class="n_h3">${tr[3].text}</h3>
                <table class="n_table" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                    <tr><th width="100">日期：</th><td class="bold">${tr[0].text}</td></tr>
                    <tr><th>金额：</th><td class="n_money">${tr[2].text}</td></tr>
                    <tr><th>类别：</th><td>&lt; ${tr[4].text} &gt;${isFinish}${fid}</td></tr>
                    <tr><th>由：</th><td>${tr[6].text}</td></tr>
                    <tr><th>至：</th><td>${tr[7].text}</td></tr>
                    <tr><th>自分类：</th><td>${tr[8].text || ''}</td></tr>
                    ${finishList}
                    <tr><th valign="top">备注：</th><td class="n_td">${tr[0].for_oth || ''}</td></tr>
                    <tr class="n_gray"><th>添加时间：</th><td>${tr[0].for_addtime}</td></tr>
                    <tr class="n_gray"><th>ID：</th><td>${tr[0].id}</td></tr>
                    <tr class="n_gray"><th>录入人：</th><td>${tr[0].for_inwho || ''}</td></tr>
                    </tbody>
                </table>`;
        }
    }
    exportTable() {
        const exportItem = this.makeExportData();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportItem);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        let sname = '';
        if (this.routerPageType === 'listPay') sname = '支出';
        else if (this.routerPageType === 'listCome') sname = '收入';
        else if (this.routerPageType === this.pageEnName) sname = '帐目';
        this.saveAsExcelFile(excelBuffer, '2019-2020'+sname);
    }

    private saveAsExcelFile(buffer: any, fileName: string) {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      FileSaver.saveAs(data, fileName+'.xlsx');
    }

    private makeExportData(){
        const thds = Array.from(document.querySelectorAll('#m-table-m>thead th'));
        const tbodys = document.querySelectorAll('#m-table-m>tbody tr');
        thds.length = thds.length -2;
        return Array.from(tbodys).map( tr =>{
            let tds = tr.querySelectorAll('td');
            let o = {};
            thds.forEach((th, index) => {
                o[th.textContent] = tds[index].innerText;
            });
            return o;
        });
    }
}
