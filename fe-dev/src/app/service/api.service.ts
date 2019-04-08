import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ObjTpye } from '../util/types';

// 修改此处连带修改server：boot/config.js
const preApi = 'api/';

// 已启用全局get请求缓存，如果个别不想使用，请在请求方法参数的最后加这个参数
const myCacheNoHttpOptions = {
    headers: new HttpHeaders({ mycache: 'no' })
};
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.warn(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    constructor(private http: HttpClient) { }

    /* // 首页数据块 总览
    getIndexTotal(obj: ObjTpye = {}): Observable<HttpResponse<ObjTpye>> {
        const url = `${preApi}listStatistics`;
        return this.http.post<HttpResponse<ObjTpye>>(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    } */
    // 首页数据块 总览
    getIndexTotal(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}listStatistics`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 首页数据块 支出
    getZhichu(dateStr: string = String(new Date().getFullYear())): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/zhichu/${dateStr}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 首页数据块 收入
    getShouru(dateStr: string = String(new Date().getFullYear())): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/shouru/${dateStr}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 首页数据块 余额
    getYuE(dateStr: string = String(new Date().getFullYear())): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/yu_e/${dateStr}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 支出列表
    getListPay(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}listPay`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 收入列表
    getListCome(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}listCome`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 列表页查询头 控件初始 : outtype1Key\bankTypeKey\memberKey\for_from_memberKey
    getInitControlValue(): Observable<ObjTpye> {
        const url = `${preApi}listPay`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 列表页查询头 控件初始 : intypeKey
    getIntypeKeyControlValue(): Observable<ObjTpye> {
        const url = `${preApi}listCome`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 成员类型
    getMemberValue(): Observable<any> {
        const url = `${preApi}member`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 收入类型
    getComeValue(): Observable<any> {
        const url = `${preApi}cometype`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 支出类型一级
    getOut1Value(): Observable<any> {
        const url = `${preApi}outype1`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 支出类型二级
    getOut2Value(id: number): Observable<any> {
        const url = `${preApi}outype2/${id}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 币种类型一级
    getMoney1Value(): Observable<any> {
        const url = `${preApi}moneyTypes`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 币种类型二级
    getMoney2Value(id: number): Observable<any> {
        const url = `${preApi}banks/${id}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 币种类型二级
    getMoney2ByType(type: number): Observable<ObjTpye> {
        const url = `${preApi}banksByType/${type}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 单 删收入、支出列表项
    delPayInListItem(id: number): Observable<ObjTpye> {
        const url = `${preApi}del_listPayIncome/${id}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 批 删收入、支出列表项
    delPayInListItems(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}delAll_listPayIncome`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 帐目列表
    getListAcc(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}listAccounts`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 单 删帐目列表项
    delAccListItem(id: number): Observable<ObjTpye> {
        const url = `${preApi}listAccounts/del/${id}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 批 删帐目列表项
    delAccListItems(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}listAccounts/delAll`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 统计列表
    getListStatistics(obj: ObjTpye = {}): Observable<any> {
        const url = `${preApi}listStatistics`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 统计列表弹窗内容获取：收入
    getStatisticsPopCome(date: string): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/shouru/${date}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 统计列表弹窗内容获取：支出
    getStatisticsPopPay(date: string): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/zhichu/${date}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 统计列表弹窗内容获取：账户余额
    getStatisticsPopResumm(date: string): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/z_cha_e/${date}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 统计列表弹窗内容获取：账户差额
    getStatisticsPopResum(date: string): Observable<ObjTpye> {
        const url = `${preApi}listStatistics/yu_e/${date}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 卡号列表
    getListCards(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}cards`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 删除卡号
    delCard(id: number, obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}cards/del/${id}`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 添加卡号
    addCard(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}cards/add`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 编辑卡号
    updateCard(id: number, obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}cards/edit/${id}`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 获取收入/支出 详情
    getDetailPayCome(id: number): Observable<ObjTpye> {
        const url = `${preApi}detail/${id}`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 提交收入/支出 详情编辑
    updateDetailPayCome(id: number, obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}detail/update/${id}`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 添加收入/支出 详情
    addDetailPayCome(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}detail/add`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 获取帐目 详情
    getDetailAccounts(id: number): Observable<ObjTpye> {
        const url = `${preApi}accounts/${id}`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 提交帐目 详情编辑
    updateDetailAccounts(id: number, obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}accounts/update/${id}`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 添加帐目 详情
    addDetailAccounts(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}accounts/add`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 获取所有银行（只是银行）
    getBanksOnly(): Observable<ObjTpye> {
        const url = `${preApi}banksOnly`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 类目编辑： 增、改
    insertOrUpdateStype(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}stype/addOrEdit`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 类目编辑： 删
    deleteStype(obj: ObjTpye = {}): Observable<ObjTpye> {
        const url = `${preApi}stype/del`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：返回读取data_ser文件夹下的文件列表，及data_ser/writeSql.txt的内容mode=？ //  ?:open||close
    getDbFilesInfo(): Observable<ObjTpye> {
        const url = `${preApi}db`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：设置data_ser/writeSql.txt的内容mode=？ //  ?:open||close
    startStopLog(blean: boolean = false): Observable<ObjTpye> {
        const isOpenStr = blean ? 'open' : 'close';
        const url = `${preApi}db/startWriteSql/${isOpenStr}`;
        return this.http.get(url)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：执行sql
    runSql(obj: {[key: string]: any} = {}): Observable<ObjTpye> {
        const url = `${preApi}db/runSql`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：备份
    backupSql(): Observable<ObjTpye> {
        const url = `${preApi}db/backup`;
        // return of({code: 1, msg: 'sssss'}).pipe( delay(5000))
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：删除
    delSqlBackupFiles(obj: {[key: string]: any} = {}): Observable<ObjTpye> {
        const url = `${preApi}db/dels`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // db操作：还原
    restore(name: string): Observable<ObjTpye> {
        const url = `${preApi}db/restore/${name}`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // login：获取验证码
    getVerCode(): Observable<ObjTpye> {
        const url = `${preApi}login/getVerCode`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // login: 登录
    login(obj: {[key: string]: any} = {}): Observable<ObjTpye> {
        const url = `${preApi}login`;
        return this.http.post(url, { ...obj })
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // login: 退出登录
    loginOut(): Observable<ObjTpye> {
        const url = `${preApi}login/loginOut`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 获取当前登录用户信息
    getUerInfo(): Observable<ObjTpye> {
        const url = `${preApi}getUserInfo`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
    // 获取当前登录状态：是否登录
    checkLogin(): Observable<ObjTpye> {
        const url = `${preApi}login/checkLogin`;
        return this.http.get(url, myCacheNoHttpOptions)
        .pipe(
            // tap(_ => console.log(`ajax:获取首页总览`)),
            catchError(this.handleError<any>(`ajax>(${url})`))
        );
    }
}
