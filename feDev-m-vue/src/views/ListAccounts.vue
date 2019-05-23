<template>
	<div>
		<list-form :pageType="enStr"></list-form>
        <list-table :pageType="enStr" :dataList="dataList" :pagging="pagging" :loadMoreVis="loadMoreVis"></list-table>
	</div>
</template>

<script>
import { local } from "@/config";
const en = "listAccounts";
const cn = local.pgKey2Cn[en];
import { mapActions, mapGetters, mapState } from "vuex";
import ListTable from '@/components/ListTable.vue';
import ListForm from '@/components/ListForm.vue';

export default {
    name: en,
	components: {
		ListTable, ListForm
	},
	data(){
		return {
			enStr: en,
		}
	},
	computed: {
		...mapState('listAccounts', {
			pagging: 'page',
			loadMoreVis: 'loadMoreVis',
		}),
		...mapGetters('listAccounts', ['dataList']),
	},
	methods: {
		...mapActions(['setNavigationTitle']),
		...mapActions('listAccounts', ['getList', 'clearStoreFormOpts']),
	},
	mounted() {
		this.setNavigationTitle(cn);
		// 已在beforeRouteEnter中控制，用于编辑页返回列表页保留之前的查询状态
		// this.clearStoreFormOpts();
		// this.getList();
	},
	beforeRouteEnter(to, from, next){
		const ifFormMyEdit = from.path.includes('/listAccounts/edit/');
		next(vm => {
			if(ifFormMyEdit){
				// 列表为空：如果是按了f5再返回来，store状态没有保持 或者 本身就没数据，尝试再请求一次
				if(vm.dataList.length===0) vm.getList();
			} else {
				vm.clearStoreFormOpts();
				vm.getList();
			}
		});
	},
	
};
</script>
