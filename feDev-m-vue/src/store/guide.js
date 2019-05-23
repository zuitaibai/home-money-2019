import Vue from 'vue';
import Vuex from 'vuex';
import Home from './Home';
import Login from './modules/Login';
import Index from './modules/Index';
import Listpay from './modules/Listpay';
import Listcome from './modules/Listcome';
import ListAccounts from './modules/Listaccounts';
import ListStatistics from './modules/Liststatistics';

Vue.use(Vuex);

export default new Vuex.Store({
    ...Home,
    modules: {
        login: Login,
        index: Index,
        listPay: Listpay,
        listCome: Listcome,
        listAccounts: ListAccounts,
        listStatistics: ListStatistics,
    }
});