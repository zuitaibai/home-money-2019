import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ObjTpye } from '../../util/types';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

    @Input() mSize = '' || 'large';
    @Input() mTit = '' || '操作对话框';
    @Input() mInner = '' || 'Loading...';
    @Input() mIfShow = '' || 'no';
    @Input() mOverlay = 'no';
    @Input() mData: ObjTpye;
    @Input() mOther: ObjTpye | undefined;
    @Input() mCompName = '';

    @Output() modalClose = new EventEmitter<string>();

    constructor() { }

    ngOnInit() {
    }

    evCloseModal() {
        this.modalClose.emit(this.mOverlay = 'no');
    }

}
