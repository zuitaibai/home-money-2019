import { Http, SS_login_status, SS_login_code, SS_login_codeBtnLoading, SS_login_user } from '../storeVar';

// TODO: 此文件由于一开始先写的，后来又加了方法，实现有点乱，有待整理

const userNo = {sname:'', level: 0, name:''};

const state = {
    loginStatus: false,
    getCodeLoadingVis: true,
    loginCode: '',
    user: { ...userNo },
};

const getters = {
    /* loginStatus: state => state.loginStatus,
    getCodeLoadingVis: state => state.getCodeLoadingVis,
    loginCode: state => state.loginCode, 
    user: state => state.user,*/
};

const actions = {
    checkLogin({commit, dispatch}, ifPageIsLoginPage) {
        return Http.checkLogin().then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_login_status, res.login);
                if(res.login) {
                    commit(SS_login_user, res.user);
                }else{
                    commit(SS_login_user, { ...userNo });
                    if(ifPageIsLoginPage) dispatch('getCode');
                }
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    getCode({commit}, payload) {
        commit(SS_login_codeBtnLoading, true);
        return Http.getVerCode().then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_login_code, res.code);
                commit(SS_login_codeBtnLoading, false);
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    setCode({commit}, payload){
        commit(SS_login_code, payload);
    },
    setLoginStatus({commit}, payload){
        commit(SS_login_status, payload);
    },
    getUser({commit}, payload){
        return Http.getUerInfo().then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res!==undefined){
                commit(SS_login_user, res);
            }
            // res: res or undefined 如果下层调用.then，请在.then的第一个回调中判断入参是否为undefined
            return res;
        });
    },
    login({commit}, payload={}){
        return Http.login(payload).then(res=>{
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res){
                if (res.code === 'no') {
                    if (res.ran) {
                        commit(SS_login_code, res.ran);
                        commit(SS_login_status, false);
                        commit(SS_login_user, { ...userNo });
                    }
                } else if (res.code === 'ok') {
                    commit(SS_login_status, true);
                    commit(SS_login_user, res.user);
                }
            }
            return res;
        });
    },
    logout({commit, dispatch}, ifNotLoginPage){
        return Http.loginOut().then(res => {
            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
            if(res) {
                if (res.code === 'ok') {
                    commit(SS_login_status, false);
                    commit(SS_login_user, { ...userNo });
                }
                if(!ifNotLoginPage) dispatch('getCode');
            }
            return res;
        });
    },
};

const mutations = {
    [SS_login_status](state, payload){
        state.loginStatus = payload;
    },
    [SS_login_code](state, payload){
        state.loginCode = payload;
    },
    [SS_login_codeBtnLoading](state, payload){
        state.getCodeLoadingVis = payload
    },
    [SS_login_user](state, payload){
        state.user = payload
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}