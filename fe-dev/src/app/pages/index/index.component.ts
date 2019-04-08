import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { ApiService } from '../../service/api.service';
import { DateMethodService } from '../../service/date-method.service';
import { Observable } from 'rxjs'; // try to asnyc pipe
import { ObjTpye } from '../../util/types';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

    basic: ObjTpye;
    bizhongList: Array<ObjTpye>;
    bizhongList2: Array<ObjTpye>;
    yuEData: ObjTpye; // without async pipe
    getYuEObservable: Observable<ObjTpye>; // try to asnyc pipe
    chartOption1: EChartOption;
    chartOption2: EChartOption;
    chartOption3: EChartOption;
    year: string  = String(new Date().getFullYear());

    constructor(
        private apiService: ApiService,
        private dateSv: DateMethodService,
        private fds: ForDetailBackSessionMngService) { }

    makeChartOption(data: Array<ObjTpye>, dstr: string): EChartOption {
        const total = data.reduce((a: number, b: ObjTpye) => a + b.value, 0);
        return {
            title: { text: dstr, x: 'center' },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: Array<any>, ticket?: any, callback?: any) => {
                    const a = params[0];
                    return a.name + ' [' + (a.value * 100 / total).toFixed(1) + '%]' + '<br/> ' + a.value;
                }
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: [
                {
                    type: 'category',
                    data: data.map((v: ObjTpye) => v.name),
                    axisTick: { alignWithLabel: true },
                    axisLabel: { rotate: 45 }
                }
            ],
            yAxis: [{ type: 'value' }],
            series: [{ type: 'bar', barWidth: '60%', data }]
        } as EChartOption;
    }

    ngOnInit() {
        this.fds.clearAll();

        const date: ObjTpye = this.dateSv.dStartEnd().fmt;
        const yearSe: string[] = date.year;

        this.apiService.getIndexTotal({
            date_sign_start: yearSe[0],
            date_sign_end: yearSe[1],
            tongjidw: 'year',
            pageSize: 10,
            currentPage: 1
        }).subscribe((resData: ObjTpye) => {
            if (resData.listArr && resData.listArr.length) {
                this.basic = { ...resData.listArr[0] };
            }
        });

        this.apiService.getZhichu(this.year).subscribe((resData: ObjTpye) => {
            if (resData.bizhongList && resData.bizhongList.length) {
                this.bizhongList = resData.bizhongList;
            }
            if (resData.typeList && resData.typeList.length) {
                const dataForDraw = resData.typeList
                .map((item: ObjTpye) => ({value: item.money, name: item.name}))
                .sort((a: ObjTpye, b: ObjTpye) => b.value - a.value);
                this.chartOption1 = this.makeChartOption(dataForDraw, '支 出 账 户');
            }
            if (resData.forMemberList && resData.forMemberList.length)  {
                const dataForDraw = resData.forMemberList
                .map((item: ObjTpye) => ({value: item.money, name: item.forMemberName}))
                .sort((a: ObjTpye, b: ObjTpye) => b.value - a.value);
                this.chartOption2 = this.makeChartOption(dataForDraw, '消 费 对 象');
            }
        });

        this.apiService.getShouru(this.year).subscribe((resData: ObjTpye) => {
            if (resData.typeList && resData.typeList.length) {
                const dataForDraw = resData.typeList
                .map((item: ObjTpye) => ({value: item.money, name: item.name}))
                .sort((a: ObjTpye, b: ObjTpye) => b.value - a.value);
                this.chartOption3 = this.makeChartOption(dataForDraw, '收 入 类 别');
            }
            if (resData.bizhongList && resData.bizhongList.length) {
                this.bizhongList2 = resData.bizhongList;
            }
        });

        /* this.apiService.getYuE(this.year).subscribe(resData => {
            this.yuEData = resData;
        }); */
        // try to asnyc pipe
        this.getYuEObservable = this.apiService.getYuE(this.year);

    }


}
