<template>
    <div class="login">
        <h2 style="text-align:center;padding:30px 0 10px;">欢迎 欢迎 热烈欢迎</h2>
        <div style="padding:15px;" v-if="loginStatus">
            <div class="pic"><img alt="" :src="pic"></div>
            <p style="text-align:center;padding:5px 0 20px;">[ <span class="b">{{user.sname}}</span> ]，您已登录</p>
            <!-- <x-button type="primary" action-type="button" style="height:50px;" link="/index">进入首页</x-button> -->
            <x-button type="primary" action-type="button" style="height:50px;" @click.native="jumpIndex">进入首页</x-button>
            <x-button action-type="button" @click.native="clickLogout" :show-loading="loginOutBtnLoadingVis">登 出</x-button>
        </div>
        <group label-width="5em" title="登录" v-if="!loginStatus" ref="group">
            <x-input
                title="用户名"
                placeholder="必填"
                :required="true"
                v-model="userName"
            ></x-input>
            <x-input
                title="密码"
                type="password"
                placeholder="必填"
                :required="true"
                v-model="userPwd"
            ></x-input>
            <x-input title="验证码" placeholder="必填" :required="true" v-model="userCode" type="number" @keyup.native.enter="clickLogin">
                <x-button
                    slot="right"
                    type="default"
                    action-type="button"
                    :plain="true"
                    :show-loading="getCodeLoadingVis"
                    mini
                    @click.native="getCode"
                >{{loginCode}}</x-button>
            </x-input>
        </group>
        <div style="padding:15px;" v-if="!loginStatus">
            <x-button
                type="primary"
                action-type="submit"
                :show-loading="loginBtnLoadingVis"
                style="height:50px;"
                @click.native="clickLogin"
            >登 录</x-button>
            <x-button action-type="button" @click.native="resetLoginForm">重 置</x-button>
        </div>
        <footer style="text-align:center;color:#ccc;font-size:12px;">家庭账目管理系统v2.1<br>
            Copyright©2017.8-2019.4 [Zjf:node&vue]<br>
            All Rights Reserved(CMS)
        </footer>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { XInput, XButton, Group } from 'vux';
    /* import Group from 'vux/src/components/group/index.vue';
    import XInput from 'vux/src/components/x-input/index.vue';
    import XButton from 'vux/src/components/x-button/index.vue'; */

    import { SS_login_code, SS_login_status } from '@/store/storeVar';
    import pic_male from '../assets/p1.jpg';
    import pic_female from '../assets/p2.jpg';
    import pic_x from '../assets/px.jpg';
    import pic_c from '../assets/chao.png';

    export default {
        name: "login",
        components: {
            XInput, XButton, Group
        },
        data (){
            return {
                loginBtnLoadingVis: false,
                loginOutBtnLoadingVis: false,
                userName: '',
                userPwd: '',
                userCode: '',
            };
        },
        computed: {
            ...mapState('login',[
                'loginStatus',
                'getCodeLoadingVis',
                'loginCode',
                'user'
            ]),
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
            ...mapActions('login',[
                'getCode',
                'checkLogin',
                'login',
                'logout',
            ]),
            jumpIndex(){
                // TODO: 采用$router.method 进入首页期间空白时间相当长
                this.$router.replace('/index');
                // window.location.href = window.location.href.split('login','index');
            },
            resetLoginForm(){
                this.userName = this.userPwd = this.userCode = '';
                let inputs = this.$refs.group.$children;
                this.$nextTick(() =>
                    inputs.forEach(child => child.reset())
                );
                inputs[0].focus();
                this.getCode();
            },
            clickLogin(){
                if(!this.userName || !this.userPwd || !this.userCode){
                    this.$vux.toast.show({ text: '我草，写点东西啊', time: 800 });
                    return;
                }
                const loginO = { username: this.userName, userpwd: this.userPwd, usercode: this.userCode };
                this.loginBtnLoadingVis = true;
                this.login(loginO).then(res=>{
                    this.loginBtnLoadingVis = false;
                    // 如果在上层(service.js)已经被catch捕获了，则res为undefined
                    if(res){
                        if (res.code === 'no') {
                            this.$vux.toast.show({ text: res.err });
                        } else if (res.code === 'ok') {
                            // this.$router.replace('index');
                            // this.$router.push('index');
                            this.jumpIndex();
                        }
                    }
                });
            },
            clickLogout(){
                this.loginOutBtnLoadingVis = true;
                this.logout().then(res => {
                    this.loginOutBtnLoadingVis = false;
                    // 如果在上层(service.js)已经被catch捕获了，则res为undefined
                    if(res) {
                        if(res.code==='no'){
                            this.$vux.toast.show({ text: '退出失败：' + res.err });
                        }
                    }
                });
            },

        },
        created () {
            // console.timeEnd('Login created');console.time('Login beforeMount');
            this.checkLogin(true);
        },
        /* beforeCreate(){ console.warn(`Login beforeCreate== ${new Date()*1}`);console.time('Login created');},

        beforeMount(){ console.timeEnd('Login beforeMount');console.time('Login mounted');},
        mounted(){ console.timeEnd('Login mounted');console.time('Login beforeUpdate');},
        beforeUpdate(){ console.timeEnd('Login beforeUpdate');console.time('Login updated'); },
        updated(){ console.timeEnd('Login updated');console.time('Login beforeDestroy'); },
        beforeDestroy(){ console.timeEnd('Login beforeDestroy');console.time('Login destroyed'); },
        destroyed(){ console.timeEnd('Login destroyed');console.warn(`Login destroyed=@ ${new Date()*1}`); } */
    };

</script>

<style scoped lang="less">
.pic{
    overflow: hidden; border: 1px solid #ccc; border-radius: 50%; margin: 0 auto; width: 60px; height: 60px;
    img { width: 100%; height: 100%; }
}
.login{
    height:100%;background:#fff url('../assets/logo.png') 100% 99% no-repeat;
    animation:loginBg2 4s, loginBg3 2s ease 3s infinite alternate;
}
@keyframes loginBg2{
    0%{background-size:200%;}
    20%{background-size:100%;}
    100%{background-size:auto;}
}
@keyframes loginBg3{
    0%{background-position:100% 99%;}
    100%{background-position:100% 100%;}
}
</style>
