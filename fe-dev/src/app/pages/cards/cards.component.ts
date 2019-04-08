import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ObjTpye } from '../../util/types';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

    addSt: boolean;

    pageData: ObjTpye = {
        /*
            {
                "list": {
                    "2": {
                        "2": [
                            {
                                "id": 1, "num": "6225880162057823", "sname": "招行卡", "memberKey": 2, "bankTypeKey": 2, "bankKey": 1, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0,
                                "validityPeriod": "", "other": "", "threeNum": "", "if_show": 0, "bankName": "招商", "memberName": "老公", "bankTypeName": "借记卡", "num2": "6225 8801 6205 7823 "
                            },
                            {
                                "id": 2, "num": "6225683721003149608", "sname": "广发卡", "memberKey": 2, "bankTypeKey": 2, "bankKey": 2, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0,
                                "validityPeriod": "", "other": "", "threeNum": "", "if_show": 0, "bankName": "广发", "memberName": "老公", "bankTypeName": "借记卡", "num2": "6225 6837 2100 3149 608"
                            }
                        ],
                        "3": [
                            {
                                "id": 10, "num": "4392250808857212", "sname": "招信卡", "memberKey": 2, "bankTypeKey": 3, "bankKey": 1, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0, "validityPeriod": "07/20",
                                "other": "", "threeNum": "", "if_show": 1, "bankName": "招商", "memberName": "老公", "bankTypeName": "信用卡", "num2": "4392 2508 0885 7212 "
                            },
                            {
                                "id": 11, "num": "4581240918395584", "sname": "交信卡", "memberKey": 2, "bankTypeKey": 3, "bankKey": 4, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0, "validityPeriod": "04/21",
                                "other": "", "threeNum": "", "if_show": 1, "bankName": "交通", "memberName": "老公", "bankTypeName": "信用卡", "num2": "4581 2409 1839 5584 "
                            }
                        ]
                    },
                    "3": {
                        "2": [
                            {
                                "id": 19, "num": "6222600910072961673", "sname": "交通卡[公积金]", "memberKey": 3, "bankTypeKey": 2, "bankKey": 4, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0, "validityPeriod": "",
                                "other": "", "threeNum": "", "if_show": 0, "bankName": "交通", "memberName": "老婆", "bankTypeName": "借记卡", "num2": "6222 6009 1007 2961 673"
                            },
                            {
                                "id": 20, "num": "6226220136814398", "sname": "民生卡", "memberKey": 3, "bankTypeKey": 2, "bankKey": 7, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0, "validityPeriod": "12/28",
                                "other": "", "threeNum": "931", "if_show": 0, "bankName": "民生", "memberName": "老婆", "bankTypeName": "借记卡", "num2": "6226 2201 3681 4398 "
                            }
                        ],
                        "3": [
                            {
                                "id": 21, "num": "6227521122773384", "sname": "中信卡", "memberKey": 3, "bankTypeKey": 3, "bankKey": 5, "cungen": 0, "income": 0, "pay": 0, "yu_e": 0, "validityPeriod": "11/25",
                                "other": "好像是借记信用两用", "threeNum": "125", "if_show": 0, "bankName": "中行", "memberName": "老婆", "bankTypeName": "信用卡", "num2": "6227 5211 2277 3384 "
                            }
                        ]
                    }
                },
                "banktypes": {"2": "借记卡", "3": "信用卡", "5": "其它"},
                "members": {"1": "公共", "2": "老公", "3": "老婆", "4": "老大", "5": "老二"},
                "banks": { "1": "招商", "2": "广发", "3": "工商", "4": "交通", "5": "中行", "6": "建行", "7": "民生", "8": "北京", "9": "农商", "10": "农业", "11": "邮政", "12": "人民", "13": "其它", "22": "平安"}
            }
        */
        list: {},
        members: {},
        banktypes: {},
        banks: {}
    };
    addModel: ObjTpye = {};
    addModelCache: ObjTpye = {}; // for click btn canel
    itemsDataCache = {}; // for click btn canel

    constructor(
        private apiServ: ApiService,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.request();
        this.fds.clearAll();
    }

    request() {
        this.apiServ.getListCards().subscribe(res => {
            this.pageData = res;
            this.addModelCache = {
                memberKey : Object.entries(this.pageData.members)[0][0],
                bankTypeKey : Object.entries(this.pageData.banktypes)[0][0],
                bankKey : Object.entries(this.pageData.banks)[0][0],
                sname: '',
                num: '',
                validityPeriod: '',
                threeNum: '',
                other: ''
            };
            this.addModel = {...this.addModelCache}; // 由于里面没有引用类型，故不用深拷贝
        });
    }

    tmpNotFirstItem(obj: ObjTpye, key: string|number) {
        return Object.keys(obj).indexOf('' + key) !== 0;
    }
    addSure() {
        if (!confirm('确认新增？')) { return; }
        this.apiServ.addCard(this.addModel).subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert('添加成功！');
                this.request();
            } else {
                alert('添加失败！');
            }
        });
    }
    addCanel() {
        this.addModel = { ...this.addModelCache };
    }
    delItem(id: number) {
        if (!confirm('确认删除？')) { return; }
        this.apiServ.delCard(id).subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert('删除成功！');
                this.request();
            } else {
                alert('删除失败！');
            }
        });
    }
    eidtSure(tr: ObjTpye) {
        if (!confirm('确认提交？')) { return; }
        const { memberKey, bankTypeKey, bankKey, validityPeriod, threeNum, other, num, sname} = tr;
        const body = { memberKey, bankTypeKey, bankKey, validityPeriod, threeNum, other, num, sname};
        this.apiServ.updateCard(tr.id, body).subscribe(res => {
            if (res && res.affectedRows === 1 && res.changedRows === 1) {
                alert('编辑成功！');
                this.request();
            } else {
                alert('编辑失败！');
            }
        });
    }
    eidtCanel(i: string, ii: string, index: number) {
        this.pageData.list[i][ii][index] = {
            ...this.itemsDataCache[`${i}|${ii}|${index}`],
            editSt: false
        };
    }
    gotoEdit(i: string, ii: string, index: number, tr: ObjTpye) {
        tr.editSt = true;
        this.itemsDataCache[`${i}|${ii}|${index}`] = { ...tr };
    }

}
