import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ObjTpye } from '../../../../util/types';

@Component({
    selector: 'app-money-type2',
    templateUrl: './money-type2.component.html',
    styleUrls: ['./money-type2.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MoneyType2Component),
        multi: true
    }]
})
export class MoneyType2Component implements OnInit, ControlValueAccessor {

    checkedId: number;
    sname: string;

    @Input() bkList: ObjTpye[] = [];

    private change = (value: any) => { };
    constructor() {
        this.sname = `bankKey-${Math.random().toString().replace(/^\d\./, '')}`;
    }

    writeValue(value: any): void {
        if (value !== undefined) {
            this.checkedId = value;
        }
    }
    registerOnChange(fn: (_: any) => void): void {
        this.change = fn;
    }
    registerOnTouched(fn: any): void { }

    ngOnInit() { }
    clickRadio(id: number, name: string) {
        this.checkedId = id;
        this.change(id);
    }

}
