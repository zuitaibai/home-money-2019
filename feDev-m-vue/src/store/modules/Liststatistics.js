import {
    Http, 
    SS_listStatistics_list, SS_listStatistics_formOptions, SS_listStatistics_pagging, SS_listStatistics_total, SS_loading,
    SS_listStatistics_pop_shouru, SS_listStatistics_pop_zhichu, SS_listStatistics_pop_z_cha_e, SS_listStatistics_pop_yu_e, SS_listStatistics_pop_show
} from '../storeVar';
import { defaultPageSize } from '../../config';
import opr_str2num_delEmpty from '../opr_str2num_delEmpty';

const defaultFormOpts = {currentPage: 1, pageSize: defaultPageSize};
const defaultTotal = { cha_e: 0, cungen: 0, huanchu: 0, huanru: 0, jiechu: 0, jieru: 0, shengyi_shouru: 0, shengyi_touzi: 0, shouru: 0, yu_e: 0, z_cha_e: 0, zhichu: 0 };

const state = {
    list: [],
    page: {
        totalRecord: 0,
        currentPage: 1,
        pageCount: 0,
        pageSize: 1,
    },
    formOpts: {
        ...defaultFormOpts
    },
    total: {
        ...defaultTotal
    },
    pop: {
        show: false,
        shouru: {
            bizhongList: [],
            typeList: [],
            xuniXianjin: { forMemberName: '', xianjin: 0, xuni: 0 },
        },
        zhichu: {
            bizhongList: [],
            forMemberList: [],
            isOughtNotPay: 0,
            typeList: [],
            xuniXianjin: { xianjin: 0, xuni: 0 },
        },
        //以下两项格式：{"老公":[{"bankTypeName":"网络资产","bankName":"支付宝","money":-22}], "老婆":[{"bankTypeName":"网络资产","bankName":"支付宝","money":-66}]}
        z_cha_e: {},
        yu_e: {}
    },
};

const getters = {
    pop: state => {
        const pop = state.pop;
        pop.shouru.bizhongList.sort((a,b)=>{
            const s = a.memberKey - b.memberKey;
            if(s===0) return a.bankTypeKey - b.bankTypeKey;
            return s;
        });
        pop.zhichu.bizhongList.sort((a,b)=>{
            const s = a.memberKey - b.memberKey;
            if(s===0) return a.bankTypeKey - b.bankTypeKey;
            return s;
        });
        pop.zhichu.forMemberList.sort((a,b)=>a.for_from_memberKey - b.for_from_memberKey);
        Object.keys(pop.yu_e).forEach(key=>{
            //去0处理
            /* {
                张三: [
                    {**: '信用卡', ***: '交通', money:3332},
                    {**: '借记卡', ***: '建行', money:0},
                    {**: '现金', ***: '现金', money:2983}
                ]
            }*/
            let arr = pop.yu_e[key].filter(item=>item.money!=0);
            pop.yu_e[key]=arr;
            if(arr.length===0) delete pop.yu_e[key];
        });
        Object.keys(pop.yu_e).forEach(key=>{
            pop.yu_e[key].sort((a,b)=>{
                const arr = ['现金','网络资产','借记卡','信用卡','其它'];
                return arr.indexOf(a.bankTypeName) - arr.indexOf(b.bankTypeName);
            });
        });
        Object.keys(pop.z_cha_e).forEach(key=>{
            //去0处理
            const arr = pop.z_cha_e[key].filter(item=>item.money!=0);
            //加+号
            arr.forEach(item=>{
                if(item.money>0) item.money = '+'+item.money;
            });
            pop.z_cha_e[key]=arr;
            if(arr.length===0) delete pop.z_cha_e[key];
        });
        Object.keys(pop.z_cha_e).forEach(key=>{
            pop.z_cha_e[key].sort((a,b)=>{
                const arr = ['现金','网络资产','借记卡','信用卡','其它'];
                return arr.indexOf(a.bankTypeName) - arr.indexOf(b.bankTypeName);
            });
        });
        return pop;
    },
    list: state => {
        state.list.forEach(item=>{
            let  dateShort  = item.date;
            if(dateShort && dateShort.length===10) dateShort = dateShort.slice(2); //2019-10-24 => 19-10-24
            item.dateShort = dateShort;
        });
        return state.list;
    },
};

const requestMap = {
    'shouru': 'getStatisticsPopCome',
    'zhichu': 'getStatisticsPopPay',
    'z_cha_e': 'getStatisticsPopResumm',
    'yu_e': 'getStatisticsPopResum',
};
const typeMap = {
    'shouru': SS_listStatistics_pop_shouru,
    'zhichu': SS_listStatistics_pop_zhichu,
    'z_cha_e': SS_listStatistics_pop_z_cha_e,
    'yu_e': SS_listStatistics_pop_yu_e,
};

const actions = {
    getPop({commit, rootState, state }, payload={}){
        let {str, date} = payload;
        commit(SS_loading, {show: true, text: ''}, {root: true});
        return Http[requestMap[str]](date).then(res=>{
            commit(SS_loading, {show: false, text: ''}, {root: true});
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_listStatistics_pop_show, true);
                commit(typeMap[str], res);
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    closePop({commit}, payload){
        commit(SS_listStatistics_pop_show, false);
    },
    _getList({commit, rootState, state }, payload){
        commit(SS_loading, {show: true, text: ''}, {root: true});
        const formOpts = {...state.formOpts, ...(payload.objs||{})};
        opr_str2num_delEmpty.call(formOpts);
        commit(SS_listStatistics_formOptions, formOpts);
        return Http.getListStatistics(formOpts).then(res=>{
            commit(SS_loading, {show: false, text: ''}, {root: true});
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_listStatistics_list, {data: res.listArr || [], clear: payload.clear});
                commit(SS_listStatistics_pagging, res.page);
                commit(SS_listStatistics_total, res.total);
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    getList({dispatch}, payload){
        return dispatch('_getList', {objs: payload, clear: true});
    },
    getListPush({dispatch}, payload){
        return dispatch('_getList', {objs: payload, clear: false});
    },
    clearStoreFormOpts({commit}, payload){
        commit(SS_listStatistics_formOptions, {...defaultFormOpts});
    },
};

const mutations = {
    [SS_listStatistics_list](state, payload){
        if(payload.clear) state.list = payload.data;
        else state.list.push(...payload.data);
    },
    [SS_listStatistics_pagging](state, payload){
        state.page = payload;
    },
    [SS_listStatistics_formOptions](state, payload){
        state.formOpts = payload || {};
    },
    [SS_listStatistics_total](state, payload){
        state.total = payload || { ...defaultTotal };
    },
    [SS_listStatistics_pop_shouru](state, payload){
        state.pop = { ...state.pop,  shouru: payload };
    },
    [SS_listStatistics_pop_zhichu](state, payload){
        state.pop = { ...state.pop,  zhichu: payload };
    },
    [SS_listStatistics_pop_z_cha_e](state, payload){
        state.pop = { ...state.pop,  z_cha_e: payload };
    },
    [SS_listStatistics_pop_yu_e](state, payload){
        state.pop = { ...state.pop,  yu_e: payload };
    },
    [SS_listStatistics_pop_show](state, payload){
        state.pop = { ...state.pop,  show: payload };
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}