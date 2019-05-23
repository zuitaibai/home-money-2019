import { 
    Http, SS_listPay_list, SS_listPay_loadMore, SS_listPay_formOptions, SS_listPay_pagging,
    SS_listPay_del, SS_listPay_updateList, SS_listPay_updateItem
} from '../storeVar';
import { defaultPageSize } from '../../config';
import opr_str2num_delEmpty from '../opr_str2num_delEmpty';

const defaultFormOpts = {currentPage: 1, pageSize: defaultPageSize,};

const state = {
    list: [],
    page: {
        totalRecord: 0,
        currentPage: 1,
        pageCount: 0,
        pageSize: 1,
    },
    loadMoreVis: false,
    formOpts: {
        ...defaultFormOpts
    },
    delStatus: 'init', //ok, err, ing
};

const getters = {
    dataList : state => {
        state.list.forEach(item=>{
            item.header = {
                1: item.date_sign,
                2: item.money,
                3: item.name,
                4: item.memberKeyName
            };
            const outtype = item.outtype1KeyName + '：' + item.outtype2KeyName;
            const moneytype = item.bankTypeKeyName + '：' + item.bankKeyName;
            let listSub = Object.keys(item).filter(key=>{
                return [
                    'name','money','date_sign','memberKeyName','id','date_dbCreate','actOn_memberKey','dtype','other','for_from_memberKeyName'
                ].includes(key);
            }).map(key=>{
                const obj = {
                    name: {t:'名称', o:1},
                    money: {t: '金额', o:2},
                    date_sign: {t: '日期', o:3},
                    memberKeyName: {t: '支出账户', o:6},
                    id: {t: 'ID', o:11},
                    date_dbCreate: {t: '添加时间', o:12},
                    for_from_memberKeyName: {t: '消费对象', o:7},
                    actOn_memberKey: {t: '录入人', o:10},
                    dtype: {t: '自分类', o:8},
                    other: {t: '备注', o:9},
                };
                const keyCn = obj[key].t;
                const order = obj[key].o;
                return { label: keyCn, value: item[key], order: order };
            });
            listSub.push({label: '支出类别', value: outtype, order: 4});
            listSub.push({label: '币种', value: moneytype, order: 5});
            listSub.sort((a,b)=>a.order - b.order);
            item.transform1 = listSub.slice(0,9);
            item.transform2 = listSub.slice(9);
        });
        return state.list;
    },
};

const actions = {
    _getList({commit, rootState, state }, payload){
        // commit(SS_loading, {show: true, text: ''});
        commit(SS_listPay_loadMore, true);
        const formOpts = {...state.formOpts, ...(payload.objs||{})};
        opr_str2num_delEmpty.call(formOpts);
        commit(SS_listPay_formOptions, formOpts);
        return Http.getListPay(formOpts).then(res=>{
            // commit(SS_loading, {show: false, text: ''});
            commit (SS_listPay_loadMore, false);
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_listPay_list, {data: res.list || [], clear: payload.clear});
                commit(SS_listPay_pagging, res.page);
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    getList({dispatch}, payload){
        return dispatch('_getList', {objs: payload, clear: true});
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    getListPush({dispatch}, payload){
        return dispatch('_getList', {objs: payload, clear: false});
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    del({commit, state, rootState}, id){
        commit(SS_listPay_del, 'ing');
        return Http.delPayInListItem(id).then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            let result = 'err';
            if(res && res.affectedRows >= 1){
                result = 'ok';
                let index = state.list.findIndex(item=>item.id===id);
                if(index>-1) commit(SS_listPay_updateList, index);
            }
            commit(SS_listPay_del, result);
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return result;
        });
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    delAll({commit, state, rootState}, idsArr){
        commit(SS_listPay_del, 'ing');
        return Http.delPayInListItems(idsArr.join(',')).then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            let result = 'err';
            if(res && res.affectedRows >= 1){
                result = 'ok';
                commit(SS_listPay_updateList, idsArr);
            }
            commit(SS_listPay_del, result);
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return result;
        });
    },
    clearStoreFormOpts({commit}, payload){
        commit(SS_listPay_formOptions, {...defaultFormOpts});
    },
    updateItem({commit}, payload){
        commit(SS_listPay_updateItem, payload);
    },
};

const mutations = {
    [SS_listPay_list](state, payload){
        if(payload.clear) state.list = payload.data;
        else state.list.push(...payload.data);
    },
    [SS_listPay_updateList](state, indexOrIdsArr){
        if(Array.isArray(indexOrIdsArr)) {
            //此处用indexs循环splice会导致在删除的项当中，最后一项在ui中仍然保留
            state.list = state.list.filter(item=> !indexOrIdsArr.some(ii=>ii == item.id));
        }else{
            state.list.splice(indexOrIdsArr, 1);
        }
    },
    [SS_listPay_pagging](state, payload){
        state.page = payload;
    },
    [SS_listPay_loadMore](state, payload){
        state.loadMoreVis = payload;
    },
    [SS_listPay_formOptions](state, payload){
        state.formOpts = payload || {};
    },
    [SS_listPay_del](state, payload){
        state.delStatus = payload;
    },
    [SS_listPay_updateItem](state, payload){
        const itemIndex = state.list.findIndex(item=>item.id===payload.id);
        if(itemIndex!==-1){
            const item = state.list[itemIndex];
            state.list.splice(itemIndex, 1, {...item, ...payload});
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}