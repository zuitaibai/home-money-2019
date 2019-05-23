import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DateMethodService } from '../../../../service/date-method.service';

@Component({
    selector: 'app-date-ctr',
    templateUrl: './date-ctr.component.html',
    styleUrls: ['./date-ctr.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateCtrComponent),
        multi: true
    }]
})
export class DateCtrComponent implements OnInit, ControlValueAccessor {

    dateVal: string;
    today: string;
    ytoday: string;
    yytoday: string;

    private change = (value: any) => { };

    constructor(private dtSer: DateMethodService) {}
    writeValue(value: any): void {
        if (value !== undefined) {
            this.dateVal = value;
        }
    }
    registerOnChange(fn: (_: any) => void): void {
        this.change = fn;
    }
    registerOnTouched(fn: any): void { }

    ngOnInit() {
        const dd = new Date();
        this.dateVal = this.dtSer.format(dd, '-');
        this.today = this.dtSer.format(dd, '.', true);
        this.ytoday = this.dtSer.format(dd.setDate(dd.getDate() - 1), '.', true);
        this.yytoday = this.dtSer.format(dd.setDate(dd.getDate() - 1), '.', true);
    }
    settDate(n: number) {
        let d: Date|number;
        const dd = new Date();
        const date = this.dateVal ? new Date(this.dateVal) : new Date();
        switch (n) {
            case 100: d = date.setDate(date.getDate() + 1); break;
            case -100: d = date.setDate(date.getDate() - 1); break;
            case -1: d = dd.setDate(dd.getDate() - 1); break;
            case -2: d = dd.setDate(dd.getDate() - 2); break;
            case 0: d = dd; break;
        }
        this.dateVal = this.dtSer.format(d, '-');
        this.change(this.dateVal);
    }
    onChange() {
        this.change(this.dateVal);
    }

}
