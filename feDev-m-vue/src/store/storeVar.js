import  { ApiService as Http }  from '../api/service';
export  { Http };

//目前所有store内的写操作全都采取的action方式，故*.vue中没有直接用mutations的commit方式，将各actionType在各自的store中内操作
//因而此文件的各声明完全可以并入各store文件中，而不用export import。
const SS_navigationTitle = 'NAVIGATIONTITLE';
const SS_loading = 'LOADING';
const SS_stickyChange = 'STICKYCHANGE';

const SS_login_status = 'LOGIN_STATUS';
const SS_login_code = 'LOGIN_CODE';
const SS_login_codeBtnLoading = 'LOGIN_CODEBTNLOADING';
const SS_login_user = 'LOGIN_USER';

const SS_listPay_list  = 'LISTPAY_LIST';
const SS_listPay_updateList  = 'LISTPAY_UPDATELIST';
const SS_listPay_pagging  = 'LISTPAY_PAGGING';
const SS_listPay_loadMore = 'LISTPAY_LOADMORE';
const SS_listPay_formOptions = 'LISTPAY_FORMOPTIONS';
const SS_listPay_del = 'LISTPAY_DEL';
const SS_listPay_updateItem = 'LISTPAY_UPDATEITEM';

const SS_listCome_list  = 'LISTCOME_LIST';
const SS_listCome_updateList  = 'LISTCOME_UPDATELIST';
const SS_listCome_pagging  = 'LISTCOME_PAGGING';
const SS_listCome_loadMore = 'LISTCOME_LOADMORE';
const SS_listCome_formOptions = 'LISTCOME_FORMOPTIONS';
const SS_listCome_del = 'LISTCOME_DEL';
const SS_listCome_updateItem = 'LISTCOME_UPDATEITEM';

const SS_listAccounts_list  = 'LISTACCOUNTS_LIST';
const SS_listAccounts_updateList  = 'LISTACCOUNTS_UPDATELIST';
const SS_listAccounts_pagging  = 'LISTACCOUNTS_PAGGING';
const SS_listAccounts_loadMore = 'LISTACCOUNTS_LOADMORE';
const SS_listAccounts_formOptions = 'LISTACCOUNTS_FORMOPTIONS';
const SS_listAccounts_del = 'LISTACCOUNTS_DEL';
const SS_listAccounts_updateItem = 'LISTACCOUNTS_UPDATEITEM';

const SS_listStatistics_list  = 'LISTSTATISTICS_LIST';
const SS_listStatistics_pagging  = 'LISTSTATISTICS_PAGGING';
const SS_listStatistics_formOptions = 'LISTSTATISTICS_FORMOPTIONS';
const SS_listStatistics_total = 'LISTSTATISTICS_TOTAL';
const SS_listStatistics_pop_shouru = 'LISTSTATISTICS_POP_SHOURU';
const SS_listStatistics_pop_zhichu = 'LISTSTATISTICS_POP_ZHICHU';
const SS_listStatistics_pop_z_cha_e = 'LISTSTATISTICS_POP_ZCHAE';
const SS_listStatistics_pop_yu_e = 'LISTSTATISTICS_POP_YUE';
const SS_listStatistics_pop_show = 'LISTSTATISTICS_POP_SHOW';



export {
    SS_navigationTitle,
    SS_loading,
    SS_stickyChange,
    SS_login_status,
    SS_login_code,
    SS_login_codeBtnLoading,
    SS_login_user,
    SS_listPay_list,
    SS_listPay_updateList,
    SS_listPay_pagging,
    SS_listPay_loadMore,
    SS_listPay_formOptions,
    SS_listPay_del,
    SS_listPay_updateItem,
    SS_listCome_list,
    SS_listCome_updateList,
    SS_listCome_pagging,
    SS_listCome_loadMore,
    SS_listCome_formOptions,
    SS_listCome_del,
    SS_listCome_updateItem,
    SS_listAccounts_list,
    SS_listAccounts_updateList,
    SS_listAccounts_pagging,
    SS_listAccounts_loadMore,
    SS_listAccounts_formOptions,
    SS_listAccounts_del,
    SS_listAccounts_updateItem,
    SS_listStatistics_list,
    SS_listStatistics_pagging,
    SS_listStatistics_formOptions,
    SS_listStatistics_total,
    SS_listStatistics_pop_shouru,
    SS_listStatistics_pop_zhichu,
    SS_listStatistics_pop_z_cha_e,
    SS_listStatistics_pop_yu_e,
    SS_listStatistics_pop_show,
};