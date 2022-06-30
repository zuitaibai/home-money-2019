import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store/guide';
// import FastClick from 'fastclick';

//1. axios入口：main.js <- store/guide <- store/home <- store/storeVar <- api/service <- plugins/axios

//2. 引入ConfirmPlugin目前有如下问题：
// warn: “VUX: 如果你看到这一行，说明 vux-loader 配置有问题或者代码书写规范的原因导致无法解析成按需引入组件，会导致打包体积过大。请升级到最新版本 vux-loader，建议开启 eslint(standard)。”
// vux官网：暂未适配 vue-cli@3.x，请知悉。 （writeTime:2019/5/3）
// 本项目用的是vue-cli3,所以：由于vue-cli3使用的是webpack4而且更新过vue-loader，所以vux使用起来会存在一些兼容的问题
// 官方更新过vue/cli3.x 的vue-loader，正常配置会导致加载错误。所以需要手动指定vue-loader的版本来解决加载问题。
// yarn add vue-loader@14.2.2 -D，所以注意package.json中："vue-loader": "14.2.2"
// import  { ConfirmPlugin/* , LoadingPlugin */, ToastPlugin } from 'vux';
// 先注释上句，以之下方式引用不会出现“**导致打包体积过大”警示
import ToastPlugin from 'vux/src/plugins/toast';
import ConfirmPlugin from 'vux/src/plugins/confirm/index.js';

import Vue2TouchEvents from 'vue2-touch-events';

//// 关于x-icon:
//3. 码源修改：
// 使用的icon需手动从https://ionicons.com/ 下载svg文件至vux/src/icons/，当前在项目src/addIcons目录中备份了目前所需的ico文件


//4.
////关于点击
    ///现已采用Vue2TouchEvents。故以下css方案和fastclick已弃用。fastclick码源也可以不用改了。added: 2021.11.24
    ///vue2touchevents已由2.0.0升为3.2.2，目前测试中好使，应该是它自己解决了（之前用的不行，忘了为啥了）added: 2021.11.24

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



// FastClick.attach(document.body);



//5. 另见src\components\ListTable.vue中的“码源修改”

//6.
////关于组件库vux：
//使用import { a, b, c, d } from 'vux' :=>a方式，build时据说会把vux全量拉入。
//因此尝试使用 import XazYce from 'vux/src/components/xaz-yce/index.vue' :=>b方式，以下是这种方式本站各页面所用到的全集合：
    /*
        import Group from 'vux/src/components/group/index.vue';
        import XInput from 'vux/src/components/x-input/index.vue';
        import PopupPicker from 'vux/src/components/popup-picker/index.vue';
        import PopupRadio from 'vux/src/components/popup-radio/index.vue';
        import Calendar from 'vux/src/components/calendar/index.vue';
        import XTextarea from 'vux/src/components/x-textarea/index.vue';
        import XButton from 'vux/src/components/x-button/index.vue';
        import dateFormat from 'vux/src/tools/date/format.js';
        import Popup from 'vux/src/components/popup/index.vue';
        import TransferDom from 'vux/src/directives/transfer-dom/index.js';
        import Cell from 'vux/src/components/cell/index.vue';
        import CellFormPreview from 'vux/src/components/cell-form-preview/index.vue';
        import LoadMore from 'vux/src/components/load-more/index.vue';
        import Datetime from 'vux/src/components/datetime/index.vue';
        import XNumber from 'vux/src/components/x-number/index.vue';
        import CellBox from 'vux/src/components/cell-box/index.vue';
        import {Checker, CheckerItem} from 'vux/src/components/checker/index.js';
        import {Swipeout, SwipeoutItem, SwipeoutButton} from 'vux/src/components/swipeout/index.js';
        import CellFormPreview from 'vux/src/components/cell-form-preview/index.vue';
        import CheckIcon from 'vux/src/components/check-icon/index.vue';
        import Sticky from 'vux/src/components/sticky/index.vue';
        import TransferDom from 'vux/src/directives/transfer-dom/index.js';
        import {Swiper, SwiperItem} from 'vux/src/components/swiper/index.js';
        import Divider from 'vux/src/components/divider/index.vue';
        import {Flexbox, FlexboxItem} from 'vux/src/components/flexbox/index.js';
        import Drawer from 'vux/src/components/drawer/index.vue';
        import XHeader from 'vux/src/components/x-header/index.vue';
        import ViewBox from 'vux/src/components/view-box/index.vue';
        import Loading from 'vux/src/components/loading/index.vue';
        import Qrcode from 'vux/src/components/qrcode/index.vue';
        import Card from 'vux/src/components/card/index.vue';
        import VChart from 'vux/src/components/v-chart/v-chart.vue';
        import VTooltip from 'vux/src/components/v-chart/v-tooltip.vue';
        import VLegend from 'vux/src/components/v-chart/v-legend.vue';
        import VBar from 'vux/src/components/v-chart/v-bar.vue';
        import VPie from 'vux/src/components/v-chart/v-pie.vue';
    */
//此种方式有一些组件没有正常，说明引入的地址及命名及该package内的导出有些是不一致的，还没有细查。大致试了下，好像dev本地时正常，prod时就不正常了，但不确定。
//经测使用a方式和b方式build出来的文件大小差不多。说明没有全量拉入。因此，又把各页下的引入方式变回成a方式。


////7 码源修改：
// @表现是：在选择支出类别时，选择 居家物业->居家百货 选完会显示 居家物业->行车交通 致表象错乱，在选择收入币种时也有此类问题。
// @针对原理：vux的popup-picker组件，如具层级的数据：[
//      {name:'a1', value:3, parent:0},  //一层数据 id:3
//      {name:'a2', value:2, parent:0},  //一层数据 id:3
//      {name:'b1', value:3, parent:2},  //二层数据 id:3, 父id:2 (另一个表中，故id也是从1开始的，所以和一级的id有复合)
//      {name:'b2', value:2, parent:3},  //二层数据 id:2, 父id:3 (另一个表中，故id也是从1开始的，所以和一级的id有复合)
// ]，则此组件在找name时，如找第一项的name也许会找到第三项上因value也是3（具体实现是：调用组件内导入的value2name函数）
// @暴力修改：没有考虑popup-picker组件或说value2name函数的全局通用情况(大体一想应该不太有问题)，直接在node_modules/vux/src/filters/value2name.js中修改：
// 大约在12行 let rs=map(value, (one, index) => {//这个体内：
// 由：
    /*if (list.length && Object.prototype.toString.call(list[0]) === '[object Array]') {
      return find(list[index], item => {
        return item.value === one
      })
    } else {
      return find(list, item => {
        return item.value === one
      })
    }*/
// 改为：
    /*if (list.length && Object.prototype.toString.call(list[0]) === '[object Array]') {
        return find(list[index], item => {
            return item.value === one
        })
    } else {
        return find(list, item => {
            // return item.value === one /////////更改处：此句注掉，新加下两句
            if(index === 0) return item.value === one && item.parent == 0;
            return item.value === one && item.parent != 0;
        })
    }*/
//}


Vue.config.productionTip = false;


Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin, {position: 'middle', width: '12em', type:'text'});
Vue.use(Vue2TouchEvents, { /* touchClass: '', tapTolerance: 10, swipeTolerance: 30, longTapTimeInterval: 400 */ });

Vue.prototype.$devicePixelRatio = 2;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
