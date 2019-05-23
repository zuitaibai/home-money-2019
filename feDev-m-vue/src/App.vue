<template>
    <transition name="fade" mode="out-in">
        <router-view />
    </transition>
</template>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';
html{ touch-action: manipulation; }
html, body{height: 100%; overflow-x: hidden;}
a:focus{outline: none;}
.tc{text-align: center;}
.tr{text-align: right;}
.b{font-weight: bold;}
.compage{width:96%;margin:0 1% 0 3%;}
p{margin:0;padding:0;}
.fix{
    &:after{content:'';display:table;clear: both;}
}
.jufy{
    text-align: justify; text-align-last:justify;
    &:after{content: ''; display:inline-block;width:100%;visibility: hidden;}
}
.l{float:left;}
.r{float:right;}

.fade-enter-active,.fade-leave-active{transition: opacity .3s}.fade-enter,.fade-leave-to,.fade-leave-active{opacity: 0}

.jump-enter-active{animation:jump .2s}.jump-leave-active{animation:jump .2s reverse}
@keyframes jump{0%{transform:translateY(10px)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}

.slide-left-enter-active{ animation: slideLeft .2s; } .slide-left-leave-active { animation: slideLeft .2s reverse; }
@keyframes slideLeft { 0% { transform: translate3d(30px, 0, 0); } 70% { transform: translate3d(-5px, 0, 0); } 100% { transform: translate3d(0px, 0, 0); } }

.slide-right-enter-active{ animation: slideRight .2s; } .slide-right-leave-active { animation: slideRight .2s reverse; }
@keyframes slideRight { 0% { transform: translate3d(-30px, 0, 0); } 70% { transform: translate3d(5px, 0, 0); } 100% { transform: translate3d(0px, 0, 0); } }

.scale-up-enter-active { animation: scaleUp .2s; } .scale-up-leave-active { animation: scaleUp .2s reverse; }
@keyframes scaleUp { 0% { transform: scale3D(1, 1, 1); } 50% { transform: scale3D(1.2, 1.2, 1.2); } 100% { transform: scale3D(1, 1, 1); } }

.scale-down-enter-active { animation: scaleDown .2s; } .scale-down-leave-active { animation: scaleDown .2s reverse; } @keyframes scaleDown { 0% { transform: scale3D(1.2, 1.2, 1.2); } 50% { transform: scale3D(0.8, 0.8, 0.8); } 100% { transform: scale3D(1, 1, 1); } }

.long-form-enter-active { transition: all .2s ease; } .long-form-leave-active { transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0); } .long-form-enter, .long-form-leave-to{ border-right: solid 1px #ddd !important; opacity: 0; transform: scaleX(0px); }
</style>
