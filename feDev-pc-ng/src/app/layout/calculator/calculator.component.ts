import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Calc } from './calc';

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('show') calcShow = false;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onClose: EventEmitter<boolean> = new EventEmitter();
    calcStatus = '';
    calcInfo = '';
    timer: any;
    calcc: Calc;
    viewActObj = { if7: false, if8: false, if9: false, ifA: false, ifB: false, if4: false, if5: false, if6: false, ifC: false, ifD: false, if1: false, if2: false, if3: false, ifE: false, ifF: false, if0: false, ifG: false, ifH: false, ifI: false, ifJ: false };
    keysMap = {
        1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 0: '0',
        '+': 'A', '-': 'B', '*': 'C', '/': 'D',
        '(': 'E', ')': 'F', '.': 'G', Backspace: 'H', Delete: 'I', '=': 'J', Enter: 'J'
    };
    keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '+', '-', '*', '/', '.'];
    keysAll = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '+', '-', '*', '/', '.', 'Backspace', 'Delete', 'Enter'];
    constructor() {
        this.calcc = new Calc();
    }

    ngOnInit() { }

    @HostListener('document:keyup', ['$event'])
    writeInput(event: KeyboardEvent): void {
        if (event.key === 'J' && event.shiftKey) {
            this.evClose(this.calcShow = !this.calcShow);
            return;
        }
        if (!this.calcShow) { return; }
        if (this.keysAll.find((v: string) => v === event.key)) {
            this.calcViewAct(event.key);
            this.goCalc(event.key);
        }
    }
    goCalc(eventName: string) {
        if (this.keys.find((v: string) => v === eventName)) {
            let wd = eventName;
            if (wd === '*') { wd = '×'; }
            if (wd === '/') { wd = '÷'; }
            this.calcStatus += wd;
            return;
        }
        switch (eventName) {
            case 'Backspace': {
                const len = this.calcStatus.length;
                if (len >= 1) { this.calcStatus = this.calcStatus.substring(0, len - 1); }
                break;
            }
            case 'Delete': this.calcStatus = ''; break;
            case 'Enter' : {
                if (this.calcStatus === '') { return; }
                const pre = this.calcStatus;
                this.calcStatus = '' + this.calcc.parse(pre);
                this.calcInfo = pre + '=' + this.calcStatus;
                break;
            }
        }
    }
    calcViewAct(str: string) {
        clearTimeout(this.timer);
        for (const item of Object.keys(this.viewActObj)) {
            this.viewActObj[item] = false;
        }
        const key = `if${this.keysMap[str]}`;
        this.viewActObj[key] = true;
        this.timer = setTimeout(() => this.viewActObj[key] = false, 80);
    }
    clickCalc(event: any) {
        if (event.target.tagName.toLowerCase() === 'td') {
            const str = event.target.getAttribute('data-s');
            this.goCalc(str);
        }
    }
    evClose(blean: boolean) {
        this.onClose.emit(this.calcShow = blean);
    }

}
