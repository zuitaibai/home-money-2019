import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Index from './views/Index.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/login',
            name: 'login',
            component: () => import( /* webpackChunkName: "login" */ './views/Login.vue').then(m => m.default),
        },
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: '/index',
                    name: 'index',
                    component: Index
                },
                {
                    path: '/listPay',
                    name: 'listPay',
                    component: () => import( /* webpackChunkName: "listPay" */ './views/ListPay.vue').then(m => m.default),
                },
                {
                    path: '/listPay/edit/:id',
                    props: (route) => ({ ID: route.params.id, pathRoot: 'editPay' }),
                    component: () => import( /* webpackChunkName: "editPayCome" */ './views/EditPayCome.vue').then(m => m.default),
                },
                {
                    path: '/listCome',
                    name: 'listCome',
                    component: () => import( /* webpackChunkName: "listCome" */ './views/ListCome.vue').then(m => m.default),
                },
                {
                    path: '/listCome/edit/:id',
                    props: (route) => ({ ID: route.params.id, pathRoot: 'editCome' }),
                    component: () => import( /* webpackChunkName: "editPayCome" */ './views/EditPayCome.vue').then(m => m.default),
                },
                {
                    path: '/listAccounts',
                    name: 'listAccounts',
                    component: () => import( /* webpackChunkName: "listAccounts" */ './views/ListAccounts.vue').then(m => m.default),
                },
                {
                    path: '/listAccounts/edit/:id',
                    name: 'editAccounts',
                    props: (route) => ({ ID: route.params.id }),
                    component: () => import( /* webpackChunkName: "editAccounts" */ './views/EditAccounts.vue').then(m => m.default),
                },
                {
                    path: '/listStatistics',
                    name: 'listStatistics',
                    component: () => import( /* webpackChunkName: "listStatistics" */ './views/ListStatistics.vue').then(m => m.default),
                },
                {
                    path: '/addPayCome',
                    name: 'addPayCome',
                    component: () => import( /* webpackChunkName: "addPayCome" */ './views/AddPayCome.vue').then(m => m.default),
                },
                {
                    path: '/addAccounts',
                    name: 'addAccounts',
                    component: () => import( /* webpackChunkName: "addAccounts" */ './views/AddAccounts.vue').then(m => m.default),
                },
                {
                    path: '/editCategory',
                    name: 'editCategory',
                    component: () => import( /* webpackChunkName: "editCategory" */ './views/EditCategory.vue').then(m => m.default),
                },
                {
                    path: '/db',
                    name: 'db',
                    component: () => import( /* webpackChunkName: "db" */ './views/Db.vue').then(m => m.default),
                },
                {
                    path: '/cards',
                    name: 'cards',
                    component: () => import( /* webpackChunkName: "cards" */ './views/Cards.vue').then(m => m.default),
                },
                {
                    path: '',
                    redirect: '/index',
                    // component: Index,
                }
            ]
        },

    ]
});
