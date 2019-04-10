import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'checkbox-group',
    templateUrl: './checkbox-group.component.html',
    styleUrls: ['./checkbox-group.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxGroupComponent),
        multi: true
    }]
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {

    @Input() options: any = [];
    @Input() disableds: any = []; // 可以在父组件动态更改
    @Output() outChange: EventEmitter<any> = new EventEmitter();
    model: any = [];
    onChange = (_: any) => { };
    constructor() { }
    ngOnInit() {}
    ifDisabledMe(obj: any) {
        return this.disableds.some((v: any) => v === obj.value );
    }
    myChange(obj: any) {
        const { value } = obj;
        const index = this.model.indexOf(value);
        let dos: boolean;
        if (index > -1) {
            this.model.splice(index, 1);
            this.onChange(this.model);
            dos = false;
        } else {
            this.model.push(value);
            this.onChange(this.model);
            dos = true;
        }
        // for user event
        this.outChange.emit({
            active: {...obj, ifCheck: dos},
            checks: this.model
        });
    }
    writeValue(value: any) {
        if (value) {
            if (this.model.sort().toString() !== value.sort().toString()) { // 此判断是：如果js动态选中和已有选中不同，才触发
                // for js
                this.outChange.emit({ checks: value });
            }
            if (value.length >= 1) {
                this.model = value;
            } else {
                this.model = [];
            }
        } else {
            this.model = [];
        }
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any): void {}
}
