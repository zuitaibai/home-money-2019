import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'app-paging-dom',
    templateUrl: './paging-dom.component.html',
    styleUrls: ['./paging-dom.component.css']
})
export class PagingDomComponent implements OnInit, OnChanges {

    conf = {
        adjacents: 2, lte2pShow: false, ifSelect: true, showPvNt: true, showFtLt: true,
        wordElp: '...', wordPv: '< 上一页', wordNt: '下一页 >', wordFt: '|<< 首 页', wordLt: '末 页 >>|'
    };
    pageCount = 0;
    flag1 = false;
    flag2 = false;
    flag3 = false;
    // tslint:disable-next-line:no-input-rename
    @Input('pShowInfo') showInfo = false;
    // tslint:disable-next-line:no-input-rename
    @Input('pCurP') curP = 1;
    // tslint:disable-next-line:no-input-rename
    @Input('pSize') pSize = 10;
    // tslint:disable-next-line:no-input-rename
    @Input('pTotal') total = 0;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onPagingChange: EventEmitter<number> = new EventEmitter();

    ngOnInit() { }
    ngOnChanges() {
        this.calc();
    }
    evChangePage(n: number|string) {
        n = Number(n);
        this.onPagingChange.emit(n);
        this.curP = n;
        this.calc();
    }
    private calc() {
        this.flag1 = this.flag2 = this.flag3 = false;
        this.pageCount = Math.ceil(this.total / this.pSize);
        if (this.pageCount < 1) { this.pageCount = 1; }
        if (this.curP > this.pageCount) { this.curP = this.pageCount; }
        if (this.curP < 1 + (this.conf.adjacents * 3)) {
            this.flag1 = true;
        } else if (this.pageCount - (this.conf.adjacents * 2) > this.curP && this.curP > (this.conf.adjacents * 2)) {
            this.flag2 = true;
        } else {
            this.flag3 = true;
        }
    }
    makeEndArr(stop: number, start: number = 1) {
        const arr = [];
        do {
            arr[arr.length] = start++;
        } while (start <= stop);
        return arr;
    }
}
