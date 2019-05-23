import { SS_navigationTitle, SS_loading, SS_stickyChange } from './storeVar';

const state = { 
    navigationTitle : '',
    loading: {
        show: false,
        text: ''
    },
    stickyChange: false,
};

const getters = {};

const actions = {
    setNavigationTitle({commit}, payload) {
        commit(SS_navigationTitle, payload)
    },
    setLoading({commit}, payload) {
        commit(SS_loading, payload);
    },
    setStickyChange({commit}, payload) {
        commit(SS_stickyChange, payload);
    },
};

const mutations = {
    [SS_navigationTitle](state,payload){
        state.navigationTitle = payload;
    },
    [SS_loading](state,payload){
        state.loading = payload;
    },
    [SS_stickyChange](state,payload){
        state.stickyChange = payload;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}