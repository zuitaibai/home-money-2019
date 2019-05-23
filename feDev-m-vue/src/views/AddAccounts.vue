<template>
	<div>
		<actform-accounts addOrEdit="add" @on-component-loaded="checkCompLoads"></actform-accounts>
		<div v-transfer-dom>
			<popup v-model="showFailPopup" position="bottom" :show-mask="true" :hide-on-blur="false">
				<div class="popup-btm-sty" @click="redirectLogin">组件加载失败，请重新登录</div>
			</popup>
		</div>
	</div>
</template>

<script>
import { local } from "@/config";
const en = 'addAccounts';
const cn = local.pgKey2Cn[en];
import { mapActions, mapState } from "vuex";
import { TransferDom, Popup } from 'vux';
import ActformAccounts from '@/components/ActformAccounts.vue';

export default {
	name: en,
	directives: { TransferDom },
	components: { ActformAccounts, Popup },
	data(){
		return {
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
.popup-btm-sty{
	background-color: #ffe26d;
	color: #000;
	text-align: center;
	padding: 15px;
	font-size:14px;
	&:active{color:#fff;}
}
</style>

