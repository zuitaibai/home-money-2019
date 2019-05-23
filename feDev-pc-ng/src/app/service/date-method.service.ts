import { Injectable } from '@angular/core';
import { ObjTpye } from '../util/types';

const millisecond = 1000 * 60 * 60 * 24;

@Injectable({
    providedIn: 'root'
})
export class DateMethodService {

    private obj: ObjTpye;

    constructor() { }

    format(date: Date|string|number, sp: string = '-', ifShort: boolean = false) {
        const datee = new Date(date);
        const ys = datee.getFullYear();
        const ms = datee.getMonth() + 1;
        const ds = datee.getDate();
        const re = [ys, (ms < 10 ? '0' + ms : ms), (ds < 10 ? '0' + ds : ds)];
        if (ifShort) { re.shift(); }
        return re.join(sp);
    }

    dStartEnd(): ObjTpye {
        if (this.obj && this.obj.year) { return this.obj; }
        const TODAY = new Date();
        const YEAR = TODAY.getFullYear();
        const MONTH = TODAY.getMonth();
        const DAY = TODAY.getDay();
        const day = [TODAY, TODAY];
        const dayLast = [new Date(TODAY.getTime() - millisecond), new Date(TODAY.getTime() - millisecond)];
        const week = [new Date(TODAY.getTime() - ( (DAY !== 0 ? DAY - 1 : 6) * millisecond)), TODAY];
        const month = [new Date(YEAR, MONTH, 1), TODAY];
        const quarter = [new Date(YEAR, this.getQuarterStartMonth(MONTH), 1), TODAY];
        const year = [new Date(YEAR, 0, 1), TODAY];
        const monthLast = (() => {
            const start = this.getPriorMonthFirstDay(YEAR, MONTH);
            const end = new Date(start.getFullYear(), start.getMonth(), this.getMonthDays(start.getFullYear(), start.getMonth()));
            return [start, end];
        })();
        const weekLast = (() => {
            const s = new Date(TODAY.getTime() - (millisecond * (DAY !== 0 ? DAY - 1 : 6)));
            const end = new Date(s.getTime() - millisecond);
            const start = new Date(end.getTime() - (millisecond * 6));
            return [start, end];
        })();
        const quarterLast = (() => {
            const start = this.getPriorFirstDay(YEAR, MONTH);
            const end = new Date(start.getFullYear(), start.getMonth() + 2, this.getMonthDays(start.getFullYear(), start.getMonth() + 2));
            return [start, end];
        })();
        const yearLast = [new Date(YEAR - 1, 0, 1), new Date(YEAR - 1, 11, 1)];
        this.obj = { year, yearLast, quarter, quarterLast, month, monthLast, week, weekLast, day, dayLast, fmt: {} };
        ['year', 'yearLast', 'quarter', 'quarterLast', 'month', 'monthLast', 'week', 'weekLast', 'day', 'dayLast'].forEach(item => {
            this.obj.fmt[item] = this.obj[item].map((v: Date) => this.format(v));
        });
        return this.obj;
    }

    getQuarterStartMonth(month: number) {
        let result = 0;
        switch (true) {
            case month < 3 : result = 0; break;
            case month < 6 : result = 3; break;
            case month < 9 : result = 6; break;
            default : result = 9;
        }
        return result;
    }

    getMonthDays(year: number, month: number) {
        const relativeDate = new Date(year, month, 1);
        let relativeMonth = relativeDate.getMonth();
        let relativeYear = relativeDate.getFullYear();
        if (relativeMonth === 11) {
            relativeYear++;
            relativeMonth = 0;
        } else {
            relativeMonth++;
        }
        const nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
        return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
    }

    getPriorMonthFirstDay(year: number, month: number) {
        if (month === 0) {// 年份为0代表,是本年的第一月,所以不能减
            month = 11; // 月份为上年的最后月份
            year--; // 年份减1
            return new Date(year, month, 1);
        }
        // 否则,只减去月份
        month--;
        return new Date(year, month, 1);
    }
    getPriorFirstDay(year: number, month: number) {
        const spring = 0; // 春
        const summer = 3; // 夏
        const fall = 6;   // 秋
        const winter = 9; // 冬
        switch (month) {
            case spring: year--; month = winter; break;
            case summer: month = spring; break;
            case fall: month = summer; break;
            case winter: month = fall; break;
        }
        return new Date(year, month, 1);
    }



}


