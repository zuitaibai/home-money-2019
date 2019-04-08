import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ObjTpye } from '../../../../util/types';
import { ApiService } from '../../../../service/api.service';

@Component({
    selector: 'app-member-type',
    templateUrl: './member-type.component.html',
    styleUrls: ['./member-type.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MemberTypeComponent),
        multi: true
    }]
})
export class MemberTypeComponent implements OnInit, ControlValueAccessor, OnChanges {

    checkedId: number;

    @Input() ifShowAll: boolean;
    @Input() addOrEdit: string;
    @Input() fbug: number;

    data: ObjTpye[] = [];
    datass: ObjTpye[] = [];

    sname: string;

    private change = (value: any) => { };

    constructor(private apiServ: ApiService) { }

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
        this.sname = `member-${this.fbug}-${Date.now()}`;
        this.apiServ.getMemberValue().subscribe(res => {
            this.data = res;
            this.datass = this.makeData(this.ifShowAll);
            if (this.addOrEdit === 'add' && this.datass.length > 0) {
                this.checkedId = this.datass[0].id;
                this.change(this.datass[0].id);
            }
        });
    }
    ngOnChanges(changes: SimpleChanges) {
        if (!changes.ifShowAll.firstChange && changes.ifShowAll.currentValue === false) {
            if (this.data.find(v => v.id === this.checkedId).ifhome === 0) {
                if (this.datass.length <= 0) {
                    return;
                }
                this.checkedId = this.datass[0].id;
                this.change(this.datass[0].id);
            }
        }
    }
    clickRadio(id: number, name: string) {
        this.checkedId = id;
        this.change(id);
    }
    makeData(blean: boolean) {
        return this.data.filter((v: ObjTpye) => blean ? true : v.ifhome === 1);
    }

}
