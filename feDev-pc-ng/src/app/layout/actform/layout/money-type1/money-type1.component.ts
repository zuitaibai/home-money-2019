import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ObjTpye } from '../../../../util/types';
import { ApiService } from '../../../../service/api.service';

@Component({
    selector: 'app-money-type1',
    templateUrl: './money-type1.component.html',
    styleUrls: ['./money-type1.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MoneyType1Component),
        multi: true
    }]
})
export class MoneyType1Component implements OnInit, ControlValueAccessor {

    checkedId: number;
    sname: string;

    @Input() editInitMemberKey: number;
    @Input() addOrEdit: string;

    moneyType1Data: ObjTpye[] = [];

    private change = (value: any) => { };

    constructor(private apiServ: ApiService) {
        this.sname = `bankTypeKey-${Math.random().toString().replace(/^\d\./, '')}`;
    }

    writeValue(value: any): void {
        if (value !== undefined) {
            this.checkedId = value;
        }
    }
    registerOnChange(fn: (_: any) => void): void {
        this.change = fn;
    }
    registerOnTouched(fn: any): void {}

    ngOnInit() {
        this.apiServ.getMoney1Value().subscribe(res => {
            this.moneyType1Data = res;
            if (this.addOrEdit === 'add' && res.length > 0) {
                this.checkedId = res[0].id;
                this.change(res[0].id);
            }
        });
    }
    clickRadio(id: number, name: string) {
        this.checkedId = id;
        this.change(id);
    }

}
