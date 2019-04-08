import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ObjTpye } from '../../../util/types';
import { ApiService } from '../../../service/api.service';
import { DateMethodService } from '../../../service/date-method.service';
import { forbiddenValidator } from '../validators/forbidden.directive';

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

    editInitTypeValue: number;
    bankKey1ListData: ObjTpye[] = [];
    bankKey2ListData: ObjTpye[] = [];
    isOughtNotPayStr = '';

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
            });
        }
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
        const type = this.sForm.value.type;
        let observable: Observable<ObjTpye>;
        let info: string;
        if (this.addOrEdit === 'add') {
            observable = this.apiServ.addDetailAccounts(this.sForm.value);
            info = '添加';
        } else if (this.addOrEdit === 'edit') {
            observable = this.apiServ.updateDetailAccounts(this.id, this.sForm.value);
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

}
