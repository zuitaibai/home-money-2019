<template>
    <drawer :show.sync="sideBarVisible" placement="right" show-mode="push" :drawer-style="{width: '150px'}" >
        <div slot="drawer" class="sidebar">
            <div class="sidebar-top">
                <!--TODO: 某些x-icon的size属性不管事: 目前用其class控制 -->
                <span class="ico-link ico-link-logout" @click="btnLoginOut">
                    <x-icon type="md-log-out"></x-icon>
                </span>
                <span class="ico-link ico-link-index" @click="sideBarVisible = false">
                    <router-link exact-active-class="index-cur" to="/index"><x-icon type="md-home"></x-icon></router-link>
                </span>
                <div class="pic"><router-link to="/login"><img alt="" :src="pic"></router-link></div>
            </div>
            <divider>-</divider>
            <div class="navlist" @click="sideBarVisible = false">
                <router-link exact-active-class="cur" to="/addPayCome">
                    <x-icon type="add-add-paycome"></x-icon> <span>{{pWord.addPayCome}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/addAccounts">
                    <x-icon type="add-add-zm"></x-icon> <span>{{pWord.addAccounts}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/listPay">
                    <x-icon type="add-list-pay"></x-icon> <span>{{pWord.listPay}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/listCome">
                    <x-icon type="add-list-come"></x-icon> <span>{{pWord.listCome}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/listAccounts">
                    <x-icon type="add-list-acc"></x-icon> <span>{{pWord.listAccounts}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/listStatistics">
                    <x-icon type="add-list-sta"></x-icon> <span>{{pWord.listStatistics}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/editCategory">
                    <x-icon type="add-eidt-ctg"></x-icon> <span>{{pWord.editCategory}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/db">
                    <x-icon type="add-db"></x-icon> <span>{{pWord.db}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/notes">
                    <x-icon type="add-note"></x-icon> <span>{{pWord.notes}}</span>
                </router-link>
                <router-link exact-active-class="cur" to="/cards">
                    <x-icon type="add-card"></x-icon> <span>{{pWord.cards}}</span>
                </router-link>
            </div>

            <span class="ico-link ico-link-togglebar" @click="sideBarVisible = false;">
                <x-icon type="add-colspan"></x-icon>
            </span>
            <span class="ico-link ico-link-qrcode" @click="qrcodeVisible=!qrcodeVisible">
                <x-icon type="ios-qr-scanner"></x-icon>
            </span>
        </div>
        <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="10px">
            <x-header slot="header" :right-options="{showMore: true}" @on-click-more="sideBarVisible = true"
                style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                {{navigationTitle}}
            </x-header>
            <div class="compage">
                <transition :name="transitionName">
                    <router-view />
                </transition>
            </div>
        </view-box>
        <transition name="slide-left">
            <div class="qrcode-w" v-if="qrcodeVisible">
                <span class="close-qrcode" @click="qrcodeVisible=false"><span class="vux-close"></span></span>
                <qrcode :value="qrcodeUrl" type="img" :size="130" fg-color="rgb(158, 105, 45)"></qrcode>
            </div>
        </transition>
        <div v-transfer-dom>
            <loading :show="loading.show" :text="loading.text"></loading>
        </div>
    </drawer>
</template>

<script>
    // @ is an alias to /src
    import { local } from "@/config";
    import { mapActions, mapState } from 'vuex';
    import { Drawer, XHeader, ViewBox, Divider, Loading, Qrcode, TransferDomDirective as TransferDom } from 'vux';
    /* import Drawer from 'vux/src/components/drawer/index.vue';
    import XHeader from 'vux/src/components/x-header/index.vue';
    import ViewBox from 'vux/src/components/view-box/index.vue';
    import Divider from 'vux/src/components/divider/index.vue';
    import Loading from 'vux/src/components/loading/index.vue';
    import Qrcode from 'vux/src/components/qrcode/index.vue';
    import TransferDom from 'vux/src/directives/transfer-dom/index.js'; */


    import pic_male from '../assets/p1.jpg';
    import pic_female from '../assets/p2.jpg';
    import pic_x from '../assets/px.jpg';
    import pic_c from '../assets/chao.png';

    export default {
        name: "home",
        directives: { TransferDom },
        components: {
            Drawer, XHeader, ViewBox, Divider, Loading, Qrcode
        },
        data() {
            return {
                sideBarVisible: false,
                qrcodeVisible: false,
                // 'fade','jump','slide-left','slide-right','scale-up','scale-down','long-form'
                transitionName: 'jump',
                pWord: local.pgKey2Cn,
                qrcodeUrl: window.location.href,
            };
        },
        watch:{
            sideBarVisible: function (newv, oldv) { if(!newv) this.qrcodeVisible = false; },
        },
        computed: {
            ...mapState(['loading', 'navigationTitle']),
            ...mapState('login', ['user']),
            pic(){
                let pics;
                if(this.user.name==='adminlg') pics = pic_c;
                else if(this.user.name==='admin') pics = pic_male;
                else if(this.user.name==='ydm') pics = pic_female;
                else pics = pic_x;
                return pics;
            },
        },
        methods: {
            ...mapActions(['setLoading']),
            ...mapActions('login', ['logout', 'checkLogin']),
            historyBack() { window.history.length > 1 ? this.$router.go(-1) : this.$router.replace('/'); },
            btnLoginOut() {
                this.$vux.confirm.show({
                    content: '想要退出，你丫确定？',
                    onConfirm : () => {
                        this.setLoading({ text: '我退，我退退退', show: true });
                        this.logout(true).then(res => {
                            this.setLoading({ show: false });
                            // 如果在上层(service.js)已经被catch捕获了，则res为undefined
                            if(res){
                                if(res.code==='ok'){
                                    this.$router.replace('login');
                                }else {
                                    this.$vux.toast.show({ text: '请求出错，退出失败' });
                                }
                            }
                        });
                    }
                });
            },
        },
        beforeRouteUpdate(to, from, next) {
            const toDepth = to.path.split('/').length;
            const fromDepth = from.path.split('/').length;
            let name;
            if(toDepth===fromDepth) name = 'jump';
            else name = toDepth < fromDepth ? 'scale-down' : 'scale-up';
            this.transitionName = name;
            next();
        },
        beforeRouteEnter (to, from, next) {
            next(async vm => {
                if(!to.path.includes('login')){
                    let res = await vm.checkLogin();
                    if(res){
                        if(!res.login) {
                            vm.$router.replace('/login');
                        }
                    }
                }
            });
        },
    };

</script>

<style scoped lang="less">
    .sidebar{
        height: 100%;
        background: url(../assets/logo.png) 100% 96% no-repeat;
        background-size:70%;
        border-left:1px solid #999;
        user-select: none;
    }
    .pic {
        overflow: hidden; border: 1px solid #ccc; border-radius: 50%; margin: 0 auto; width: 60px; height: 60px;
        img { width: 100%; height: 100%; }
    }
    .vux-x-icon{ width: 20px; vertical-align: middle; }
    .ico-link{padding:7px;border-radius:50%;overflow:hidden;
        .vux-x-icon{width:25px;fill:#616161;}
        &:active{
            background:rgba(204,204,204,.3);
            .vux-x-icon{fill:rgb(31, 144, 197);;}
        }
        &.ico-link-logout{
            position: absolute;right:8px;bottom:-16px;
            .vux-x-icon{fill:#8a8a8a;}
        }
        &.ico-link-index{
            position: absolute;left:8px;bottom:-16px;
            .vux-x-icon{fill:#8a8a8a;}
            .index-cur{
                .vux-x-icon{
                    background:#c0c0c0;
                    border-radius: 50%;
                    fill:rgba(0, 159, 252, .7);
                }
            }
        }

        &.ico-link-togglebar{position: absolute;right:8px;bottom:3px;}
        &.ico-link-qrcode{position: absolute;right:50px;bottom:3px;}
    }
    .navlist{
        a {
            padding-left:10px; display: block; line-height: 2.4;
            &:link{color:rgb(31, 144, 197);}
            &:visited{color:rgb(31, 144, 197);}
            &:focus, &:active {background:#ccc;color:rgb(0, 159, 252);}
            &.cur {
                background:#636363;color:#fff;
                .vux-x-icon{fill:rgb(0, 159, 252);}
            }
            .vux-x-icon-add-list-come, .vux-x-icon-add-list-pay{margin:0 2px 0 -2px;}
        }
        svg, span{vertical-align:middle;}
    }
    .sidebar-top{ position: relative;padding:10px 0; }
    .qrcode-w{position: absolute;right:0%;top:30%;padding:15px;background:#fff;z-index: 19999;}
    .close-qrcode{
        position: absolute;left:50%;top:99%;background:#fff;padding:0 3px;transform: translate(-50%, 0);
        border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;
        .vux-close{transform: scale(.8,.7);}
        &:active>.vux-close{color:#000;}
    }
</style>
