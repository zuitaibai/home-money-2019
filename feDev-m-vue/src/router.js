import Vue from 'vue';
import Router from 'vue-router';
// import VueRouter from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);
// Vue.use(VueRouter);

export default new Router({
// export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/login',
            name: 'login',
            component: () => import( /* webpackChunkName: "login" */ './views/Login.vue').then(m => m.default),
            // component: resolve => require(['./views/Login.vue'], resolve)
        },
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: '/index',
                    name: 'index',
                    component: () => import( /* webpackChunkName: "index" */ './views/Index.vue').then(m => m.default),
                    // component: resolve => require(['./views/Index.vue'], resolve)
                },
                {
                    path: '/listPay',
                    name: 'listPay',
                    component: () => import( /* webpackChunkName: "listPay" */ './views/ListPay.vue').then(m => m.default),
                    // component: resolve => require(['./views/ListPay.vue'], resolve)
                },
                {
                    path: '/listPay/edit/:id',
                    props: (route) => ({ ID: route.params.id, pathRoot: 'editPay' }),
                    component: () => import( /* webpackChunkName: "editPayCome" */ './views/EditPayCome.vue').then(m => m.default),
                    // component: resolve => require(['./views/EditPayCome.vue'], resolve)
                },
                {
                    path: '/listCome',
                    name: 'listCome',
                    component: () => import( /* webpackChunkName: "listCome" */ './views/ListCome.vue').then(m => m.default),
                    // component: resolve => require(['./views/ListCome.vue'], resolve)
                },
                {
                    path: '/listCome/edit/:id',
                    props: (route) => ({ ID: route.params.id, pathRoot: 'editCome' }),
                    component: () => import( /* webpackChunkName: "editPayCome" */ './views/EditPayCome.vue').then(m => m.default),
                    // component: resolve => require(['./views/EditPayCome.vue'], resolve)
                },
                {
                    path: '/listAccounts',
                    name: 'listAccounts',
                    component: () => import( /* webpackChunkName: "listAccounts" */ './views/ListAccounts.vue').then(m => m.default),
                    // component: resolve => require(['./views/ListAccounts.vue'], resolve)
                },
                {
                    path: '/listAccounts/edit/:id',
                    name: 'editAccounts',
                    props: (route) => ({ ID: route.params.id }),
                    component: () => import( /* webpackChunkName: "editAccounts" */ './views/EditAccounts.vue').then(m => m.default),
                    // component: resolve => require(['./views/EditAccounts.vue'], resolve)
                },
                {
                    path: '/listStatistics',
                    name: 'listStatistics',
                    component: () => import( /* webpackChunkName: "listStatistics" */ './views/ListStatistics.vue').then(m => m.default),
                    // component: resolve => require(['./views/ListStatistics.vue'], resolve)
                },
                {
                    path: '/addPayCome',
                    name: 'addPayCome',
                    component: () => import( /* webpackChunkName: "addPayCome" */ './views/AddPayCome.vue').then(m => m.default),
                    // component: resolve => require(['./views/AddPayCome.vue'], resolve)
                },
                {
                    path: '/addAccounts',
                    name: 'addAccounts',
                    component: () => import( /* webpackChunkName: "addAccounts" */ './views/AddAccounts.vue').then(m => m.default),
                    // component: resolve => require(['./views/AddAccounts.vue'], resolve)
                },
                {
                    path: '/editCategory',
                    name: 'editCategory',
                    component: () => import( /* webpackChunkName: "editCategory" */ './views/EditCategory.vue').then(m => m.default),
                    // component: resolve => require(['./views/EditCategory.vue'], resolve)
                },
                {
                    path: '/db',
                    name: 'db',
                    component: () => import( /* webpackChunkName: "db" */ './views/Db.vue').then(m => m.default),
                    // component: resolve => require(['./views/Db.vue'], resolve)
                },
                {
                    path: '/cards',
                    name: 'cards',
                    component: () => import( /* webpackChunkName: "cards" */ './views/Cards.vue').then(m => m.default),
                    // component: resolve => require(['./views/Cards.vue'], resolve)
                },
                {
                    path: '/notes',
                    name: 'notes',
                    component: () => import( /* webpackChunkName: "notes" */ './views/Notes.vue').then(m => m.default),
                    // component: resolve => require(['./views/Notes.vue'], resolve)
                },
                /* {
                    path: '',
                    redirect: '/index',
                    // component: Index,
                } */
            ]
        },

    ]
});
