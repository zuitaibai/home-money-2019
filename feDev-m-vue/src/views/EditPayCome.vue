<template>
	<div>
		<actform-pay-come :payComeStr="payOrComeStr" :datas="detailData" @on-component-loaded="checkCompLoads"></actform-pay-come>
		<div v-transfer-dom>
			<popup v-model="showFailPopup" position="bottom" :show-mask="true" :hide-on-blur="false">
				<div class="popup-btm-sty" @click="redirectLogin">组件加载失败，请重新登录</div>
			</popup>
		</div>
	</div>
</template>

<script>
import { local } from "@/config";
import { mapActions, mapState } from "vuex";
import { TransferDom, Popup } from 'vux';
/* import TransferDom from 'vux/src/directives/transfer-dom/index.js';
import Popup from 'vux/src/components/popup/index.vue'; */

import ActformPayCome from '@/components/ActformPayCome.vue';

export default {
	name: 'editPayCome',
	props: ['ID', 'pathRoot'],
	directives: { TransferDom },
	components: { ActformPayCome, Popup },
	data(){
		return {
			// pathRoot: 'editPay' || 'editCome' --> from router.js:props
			payOrComeStr: this.pathRoot.replace(/edit/,''),
			detailData: false,
			showFailPopup: false
		};
	},
	methods: {
		...mapActions(['setNavigationTitle', 'setLoading']),
		redirectLogin(){ this.$router.replace('/login'); },
		checkCompLoads(ifLoad){
			if(ifLoad) {
				this.http.getDetailPayCome(this.ID).then(res=>{
					if(res){
						this.detailData = res;
						this.$nextTick(()=> this.setLoading({ show: false }));
					}else{
						this.setLoading({ show: false });
					}
				});
			}else {
				this.setLoading({ show: false });
				this.showFailPopup = true;
			}
		},
	},
	mounted() {
		this.setNavigationTitle(local.pgKey2Cn[this.pathRoot]);
	},
	created(){
		this.setLoading({ text: '', show: true });
	},
}
</script>

<style scoped lang="less">
.popup-btm-sty{
	background-color: #ffe26d;
	color: #000;
	text-align: center;
	padding: 15px;
	font-size:14px;
	&:active{color:#fff;}
}
</style>

