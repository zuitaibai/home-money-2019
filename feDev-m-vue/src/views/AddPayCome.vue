<template>
	<div>
		<div class="checker-w">
			<checker v-model="payComeStr" :radio-required="true"  default-item-class="checker-item" selected-item-class="checker-item-selected">
				<checker-item value="Pay">支 出</checker-item><checker-item value="Come">收 入</checker-item>
			</checker>
		</div>
		<actform-pay-come :payComeStr="payComeStr"  addOrEdit="add" @on-component-loaded="checkCompLoads"></actform-pay-come>
		<div v-transfer-dom>
			<popup v-model="showFailPopup" position="bottom" :show-mask="true" :hide-on-blur="false">
				<div class="popup-btm-sty" @click="redirectLogin">组件加载失败，请重新登录</div>
			</popup>
		</div>
	</div>
</template>

<script>
import { local } from "@/config";
const en = 'addPayCome';
const cn = local.pgKey2Cn[en];
import { mapActions, mapState } from "vuex";
import { TransferDom, Popup, Checker, CheckerItem } from 'vux';
import ActformPayCome from '@/components/ActformPayCome.vue';

export default {
	name: en,
	directives: { TransferDom },
	components: { ActformPayCome, Popup, Checker, CheckerItem },
	data(){
		return {
			payComeStr: 'Pay',
			showFailPopup: false,
		};
	},
	methods: {
		...mapActions(['setNavigationTitle', 'setLoading']),
		redirectLogin(){ this.$router.replace('/login'); },
		checkCompLoads(ifLoad){
			this.setLoading({ show: false });
			if(ifLoad) {
				//
			}else {
				this.showFailPopup = true;
			}
		},
	},
	mounted() {
		this.setNavigationTitle(cn);
	},
	created(){
		this.setLoading({ text: '', show: true });
	},
}
</script>

<style scoped lang="less">
.checker-w{
	padding:10px 0;
	text-align: center;
}
.checker-item {
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  padding: 3px 25px;
  line-height: 1.5;
  margin:0 15px;
}
.checker-item-selected {
  border: 1px solid #008000;
  background: #fff url(../assets/gou.png) no-repeat right bottom;
}
.popup-btm-sty{
	background-color: #ffe26d;
	color: #000;
	text-align: center;
	padding: 15px;
	font-size:14px;
	&:active{color:#fff;}
}
</style>

