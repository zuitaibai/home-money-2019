import { Component, OnInit, Input } from '@angular/core';
import { ObjTpye } from '../../util/types';

@Component({
    selector: 'app-statistics-pop-inner',
    templateUrl: './statistics-pop-inner.component.html',
    styleUrls: ['./statistics-pop-inner.component.css']
})
export class StatisticsPopInnerComponent implements OnInit {

    @Input() compName: string;
    @Input() data: ObjTpye;

    pgObj = {
        pay : {},
        come : {},
        resum : {}
    };

    constructor() { }

    ngOnInit() {
        let name = this.compName; // pay|come|resumm|resum
        if (name === 'resumm' || name === 'resum') {
            name = 'resum';
            /* {
                张三: [
                    {**: '信用卡', ***: '交通', money:3332},
                    {**: '借记卡', ***: '建行', money:0},
                    {**: '现金', ***: '现金', money:2983}
                ],
                李四: [
                    {**: '借记卡, ***: '民生', money: -62},
                    {**: '借记卡, ***: '民生', money: -62}
                ]
            }
            //此处对data进行去0处理（money为0的项），
            ////因为在模板中用for of遍历，同时使用rm0valByPipe会有问题，导致单元格rowspan紊乱,
            ////我猜是因为使用了first as ifFirst的缘故
            */
            for (const i of Object.keys(this.data)) {
                this.data[i] = this.data[i].filter((v: ObjTpye) => Number(v.money) !== 0);
                if (this.data[i].length === 0) {
                    delete this.data[i];
                }
            }
        }
        this.pgObj[name] = this.data;
    }

}
