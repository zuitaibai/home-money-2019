import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store/guide';

//axios入口：main.js <- store/guide <- store/home <- store/storeVar <- api/service <- plugins/axios

// 引入ConfirmPlugin目前有如下问题：
// warn: “VUX: 如果你看到这一行，说明 vux-loader 配置有问题或者代码书写规范的原因导致无法解析成按需引入组件，会导致打包体积过大。请升级到最新版本 vux-loader，建议开启 eslint(standard)。”
// vux官网：暂未适配 vue-cli@3.x，请知悉。 （writeTime:2019/5/3）
// 本项目用的是vue-cli3,所以：由于vue-cli3使用的是webpack4而且更新过vue-loader，所以vux使用起来会存在一些兼容的问题
// 官方更新过vue/cli3.x 的vue-loader，正常配置会导致加载错误。所以需要手动指定vue-loader的版本来解决加载问题。
// yarn add vue-loader@14.2.2 -D，所以注意package.json中："vue-loader": "14.2.2"
// import  { ConfirmPlugin/* , LoadingPlugin */, ToastPlugin } from 'vux';
// 先注释上句，以之下方式引用不会出现“**导致打包体积过大”警示
import ToastPlugin from 'vux/src/plugins/toast';
import ConfirmPlugin from 'vux/src/plugins/confirm/index.js';

// import Vue2TouchEvents from 'vue2-touch-events';

// 码源修改：
// 关于x-icon:
// 使用的icon需手动从https://ionicons.com/ 下载svg文件至vux/src/icons/，当前在项目src/addIcons目录中备份了目前所需的ico文件

// 码源修改：
//用css方案 touch-action: manipulation;而不用fastclick,目前还有一些问题：x-input的clear按钮点不上
//fastclick目前也有一些问题，对一些机型的input点击不能获焦 或 报下行错。已修改fastclick源码，prototype.focus方法体内：l:325，修改见下下行
//Uncaught DOMException: Failed to execute 'setSelectionRange' on 'HTMLInputElement': The input element's type ('number') does not support selection.
// 注掉：
		/* if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		} */
// 增加这段，报错没了，但一些机型不能获焦还是没解决，于是也注掉
		/* var useSelectionRange = deviceIsIOS;
		if(useSelectionRange){
			try{
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			}catch(error){
				useSelectionRange = false;
			}
		}
		if (!useSelectionRange) {
			targetElement.focus();
		} */
// 干脆，来这行
//targetElement.focus();

const FastClick = require('fastclick');
FastClick.attach(document.body);

Vue.config.productionTip = false;


Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin, {position: 'middle', width: '12em', type:'text'});
// Vue.use(Vue2TouchEvents, { /* touchClass: '', tapTolerance: 10, swipeTolerance: 30, longTapTimeInterval: 400 */ });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
