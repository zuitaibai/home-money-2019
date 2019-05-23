<template>
	<div style="padding-top:20px;">
		<div class="warning">
			<p>此页功能请在pc端操作</p>
		</div>
		<div style="padding:0 10px;">
			<divider style="font-size:14px;">支出一级类别</divider>
			<div class="m">支出一级类别</div>
			<divider style="font-size:14px;">支出二级类别</divider>
			<div class="m">支出二级类别</div>
			<divider style="font-size:14px;">收入类别</divider>
			<div class="m">收入类别</div>
			<divider style="font-size:14px;">银行编辑</divider>
			<div class="m">银行编辑</div>
			<divider style="font-size:14px;">成员编辑</divider>
			<div class="m">成员编辑</div>
		</div>
	</div>
</template>

<script>
import { local } from "@/config";
const en = 'editCategory';
const cn = local.pgKey2Cn[en];

import { mapActions } from "vuex";
import { Divider } from 'vux';

export default {
	name: en,
	components: { Divider },
	methods: {
		...mapActions(['setNavigationTitle']),
	},
	mounted() {
		this.setNavigationTitle(cn);
	},
}
</script>

<style scoped lang="less">
.m{padding:3px 0 3px 1em;}
.warning{
	margin-bottom:10px;
	padding: 12px 24px 12px 20px;
    border-left: 4px solid;
    border-bottom-right-radius: 2px;
	border-top-right-radius: 2px;
	border-left-color: #f7d24c;
    background-color: #fefbed;
}
</style>

