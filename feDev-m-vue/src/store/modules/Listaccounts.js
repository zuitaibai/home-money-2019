import {
    Http, SS_listAccounts_list, SS_listAccounts_loadMore, SS_listAccounts_formOptions,
    SS_listAccounts_pagging, SS_listAccounts_del, SS_listAccounts_updateList, SS_listAccounts_updateItem } from '../storeVar';
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

const getType = type => ({'100':'转存', '0':'存根', '1':'借入', '-1':'借出', '2':'还入', '-2':'还出', '3':'生意收入', '-3':'生意投资'}[type]);

const getters = {
    dataList : state => {
        state.list.forEach(item=>{
            let fromto;
            const typeCn = getType(item.type);
            if(item.type==100) fromto = `${item.memberKey_fromName}-${item.memberKey_toName}`; //转存
            else fromto = `[${typeCn}]`;
            item.header = {
                1: item.date_sign,
                2: item.money,
                3: item.name,
                4: fromto
            };
            let listSub = Object.keys(item).filter(key=>{
                return [
                    'name','money','date_sign','id','date_dbCreate','dtype','other'
                ].includes(key);
            }).map(key=>{
                const obj = {
                    name: {t:'名称', o:1},
                    money: {t: '金额', o:2},
                    date_sign: {t: '日期', o:3},
                    id: {t: 'ID', o:11},
                    date_dbCreate: {t: '添加时间', o:12},
                    dtype: {t: '自分类', o:8},
                    other: {t: '备注', o:9},
                };
                const keyCn = obj[key].t;
                const order = obj[key].o;
                return { label: keyCn, value: item[key], order: order };
            });
            listSub.push({label: '类型', value: `[ ${typeCn} ]`, order: 5});
            let ffrom = '----';
            let tto = '----';
            if(item.type==100 || item.type==-1 || item.type==-2 || item.type==-3){
                ffrom=`${item.memberKey_fromName} - ${item.bankTypeKey_fromName} - ${item.bankKey_fromName}`;
                if(item.type==-2 || item.type==-1) tto = item.otherpartyName;
            }
            if(item.type==100 || item.type==0 || item.type==1 || item.type==2 || item.type==3){
                tto = `${item.memberKey_toName} - ${item.bankTypeKey_toName} - ${item.bankKey_toName}`;
                if(item.type==2 || item.type==1) ffrom = item.otherpartyName;
            }
            listSub.push({label: '由哪里', value: ffrom, order: 6});
            listSub.push({label: '至哪里', value: tto , order: 7});
            listSub.sort((a,b)=>a.order - b.order);
            item.transform1 = listSub.slice(0,8);
            item.transform2 = listSub.slice(8);
        });
        return state.list;
    },
};

const actions = {
    _getList({commit, rootState, state }, payload){
        // commit(SS_loading, {show: true, text: ''});
        commit(SS_listAccounts_loadMore, true);
        const formOpts = {...state.formOpts, ...(payload.objs||{})};
        opr_str2num_delEmpty.call(formOpts);
        commit(SS_listAccounts_formOptions, formOpts);
        return Http.getListAcc(formOpts).then(res=>{
            // commit(SS_loading, {show: false, text: ''});
            commit (SS_listAccounts_loadMore, false);
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_listAccounts_list, {data: res.list || [], clear: payload.clear});
                commit(SS_listAccounts_pagging, res.page);
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
        commit(SS_listAccounts_del, 'ing');
        return Http.delAccListItem(id).then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            let result = 'err';
            if(res && res.affectedRows >= 1){
                result = 'ok';
                let index = state.list.findIndex(item=>item.id===id);
                if(index>-1) commit(SS_listAccounts_updateList, index);
            }
            commit(SS_listAccounts_del, result);
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return result;
        });
    },
    // 这个方法不要在store中改名，三个页面vue中有在统一使用
    delAll({commit, state, rootState}, idsArr){
        commit(SS_listAccounts_del, 'ing');
        return Http.delAccListItems(idsArr.join(',')).then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            let result = 'err';
            if(res && res.affectedRows >= 1){
                result = 'ok';
                commit(SS_listAccounts_updateList, idsArr);
            }
            commit(SS_listAccounts_del, result);
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return result;
        });
    },
    clearStoreFormOpts({commit}, payload){
        commit(SS_listAccounts_formOptions, {...defaultFormOpts});
    },
    updateItem({commit}, payload){
        commit(SS_listAccounts_updateItem, payload);
    },
};

const mutations = {
    [SS_listAccounts_list](state, payload){
        if(payload.clear) state.list = payload.data;
        else state.list.push(...payload.data);
    },
    [SS_listAccounts_updateList](state, indexOrIdsArr){
        if(Array.isArray(indexOrIdsArr)) {
            //此处用indexs循环splice会导致在删除的项当中，最后一项在ui中仍然保留
            state.list = state.list.filter(item=> !indexOrIdsArr.some(ii=>ii == item.id));
        }else{
            state.list.splice(indexOrIdsArr, 1);
        }
    },
    [SS_listAccounts_pagging](state, payload){
        state.page = payload;
    },
    [SS_listAccounts_loadMore](state, payload){
        state.loadMoreVis = payload;
    },
    [SS_listAccounts_formOptions](state, payload){
        state.formOpts = payload || {};
    },
    [SS_listAccounts_del](state, payload){
        state.delStatus = payload;
    },
    [SS_listAccounts_updateItem](state, payload){
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