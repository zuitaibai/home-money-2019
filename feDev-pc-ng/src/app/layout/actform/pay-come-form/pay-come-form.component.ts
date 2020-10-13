import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ObjTpye } from '../../../util/types';
import { ApiService } from '../../../service/api.service';
import { DateMethodService } from '../../../service/date-method.service';
import { forbiddenValidator } from '../validators/forbidden.directive';
@Component({
    selector: 'app-pay-come-form',
    templateUrl: './pay-come-form.component.html',
    styleUrls: ['./pay-come-form.component.css']
})
export class PayComeFormComponent implements OnInit, AfterViewInit, OnChanges {

    // tslint:disable-next-line:no-input-rename
    @Input('oprType') addOrEdit: string; // 'eidt' || 'add'
    @Input() id: number; // item's id
    @Input() payOrCome: string; // 'pay' || 'come'

    @ViewChild('nameCtrRef') nameCtrRef: ElementRef; // for ctr auto focus

    ifMemberShowAll = false;
    bankKeyListData: ObjTpye[] = [];
    outtype1KeyData: ObjTpye[];
    outtype2KeyData: ObjTpye[];
    intypeKeyData: ObjTpye[];
    isOughtNotPayStr = '';

    sForm = new FormGroup({
        type: new FormControl(0),
        name: new FormControl('', Validators.required),
        money: new FormControl('', [Validators.required, forbiddenValidator(/\./i)]),
        date_sign: new FormControl(''),
        dtype: new FormControl(''),
        other: new FormControl(''),

        memberKey: new FormControl(),   // 异步
        for_from_memberKey: new FormControl(), // 异步

        intypeKey: new FormControl(),   // 异步  逻辑本页内控制
        outtype1Key: new FormControl(), // 异步  逻辑本页内控制
        outtype2Key: new FormControl(), // 联动异步  逻辑本页内控制

        bankTypeKey: new FormControl(), // 异步
        bankKey: new FormControl()      // 联动异步
    });

    // TODO: 寻找add时获取异步控件序列的第一个的id 的方式
    // add 时的初始数据，用的时候还要补充二级联动控件的触发操作，如：
    // this.sForm.patchValue(this.formInitDataWithoutStepJoin);
    // this.onMoneyType1Change(4);
    // 或：
    // this.sForm.reset(this.formInitDataWithoutStepJoin);
    // this.onMoneyType1Change(4);
    formInitDataWithoutStepJoin = {
        memberKey: 2,
        for_from_memberKey: 2,
        bankTypeKey: 4
    };

    get money() {
        return this.sForm.get('money');
    }

    constructor(
        private apiServ: ApiService,
        private dtSer: DateMethodService,
        private location: Location) { }
    ngOnChanges(changes: SimpleChanges) {
        // if (!changes.payOrCome.firstChange) {
            const str = changes.payOrCome.currentValue;
            const type = {pay: 0, come: 1}[str];
            this.sForm.patchValue({type});
        // }
    }
    ngOnInit() {
        // 支出一级和二级、收入级手动获取数据系列，及如果是add则为此三控件赋值
        this.apiServ.getOut1Value().subscribe(res => {
            this.outtype1KeyData = res;
            if (this.addOrEdit === 'add') {
                const id = res[0].id;
                this.sForm.patchValue({ outtype1Key: id });
                this.changeOut1(id);
                this.updateCtrlMemberforNum(id);
            }
        });
        this.apiServ.getComeValue().subscribe(res => {
            this.intypeKeyData = res;
            if (this.addOrEdit === 'add') {
                this.sForm.patchValue({ intypeKey: res[0].id });
            }
        });

        // 为其他控件赋初值
        if (this.addOrEdit === 'add') { // ADD
            this.sForm.patchValue({...this.formInitDataWithoutStepJoin, date_sign: this.dtSer.format(new Date())});
            this.onMoneyType1Change(4);
        } else if (this.addOrEdit === 'edit') { // EDIT
            this.apiServ.getDetailPayCome(this.id).subscribe((res: ObjTpye) => {
                this.sForm.patchValue({
                    name: res.name,
                    money: res.money,
                    date_sign: res.date_sign,
                    dtype: res.dtype,
                    other: res.other,
                    memberKey: res.memberKey,
                    for_from_memberKey: res.for_from_memberKey,
                    intypeKey: res.intypeKey,
                    outtype1Key: res.outtype1Key,
                    bankTypeKey: res.bankTypeKey
                });
                this.onMoneyType1Change(res.bankTypeKey, res.bankKey);
                this.changeOut1(res.outtype1Key, res.outtype2Key);
                this.updateCtrlMemberforNum(res.outtype1Key);
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
            this.bankKeyListData = res;
            this.sForm.patchValue({
                bankKey: initSubId || res.length > 0 && res[0].id || ''
            });
        });
    }
    // 本页及模板的方法：获取支出二级
    changeOut1(id: number, initSubId?: number) {
        this.apiServ.getOut2Value(id).subscribe(resp => {
            this.outtype2KeyData = resp;
            this.sForm.patchValue({
                outtype2Key: initSubId || resp.length > 0 && resp[0].id || ''
            });
        });
        this.updateCtrlMemberforNum(id);
    }
    updateCtrlMemberforNum(id: number) {
        this.ifMemberShowAll = id === 9 || id === 12;
    }

    submits() {
        let observable: Observable<ObjTpye>;
        let info: string;
        if (this.addOrEdit === 'add') {
            observable = this.apiServ.addDetailPayCome(this.sForm.value);
            info = '添加';
        } else if (this.addOrEdit === 'edit') {
            observable = this.apiServ.updateDetailPayCome(this.id, this.sForm.value);
            info = '编辑';
        }

        observable.subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert(`${info}成功！`);
                if (this.addOrEdit === 'edit') {
                    this.location.back();
                } else {
                    const type = this.sForm.value.type;
                    this.sForm.reset(this.formInitDataWithoutStepJoin);
                    this.onMoneyType1Change(4);
                    const out1id = this.outtype1KeyData[0].id;
                    this.sForm.patchValue({ outtype1Key: out1id});
                    this.changeOut1(out1id);
                    this.updateCtrlMemberforNum(out1id);
                    this.sForm.patchValue({ intypeKey: this.intypeKeyData[0].id, type, date_sign: this.dtSer.format(new Date()) });
                    this.nameCtrRef.nativeElement.focus();
                }
            } else {
                alert(`${info}失败！`);
            }
        });

    }

}
