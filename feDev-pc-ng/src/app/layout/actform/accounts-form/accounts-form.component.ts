import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ObjTpye, PageNumsType, ThObjType, TdObjType } from '../../../util/types';
import { ApiService } from '../../../service/api.service';
import { DateMethodService } from '../../../service/date-method.service';
import { forbiddenValidator } from '../validators/forbidden.directive';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';

@Component({
    selector: 'app-accounts-form',
    templateUrl: './accounts-form.component.html',
    styleUrls: ['./accounts-form.component.css']
})
export class AccountsFormComponent implements OnInit, AfterViewInit {

    // tslint:disable-next-line:no-input-rename
    @Input('oprType') addOrEdit: string; // 'eidt' || 'add'
    @Input() id: number; // item's id
    @Input() payOrCome: string; // 'pay' || 'come'

    @ViewChild('nameCtrRef') nameCtrRef: ElementRef; // for ctr auto focus

    curFmType = 100;

    editInitTypeValue: number;
    bankKey1ListData: ObjTpye[] = [];
    bankKey2ListData: ObjTpye[] = [];
    isOughtNotPayStr = '';

    mIfShow = false;
    mTit='';
    columns: ThObjType[];
    dataSource: TdObjType[][];
    doPages={
        currentPage: 1,
        pageSize: 200,
        totalRecord: 0
    };
    textStr='';

    ctrOtherpartyName = new FormControl('', Validators.required);
    ctrFinishedFormIds = new FormControl('', Validators.required);

    sForm = new FormGroup({
        type: new FormControl(100),
        name: new FormControl('', Validators.required),
        money: new FormControl('', [Validators.required, forbiddenValidator(/\./i)]),
        date_sign: new FormControl(''),
        dtype: new FormControl(''),
        other: new FormControl(''),

        bankTypeKey_from: new FormControl(), // 异步
        bankKey_from: new FormControl(), // 联动异步
        bankTypeKey_to: new FormControl(), // 异步
        bankKey_to: new FormControl(), // 联动异步
        memberKey_from: new FormControl(), // 异步
        memberKey_to: new FormControl(), // 异步
    });
    // TODO: 寻找add时获取异步控件序列的第一个的id 的方式
    // add 时的初始数据，用的时候还要补充二级联动控件的触发操作，如：
    // this.sForm.patchValue(this.formInitDataWithoutStepJoin);
    // this.onMoneyType1Change(4);
    // this.onMoneyType2Change(4);
    // 或：
    // this.sForm.reset(this.formInitDataWithoutStepJoin);
    // this.onMoneyType1Change(4);
    // this.onMoneyType2Change(4);
    formInitDataWithoutStepJoin = {
        memberKey_from: 2,
        memberKey_to: 2,
        bankTypeKey_from: 4,
        bankTypeKey_to: 4
    };
    txtStatus = '';

    get money() { return this.sForm.get('money'); }
    get type() { return this.sForm.get('type'); }


    constructor(
        private apiServ: ApiService,
        private dtSer: DateMethodService,
        private location: Location) { }

