import { Component, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';

import { TdObjType, ThObjType, PageNumsType, ObjTpye } from '../../util/types';

@Component({
    selector: 'app-list-table-inner-modal',
    templateUrl: './list-table-inner-modal.component.html',
    styleUrls: ['./list-table-inner-modal.component.css']
})
export class listTableInnerModalComponent implements OnInit {

    @Input() columns: ThObjType[];
    @Input() dataSource: TdObjType[][];
    @Input() pages: ObjTpye;
    @Output() onChoosed: EventEmitter<number> = new EventEmitter();

    constructor() { }

    ngOnInit() {}

    selectThisTr(id: number) {
        this.onChoosed.emit(id);
    }
    onPagingChange(){}

}
