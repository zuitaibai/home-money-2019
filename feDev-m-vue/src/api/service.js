import Vue from 'vue';
import { ajax } from '../plugins/axios';
import { preApi } from '../config';

const handleError = (er, url, mothed) => {
    // TODO: 如果项目中有用到axios的取消请求的话，请在此方法中识别, 不要在页面中弹出toast
    //[关联1] 如果以上被ok，也删掉views/Db.vue中的一行注释：//[关联1]...
    const { config, request, response } = er;
    const { status, statusText } = response || {};
    const toast = Vue.$vux.toast;
    if(!toast.isVisible()) toast.show({ text: `请求出错[${status}]: <br>${statusText}`});
    console.log( `AjaxError: ============`);
    console.log( `\t-----config: `);
    console.log(config);
    console.log( `\t-----request: `);
    console.log(request);
    console.log( `\t-----response: `);
    console.log(response);
    console.log( `:endAjaxError ==================================`);
};
const aGet = url => ajax.get(url).catch(err=>handleError(err,url,'get'));
const aPost = (url, opt={}) => ajax.post(url, opt).catch(err=>handleError(err, url, 'post'));

export class ApiService {
    // 首页数据块 总览
    static getIndexTotal(obj) {
        const url = `${preApi}listStatistics`;
        return aPost(url, obj);
    }
    // 首页数据块 支出
    static getZhichu(dateStr = new Date().getFullYear()) {
        const url = `${preApi}listStatistics/zhichu/${dateStr}`;
        return aGet(url);
    }
    // 首页数据块 收入
    static getShouru(dateStr = new Date().getFullYear()) {
        const url = `${preApi}listStatistics/shouru/${dateStr}`;
        return aGet(url);
    }
    // 首页数据块 余额
    static getYuE(dateStr = new Date().getFullYear()) {
        const url = `${preApi}listStatistics/yu_e/${dateStr}`;
        return aGet(url);
    }
    // 支出列表
    static getListPay(obj) {
        const url = `${preApi}listPay`;
        return aPost(url, obj);
    }
    // 收入列表
    static getListCome(obj) {
        const url = `${preApi}listCome`;
        return aPost(url, obj);
    }
    // 列表页查询头 控件初始 : outtype1Key\bankTypeKey\memberKey\for_from_memberKey
    static getInitControlValue() {
        const url = `${preApi}listPay`;
        return aGet(url);
    }
    // 列表页查询头 控件初始 : intypeKey
    static getIntypeKeyControlValue() {
        const url = `${preApi}listCome`;
        return aGet(url);
    }
    // 成员类型
    static getMemberValue() {
        const url = `${preApi}member`;
        return aGet(url);
    }
    // 收入类型
    static getComeValue() {
        const url = `${preApi}cometype`;
        return aGet(url);
    }
    //币种类型一二级全部
    static getMoneyTypeAll() {
        const url = `${preApi}moneyTypeAll`;
        return aGet(url);
    }
    //支出类型一二级全部
    static getOutTypeAll() {
        const url = `${preApi}outypeAll`;
        return aGet(url);
    }
    // 支出类型一级
    static getOut1Value() {
        const url = `${preApi}outype1`;
        return aGet(url);
    }
    // 支出类型二级
    static getOut2Value(id) {
        const url = `${preApi}outype2/${id}`;
        return aGet(url);
    }
    // 币种类型一级
    static getMoney1Value() {
        const url = `${preApi}moneyTypes`;
        return aGet(url);
    }
    // 币种类型二级
    static getMoney2Value(id) {
        const url = `${preApi}banks/${id}`;
        return aGet(url);
    }
    // 币种类型二级
    static getMoney2ByType(type) {
        const url = `${preApi}banksByType/${type}`;
        return aGet(url);
    }
    // 单 删收入、支出列表项
    static delPayInListItem(id) {
        const url = `${preApi}del_listPayIncome/${id}`;
        return aGet(url);
    }
    // 批 删收入、支出列表项
    static delPayInListItems(strIds) {
        const url = `${preApi}delAll_listPayIncome`;
        return aPost(url, {ids: strIds});
    }
    // 帐目列表
    static getListAcc(obj) {
        const url = `${preApi}listAccounts`;
        return aPost(url, obj);
    }
    // 单 删帐目列表项
    static delAccListItem(id) {
        const url = `${preApi}listAccounts/del/${id}`;
        return aGet(url);
    }
    // 批 删帐目列表项
    static delAccListItems(strIds) {
        const url = `${preApi}listAccounts/delAll`;
        return aPost(url, {ids: strIds});
    }
    // 统计列表
    static getListStatistics(obj) {
        const url = `${preApi}listStatistics`;
        return aPost(url, obj);
    }
    // 统计列表弹窗内容获取：收入
    static getStatisticsPopCome(date) {
        const url = `${preApi}listStatistics/shouru/${date}`;
        return aGet(url);
    }
    // 统计列表弹窗内容获取：支出
    static getStatisticsPopPay(date) {
        const url = `${preApi}listStatistics/zhichu/${date}`;
        return aGet(url);
    }
    // 统计列表弹窗内容获取：账户差额
    static getStatisticsPopResumm(date) {
        const url = `${preApi}listStatistics/z_cha_e/${date}`;
        return aGet(url);
    }
    // 统计列表弹窗内容获取：账户余额
    static getStatisticsPopResum(date) {
        const url = `${preApi}listStatistics/yu_e/${date}`;
        return aGet(url);
    }
    // 卡号列表
    static getListCards(obj) {
        const url = `${preApi}cards`;
        return aPost(url, obj);
    }
    // 删除卡号
    static delCard(id, obj={}) {
        const url = `${preApi}cards/del/${id}`;
        return aPost(url, obj);
    }
    // 添加卡号
    static addCard(obj) {
        const url = `${preApi}cards/add`;
        return aPost(url, obj);
    }
    // 编辑卡号
    static updateCard(id, obj) {
        const url = `${preApi}cards/edit/${id}`;
        return aPost(url, obj);
    }
    // 获取收入/支出 详情
    static getDetailPayCome(id) {
        const url = `${preApi}detail/${id}`;
        return aGet(url);
    }
    // 提交收入/支出 详情编辑
    static updateDetailPayCome(id, obj) {
        const url = `${preApi}detail/update/${id}`;
        return aPost(url, obj);
    }
    // 添加收入/支出 详情
    static addDetailPayCome(obj) {
        const url = `${preApi}detail/add`;
        return aPost(url, obj);
    }
    // 获取帐目 详情
    static getDetailAccounts(id) {
        const url = `${preApi}accounts/${id}`;
        return aGet(url);
    }
    // 提交帐目 详情编辑
    static updateDetailAccounts(id, obj) {
        const url = `${preApi}accounts/update/${id}`;
        return aPost(url, obj);
    }
    // 添加帐目 详情
    static addDetailAccounts(obj) {
        const url = `${preApi}accounts/add`;
        return aPost(url, obj);
    }
    // 获取所有银行（只是银行）
    static getBanksOnly() {
        const url = `${preApi}banksOnly`;
        return aGet(url);
    }
    // 类目编辑： 增、改
    static insertOrUpdateStype(obj) {
        const url = `${preApi}stype/addOrEdit`;
        return aPost(url, obj);
    }
    // 类目编辑： 删
    static deleteStype(obj) {
        const url = `${preApi}stype/del`;
        return aPost(url, obj);
    }
    // db操作：返回读取data_ser文件夹下的文件列表，及data_ser/writeSql.txt的内容mode=？ //  ?:open||close
    static getDbFilesInfo() {
        const url = `${preApi}db`;
        return aGet(url);
    }
    // db操作：设置data_ser/writeSql.txt的内容mode=？ //  ?:open||close
    static startStopLog(blean = false) {
        const isOpenStr = blean ? 'open' : 'close';
        const url = `${preApi}db/startWriteSql/${isOpenStr}`;
        return aGet(url);
    }
    // db操作：执行sql
    static runSql(obj = {}) {
        const url = `${preApi}db/runSql`;
        return aPost(url, obj);
    }
    // db操作：备份
    static backupSql() {
        const url = `${preApi}db/backup`;
        // return of({code: 1, msg: 'sssss'}).pipe( delay(5000))
        return aGet(url);
    }
    // db操作：删除
    static delSqlBackupFiles(obj = {}) {
        const url = `${preApi}db/dels`;
        return aPost(url, obj);
    }
    // db操作：还原
    static restore(name) {
        const url = `${preApi}db/restore/${name}`;
        return aGet(url);
    }
    // login：获取验证码
    static getVerCode() {
        const url = `${preApi}login/getVerCode`;
        return aGet(url);
    }
    // login: 登录
    static login(obj = {}) {
        const url = `${preApi}login`;
        return aPost(url, obj);
    }
    // login: 退出登录
    static loginOut() {
        const url = `${preApi}login/loginOut`;
        return aGet(url);
    }
    // 获取当前登录用户信息
    static getUerInfo() {
        const url = `${preApi}getUserInfo`;
        return aGet(url);
    }
    // 获取当前登录状态：是否登录
    static checkLogin() {
        const url = `${preApi}login/checkLogin`;
        return aGet(url);
    }

    // 记事列表
    static getListNotes(obj) {
        const url = `${preApi}notes`;
        return aPost(url, obj);
    }
    // 删除记事
    static delNote(id, obj={}) {
        const url = `${preApi}notes/del/${id}`;
        return aPost(url, obj);
    }
    // 添加记事
    static addNote(obj) {
        const url = `${preApi}notes/add`;
        return aPost(url, obj);
    }
    // 编辑记事
    static updateNote(id, obj) {
        const url = `${preApi}notes/edit/${id}`;
        return aPost(url, obj);
    }
}

Object.defineProperties(Vue.prototype, {
    http: {
        get() { return ApiService;}
    }
});
