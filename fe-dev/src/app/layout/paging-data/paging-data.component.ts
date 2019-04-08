import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ObjTpye } from '../../util/types';

const build = (curP: number, pageCount: number, conf: ObjTpye) => {
    const list = [];
    // list-item: { value: 1, type: 'first', link: true, disable: false, text: conf.wordFt }
    /*
        value: 值,
        type: first/prev/next/last/normal/current/elp,
        link: 是否链接, disable:是否禁用, text:铵钮文字
    */
    if (pageCount < 1) { pageCount = 1; }
    if (curP > pageCount) { curP = pageCount; }
    if (pageCount > 1) {
        // first and previous button
        if (curP > 1) {
            if (conf.showFtLt) {
                list.push({ value: 1, type: 'first', link: true, disable: false, text: conf.wordFt });
            }
            if (conf.showPvNt) {
                list.push({ value: curP - 1, type: 'prev', link: true, disable: false, text: conf.wordPv });
            }
        } else {
            if (conf.showFtLt) {
                list.push({ value: '', type: 'first', link: false, disable: true, text: conf.wordFt });
            }
            if (conf.showPvNt) {
                list.push({ value: '', type: 'prev', link: false, disable: true, text: conf.wordPv });
            }
        }
        // pages
        if (pageCount < 7 + (conf.adjacents * 2)) {
            for (let item = 1; item <= pageCount; item++) {
                if (item === curP) {
                    list.push({ value: '', type: 'current', link: false, disable: false, text: item });
                } else {
                    list.push({ value: item, type: 'normal', link: true, disable: false, text: item });
                }
            }
            // enough pages to hide some
        } else if (pageCount >= 7 + (conf.adjacents * 2)) {
            // close to beginning only hide later pages
            if (curP < 1 + (conf.adjacents * 3)) {
                for (let item = 1; item <= (4 + (conf.adjacents * 2)) - 1; item++) {
                    if (item === curP) {
                        list.push({ value: '', type: 'current', link: false, disable: false, text: item });
                    } else {
                        list.push({ value: item, type: 'normal', link: true, disable: false, text: item });
                    }
                }
                list.push({ value: '', type: 'elp', link: false, disable: false, text: conf.wordElp });
                list.push({ value: pageCount - 1, type: 'normal', link: true, disable: false, text: pageCount - 1 });
                list.push({ value: pageCount, type: 'normal', link: true, disable: false, text: pageCount });
                // in middle hide some front and some back
            } else if (pageCount - (conf.adjacents * 2) > curP && curP > (conf.adjacents * 2)) {
                list.push({ value: 1, type: 'normal', link: true, disable: false, text: 1 });
                list.push({ value: 2, type: 'normal', link: true, disable: false, text: 2 });
                list.push({ value: '', type: 'elp', link: false, disable: false, text: conf.wordElp });
                for (let item = curP - conf.adjacents; item <= curP + conf.adjacents; item++) {
                    if (item === curP) {
                        list.push({ value: '', type: 'current', link: false, disable: false, text: item });
                    } else {
                        list.push({ value: item, type: 'normal', link: true, disable: false, text: item });
                    }
                }
                list.push({ value: '', type: 'elp', link: false, disable: false, text: conf.wordElp });
                list.push({ value: pageCount - 1, type: 'normal', link: true, disable: false, text: pageCount - 1 });
                list.push({ value: pageCount, type: 'normal', link: true, disable: false, text: pageCount });
                // close to end only hide early pages
            } else {
                list.push({ value: 1, type: 'normal', link: true, disable: false, text: 1 });
                list.push({ value: 2, type: 'normal', link: true, disable: false, text: 2 });
                list.push({ value: '', type: 'elp', link: false, disable: false, text: conf.wordElp });
                for (let item = (pageCount - (1 + (conf.adjacents * 3))); item <= pageCount; item++) {
                    if (item === curP) {
                        list.push({ value: '', type: 'current', link: false, disable: false, text: item });
                    } else {
                        list.push({ value: item, type: 'normal', link: true, disable: false, text: item });
                    }
                }
            }
        }
        // last and next button
        if (curP < pageCount) {
            if (conf.showPvNt) {
                list.push({ value: curP + 1, type: 'next', link: true, disable: false, text: conf.wordNt });
            }
            if (conf.showFtLt) {
                list.push({ value: pageCount, type: 'last', link: true, disable: false, text: conf.wordLt });
            }
        } else {
            if (conf.showPvNt) {
                list.push({ value: '', type: 'next', link: false, disable: true, text: conf.wordNt });
            }
            if (conf.showFtLt) {
                list.push({ value: '', type: 'last', link: false, disable: true, text: conf.wordLt });
            }
        }
    } else if (pageCount === 1 && conf.lte2pShow) {
        if (conf.showFtLt) {
            list.push({ value: '', type: 'first', link: false, disable: true, text: conf.wordFt });
        }
        if (conf.showPvNt) {
            list.push({ value: '', type: 'prev', link: false, disable: true, text: conf.wordPv });
        }
        list.push({ value: '', type: 'current', link: false, disable: false, text: 1 });
        if (conf.showPvNt) {
            list.push({ value: '', type: 'next', link: false, disable: true, text: conf.wordNt });
        }
        if (conf.showFtLt) {
            list.push({ value: '', type: 'last', link: false, disable: true, text: conf.wordLt });
        }
    }
    return list;
};

const conf = {
    adjacents: 2, lte2pShow: false, ifSelect: true, showPvNt: true, showFtLt: true,
    wordElp: '...', wordPv: '< 上一页', wordNt: '下一页 >', wordFt: '|<< 首 页', wordLt: '末 页 >>|'
};

@Component({
    selector: 'app-paging-data',
    templateUrl: './paging-data.component.html',
    styleUrls: ['./paging-data.component.css']
})
export class PagingDataComponent implements OnInit, OnChanges {
    pagesArr = [];
    ifSelect = true;
    list = [];
    pageCount = 0;
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
    evChangePage(n: number | string) {
        n = Number(n);
        this.onPagingChange.emit(n);
        this.curP = n;
        this.calc();
    }
    private calc() {
        this.pageCount = Math.ceil(this.total / this.pSize);
        this.pagesArr = new Array(this.pageCount || 1).fill(1);
        this.list = build(this.curP, this.pageCount, conf);
    }

}
