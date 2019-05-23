<template>
	<div v-if="show" class="jufy list-footer">
		<span>{{this.leftText||'分页信息：'}}</span>
		<span>
			<a v-if="pagging.currentPage<pagging.pageCount" href="javascript:;" @click="nextPage">&nbsp;下一页&nbsp;</a>
			<span v-else>没有更多了</span>
		</span>
		<span>{{pagging.totalRecord}}条&nbsp;&nbsp;&nbsp;<em>{{pagging.currentPage}}</em>/{{pagging.pageCount}} 页</span>
	</div>
</template>

<script>
	export default {
		name: "PaggingFooter",
		props: ['show', 'pagging', 'leftText'],
		methods: {
			nextPage(){
				this.$emit('on-click-next', ++this.pagging.currentPage);
			},
		},
	};
</script>

<style scoped lang="less">
.list-footer{
	margin:10px 3px 0 0;
	background:rgba(158, 158, 158, 0.2);
	font-size:0;
	padding:4px 6px;
	color:rgba(102, 102, 102, 0.8);
	&>span{
		display:inline-block;
		text-align: left;
		font-size:12px;
		em{color:rgba(255, 0, 0, 0.6);font-style: normal;}
	}
}
</style>
