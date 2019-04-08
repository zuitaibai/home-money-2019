import { Injectable } from '@angular/core';
import { ObjTpye } from '../util/types';
import { defPageSize } from '../util/local';

@Injectable({
    providedIn: 'root'
})
export class ForDetailBackSessionMngService {

    private sessionPre = 'listOptionsAsBack';

    constructor() { }

    // 列表页调用
    public makeListSearchParams(listPg: string) {
        const storage = sessionStorage.getItem(`${this.sessionPre}-${listPg}`);
        let obj: ObjTpye;
        if (storage) {
            obj = JSON.parse(storage);
            if (!obj.currentPage) { obj.currentPage = 1; }
            if (!obj.pageSize) { obj.pageSize = defPageSize; }
        } else {
            obj = null;
        }
        this.clearAll();
        return obj;
    }
    // 非列表页调用
    public clearAll() {
        // ['listPay', 'listCome', 'listAccounts', 'listStatistics'] // 没有编辑，故也没有写入过相关sessionStorage
        // 此处没有做成活的，拷贝自各list页面自己声明的routerPageType，
        // 而且如果改的话，请注意除此、各list页面、及其它别处是否有用到。
        ['listPay', 'listCome', 'listAccounts'].forEach(v => {
            sessionStorage.removeItem(`${this.sessionPre}-${v}`);
        });
    }
    // 点击编辑记入session
    public writeStorage(myListPg: string, myListOpts: ObjTpye|undefined) {
        if (myListOpts) {
            if (myListOpts.pageSize === defPageSize) { delete myListOpts.pageSize; }
            if (myListOpts.currentPage === 1) { delete myListOpts.currentPage; }

            if (Object.keys(myListOpts).length > 0) {
                sessionStorage.setItem(`${this.sessionPre}-${myListPg}`, JSON.stringify(myListOpts));
            }
        }
    }
}
