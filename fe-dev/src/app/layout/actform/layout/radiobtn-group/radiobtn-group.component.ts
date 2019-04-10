import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'radiobtn-group',
    templateUrl: './radiobtn-group.component.html',
    styleUrls: ['./radiobtn-group.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadiobtnGroupComponent),
        multi: true
    }]
})
export class RadiobtnGroupComponent implements OnInit, ControlValueAccessor {

    @Input() options: any = [];
    @Input() disableds: any = []; // 可以在父组件动态更改
    @Output() outChange: EventEmitter<any> = new EventEmitter();
    privateName: string;
    model: any = '';
    onChange = (_: any) => { };
    constructor() {
        const rdm = Math.random().toString().replace(/^\d\./, '');
        this.privateName = `radio-${rdm}}`;
    }
    ngOnInit() { }
    ifDisabledMe(obj: any) {
        return this.disableds.some((v: any) => v === obj.value );
    }
    myChange(obj: any) {
        const { value } = obj;
        this.model = value;
        this.onChange(value);
        this.outChange.emit(obj);
    }
    writeValue(value: any) {
        if (value) {
            if (this.model !== value) { this.outChange.emit(value); }
            this.model = value;
        } else {
            this.model = '';
        }
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any): void {}

}