    ngOnInit() {
        // 为控件赋初值
        if (this.addOrEdit === 'add') { // ADD
            this.sForm.patchValue({ date_sign: this.dtSer.format(new Date()) });
            this.sForm.patchValue(this.formInitDataWithoutStepJoin);
            this.onMoneyType1Change(4);
            this.onMoneyType2Change(4);
        } else if (this.addOrEdit === 'edit') { // EDIT

            this.apiServ.getDetailAccounts(this.id).subscribe((res: ObjTpye) => {
                if(res.type == 1 || res.type == -1) {
                    this.sForm.addControl('otherpartyName', this.ctrOtherpartyName);
                    this.sForm.patchValue({otherpartyName: res.otherpartyName});
                    this.txtStatus = {'0': '✘', '1': '✔', '2': '◕'}[res.isFinished] + ` （已${{'1':'还出', '-1':'还入'}[res.type]||''}的记录id: ${res.finishedFormIds}）`;
                }
                if(res.type == 2 || res.type == -2) {
                    this.sForm.addControl('finishedFormIds', this.ctrFinishedFormIds);
                    this.sForm.patchValue({finishedFormIds: res.finishedFormIds});
                    if(res.type == 2) this.textStr = '此[还入]要还的是哪条借出帐目(id)';
                    else if(res.type == -2) this.textStr = '此[还出]要还的是哪条借入帐目(id)';
                }
                this.editInitTypeValue = res.type;


                this.sForm.patchValue({
                    type: res.type,
                    name: res.name,
                    money: res.money,
                    date_sign: res.date_sign,
                    dtype: res.dtype,
                    other: res.other,

                    bankTypeKey_from: res.bankTypeKey_from,
                    bankKey_from: res.bankKey_from,
                    bankTypeKey_to: res.bankTypeKey_to,
                    bankKey_to: res.bankKey_to,
                    memberKey_from: res.memberKey_from,
                    memberKey_to: res.memberKey_to
                });
                this.onMoneyType1Change(res.bankTypeKey_from, res.bankKey_from);
                this.onMoneyType2Change(res.bankTypeKey_to, res.bankKey_to);
                this.isOughtNotPayStr = res.isOughtNotPay ? '.' : '';
                this.sForm.setControl('type', new FormControl({ value: res.type, disabled: true }));
                this.curFmType = res.type;
            });
        }

        this.columns = [
            { text: '日期', key: 0 },
            { text: 'ID', key: 3 },
            { text: '金额', key: 1, classes: {} },
            { text: '名称', key: 2 },
            { text: '类别', key: 4 },
            { text: '还了没', key: 5 },
            { text: '由', key: 6 },
            { text: '至', key: 7 },
            { text: '操作', key: 8 }
        ];

    }
    ngAfterViewInit() {
        this.nameCtrRef.nativeElement.focus();
    }
    // 组件的回调方法：获取币种二级，不可改名
    onMoneyType1Change(id: number, initSubId?: number) {
        this.apiServ.getMoney2Value(id).subscribe(res => {
            this.bankKey1ListData = res;
            this.sForm.patchValue({
                bankKey_from: initSubId || res.length > 0 && res[0].id || ''
            });
        });
    }
    // 组件的回调方法：获取币种二级，不可改名
    onMoneyType2Change(id: number, initSubId?: number) {
        this.apiServ.getMoney2Value(id).subscribe(res => {
            this.bankKey2ListData = res;
            this.sForm.patchValue({
                bankKey_to: initSubId || res.length > 0 && res[0].id || ''
            });
        });
    }
    submits() {
        //编辑时由于禁用type组件，this.sForm.value.type获取不到，所以用this.sForm.getRawValue().type，以为下用。但提交时无须包含type。
        //当新增时没有禁type组件，因此提交的的数据(this.sForm.value)里包含type字段。
        const type = this.sForm.getRawValue().type;

        let objs = Object.assign({}, this.sForm.value);
        //转存（type=100）全有
        //生意收入、存根、借入、还入，没有memberKey_from、bankKey_from、bankTypeKey_from
        if(type == 3 || type == 0 || type == 1 || type == 2){
            delete objs.memberKey_from;
            delete objs.bankKey_from;
            delete objs.bankTypeKey_from;
        }
        //生意支出、借出、还出，没有memberKey_to、bankKey_to、bankTypeKey_to
        else if(type == -3 || type == -1 || type == -2){
            delete objs.memberKey_to;
            delete objs.bankKey_to;
            delete objs.bankTypeKey_to;
        }

        let observable: Observable<ObjTpye>;
        let info: string;

        if (this.addOrEdit === 'add') {
            observable = this.apiServ.addDetailAccounts(objs);
            info = '添加';
        } else if (this.addOrEdit === 'edit') {
            observable = this.apiServ.updateDetailAccounts(this.id, objs);
            info = '编辑';
        }


        observable.subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert(`${info}成功！`);
                if (this.addOrEdit === 'edit') {
                    this.location.back();
                } else {
                    this.sForm.reset(this.formInitDataWithoutStepJoin);
                    this.sForm.patchValue({ type, date_sign: this.dtSer.format(new Date()) });
                    this.onMoneyType1Change(4);
                    this.onMoneyType2Change(4);
                    this.nameCtrRef.nativeElement.focus();
                }
            } else {
                if (res && res.isExistCung === 'yet' && res.status === 'fail') {
                    alert(`已存在此人此币种的存根，${info}失败！`);
                    return;
                }
                alert(`${info}失败！`);
            }
        });
    }
    //浏览
    liulan(){
        this.mIfShow = true;
        this.doPages.currentPage = 1;
        this.doPages.totalRecord = 0;
        this.getForList();
    }
    getForList(){
        this.apiServ.getListAcc({
            currentPage: this.doPages.currentPage,
            pageSize: this.doPages.pageSize,
            type: {
                '2': -1,
                '-2': 1
            }[this.sForm.value.type]
        }).subscribe((resData: ObjTpye) => {
            const listAccountsType = { 100 : '转存', 0: '存根', 1: '借入', 2: '还入', 3: '生意收入', '-1': '借出', '-2': '还出', '-3': '生意投资'};
            const dataSource = resData.list.map( (item: ObjTpye, index: number) => {
                let huanok = false, huanpt = false, huanno = false;
                if(item.type === 1 || item.type === -1){
                    if(item.isFinished==0) huanno = true;
                    else if(item.isFinished==1) huanok = true;
                    else if(item.isFinished==2) huanpt = true;
                }
                let yihuanJoinTxt =  (item.isFinished == 0) ? '' : ` 已${{'1':'还出', '-1':'还入'}[item.type]||''}的记录id: ${item.finishedFormIds}`;
                let from = '';
                let to = '';
                if (item.type === 100 || item.type === -1 || item.type === -2 || item.type === -3) {
                    from = `${item.memberKey_fromName} ◆ ${item.bankTypeKey_fromName} • ${item.bankKey_fromName}`; //⊳
                    if(item.type === -1 || item.type === -2) to = item.otherpartyName ? `[${item.otherpartyName}]` : '';
                }
                if (item.type === 100 || item.type === 0 || item.type === 1 || item.type === 2 || item.type === 3) {
                    to = `${item.memberKey_toName} ◆ ${item.bankTypeKey_toName} • ${item.bankKey_toName}`;
                    if(item.type === 1 || item.type === 2) from = item.otherpartyName ? `[${item.otherpartyName}]` : '';
                }
                const re: ObjTpye[] = [
                    // 日期
                    { text: item.date_sign},
                    // ID
                    { text: `${item.id}`, styles: {fontStyle:'italic',color:'#aaa'}},
                    // 金额
                    { text: item.money, styles: {color:'red'} },
                    // 名称
                    { text: item.name, styles: { 'font-weight': 'bold' }, attrs: { title: item.other ? '备注：' + item.other : '' } },
                    // 类别
                    { text: listAccountsType[item.type], type: item.type },
                    //是否已还
                    { text: yihuanJoinTxt, keyN: item.isFinished, classes: {huanno, huanok, huanpt} },
                    // 由
                    { text: from },
                    // 至
                    { text: to },
                    // 操作
                    { text: '', linkText: '选择', isOpr: true, id: item.id }
                ];
                return re;
            });
            this.dataSource = dataSource;
            this.doPages.totalRecord = resData.page.totalRecord;
        })
    }
    onPagingChange(page: number) {
        this.doPages.currentPage = page;
        this.getForList();
    }
    onChoosedTr(id: number){
        this.sForm.patchValue({ finishedFormIds: id });
        this.mIfShow = false;
    }
    //编辑时radio组件禁用，可以不用考虑change事件
    changeType(type: number){
        this.curFmType = type;
        if(type == 1 || type == -1){
            this.sForm.addControl('otherpartyName', this.ctrOtherpartyName);
        }else{
            if(this.sForm.get('otherpartyName')) this.sForm.removeControl('otherpartyName');
        }
        if(type == 2 || type == -2){
            this.sForm.addControl('finishedFormIds', this.ctrFinishedFormIds);
            if(type == 2) {
                this.mTit = '借出帐目列表（请选择要还的是哪条借出帐目）';
                this.textStr = '此[还入]要还的是哪条借出帐目(id)';
            }
            else if(type == -2) {
                this.mTit = '借入帐目列表（请选择要还的是哪条借入帐目）';
                this.textStr = '此[还出]要还的是哪条借入帐目(id)';
            }
        }else{
            if(this.sForm.get('finishedFormIds')) this.sForm.removeControl('finishedFormIds');
        }
        this.sForm.reset(this.formInitDataWithoutStepJoin);
        this.sForm.patchValue({ type, date_sign: this.dtSer.format(new Date()) });
        this.onMoneyType1Change(4);
        this.onMoneyType2Change(4);
        this.nameCtrRef.nativeElement.focus();
    }
}
