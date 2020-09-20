<template>
	<div>
		<ul class="listCol list-header vux-1px-b b">
			<li class="li2"><p>名字</p></li>
			<li class="li3"><p>日期</p></li>
			<li class="li4"><p>自分类</p></li>
		</ul>
		<swipeout>
			<div class="vux-1px-b" v-for="(item,index) in dataList" :key="item.id" @click="showItemDetail(item,index)">
				<swipeout-item :auto-close-on-button-click="false">
					<div slot="right-menu">
						<swipeout-button @click.native.stop="btnEditItem(item.id)" type="primary">编辑</swipeout-button>
						<swipeout-button @click.native.stop="btnDelItem(item.id)" type="warn">删除</swipeout-button>
					</div>
					<ul class="listCol item-top" slot="content">
						<li class="li2"><p>{{item.sname}}</p></li>
						<li class="li3"><p>{{item.date_sign}}</p></li>
						<li class="li4"><p>{{item.dtype}}</p></li>
					</ul>
				</swipeout-item>
				<!-- 码源修改：见src\components\ListTable.vue:L:57:L62 -->
				<table v-if="item.vs" style="margin-left:40px;font-size:14px;color:#ccc">
					<tr>
						<td>名字</td>
						<td style="text-align:right;">{{item.sname}}</td>
					</tr>
					<tr>
						<td>日期</td>
						<td style="text-align:right;">{{item.date_sign}}</td>
					</tr>
					<tr>
						<td>自分类</td>
						<td style="text-align:right;">{{item.dtype}}</td>
					</tr>
					<tr>
						<td colspan="2" style="height:3px;"></td>
					</tr>
					<tr>
						<td colspan="2" style="border-top:1px dashed #ccc;padding-top:5px;">
							{{item.con}}
						</td>
					</tr>
				</table>
			</div>
		</swipeout>
	</div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, CellFormPreview } from 'vux';
import { local } from "@/config";
const en = 'notes';
const cn = local.pgKey2Cn[en];

import { mapActions } from "vuex";

export default {
	name: en,
	components: {Swipeout, SwipeoutItem, SwipeoutButton, CellFormPreview},
	data(){
		return {
			dataList: []
		}
	},
	methods: {
		...mapActions(['setNavigationTitle', 'setLoading']),
		getPage(){
			this.setLoading({text: '', show: true});
			this.http.getListNotes().then(res=>{
				this.setLoading({text: '', show: false});
				if(res){
					let {list} = res;
					this.dataList = list;
				}
			});
		},
		showItemDetail(item,index){
			item.vs = !item.vs;
			this.$set(this.dataList, index, item);
		},
		btnEditItem(id){
			this.$router.push(`/notes/edit/${id}`, routerTo=>{});
		},
		btnDelItem(id){
			this.$vux.confirm.show({
				content: '删除需谨慎，你丫确定？',
				onConfirm : () => {
					this.http.delNote(id).then(res=>{
						this.delLoading = false;
						if(res){
							if (res.affectedRows === 1) {
								this.$vux.toast.show({ text: '删除成功', time: 1000});
								this.getPage();
							}
							else this.$vux.toast.show({ text: '删除失败', time: 1000});
						}
					});
				}
			});
		},

	},

	mounted() {
		this.setNavigationTitle(cn);
		this.getPage();
	},
}
</script>

<style scoped lang="less">
.listCol{
	list-style: none; font-size: 0;
	&>li{
		display:inline-block; box-sizing: border-box;margin:0; height:40px; line-height: 40px;
		&.li2, &.li3, &.li4{
			padding: 0 4px;
			p {white-space: nowrap; word-break: keep-all; text-overflow:ellipsis; overflow: hidden;height:100%;font-size:14px;}
		}
		&.li2{width:50%;}
		&.li3{width:30%;}
		&.li4{width:20%;}
	}
	&.item-top>li.li2{color:rgb(161, 161, 161);font-size:13px;}
	&.item-top>li.li3{color:rgb(255, 123, 0);}
}
.oprbar{
	background:#eaeaea; padding:4px; border-radius: 1px; color:rgb(138, 138, 138);font-size:0; margin-right:1%;
	span{text-align: left;display: inline-block;font-size:13px;}
	em{color:rgb(51, 51, 51);font-style: normal;}
	a{
		&.color1{color:rgba(0, 146, 214, 0.5);}
		&.color2{color:#666;}
		&.color3{color:rgba(0, 146, 214, 0.7);}
		&:active{text-decoration: underline;}
	}
	.mmvuxico{width:20px;vertical-align:top;margin-right:-2px;fill:rgba(0, 146, 214, 0.3);}
}
.footer-s{
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

