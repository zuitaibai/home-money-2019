<template>
	<div class="list-statistics-w">

		<list-form :pageType="enStr" @on-submit="$refs.scrollerList.scrollLeft=0"></list-form>
		
		<div class="jufy oprbar">
			<span>|↔: 表格左右滚动</span>
			<span><a href="javascript:;" @click="hideLeft=!hideLeft">总 计 {{hideLeft?'&gt;':'&lt;'}}|</a></span>
		</div>

		<div class="flex-w">
			<div class="div1">
				<table class="t1">
					<tr><th>{{{year: '年', month: '月', day: '日'}[formOpts.tongjidw||'month']}} 份</th></tr>
					<tr><th>存 根</th></tr>
					<tr><th>借入出</th></tr>
					<tr><th>还入出</th></tr>
					<tr><th>商入出</th></tr>
					<tr><th>收 入</th></tr>
					<tr><th>支 出</th></tr>
					<tr><th>收支差</th></tr>
					<tr><th>账差额</th></tr>
					<tr><th>账余额</th></tr>
				</table>
			</div>
		
			<div class="div2">
				<div class="contnner" ref="scrollerList">
					<table class="t2">
						<tr>
							<td v-for="item in dataList" :key="item.date+'_1'">{{item[formOpts.tongjidw=='day'?'dateShort':'date']}}</td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_2'"><span class="iiin">{{item.cungen}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_3'" class="tc"><span class="iiin">{{item.jieru}}</span> / <span class="oout">{{item.jiechu}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_4'" class="tc"><span class="iiin">{{item.huanru}}</span> / <span class="oout">{{item.huanchu}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_5'" class="tc"><span class="iiin">{{item.shengyi_shouru}}</span> / <span class="oout">{{item.shengyi_touzi}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_6'" @click="clickGetPop('shouru',item.date,item.shouru)"><span class="iiin">{{item.shouru}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_7'" @click="clickGetPop('zhichu',item.date,item.zhichu)"><span class="oout">{{item.zhichu}}</span></td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_8'">{{item.cha_e}}</td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_9'" @click="clickGetPop('z_cha_e',item.date,item.z_cha_e)">{{item.z_cha_e}}</td>
						</tr>
						<tr>
							<td v-for="item in dataList" :key="item.date+'_10'" @click="clickGetPop('yu_e',item.date,item.yu_e)">{{item.yu_e}}</td>
						</tr>
					</table>
				</div>
			</div>

			<div v-if="hideLeft" class="div3">
				<table class="t3">
					<tr><td>计：</td></tr>
					<tr><td>{{total.cungen}}</td></tr>
					<tr><td>{{total.jieru}} / {{total.jiechu}}</td></tr>
					<tr><td>{{total.huanru}} / {{total.huanchu}}</td></tr>
					<tr><td>{{total.shengyi_shouru}} / {{total.shengyi_touzi}}</td></tr>
					<tr><td>{{total.shouru}}</td></tr>
					<tr><td>{{total.zhichu}}</td></tr>
					<tr><td>{{total.cha_e}}</td></tr>
					<tr><td>{{total.z_cha_e}}</td></tr>
					<tr><td></td></tr>
				</table>
			</div>

		</div>

		<pagging-footer 
			:show="!noDataVis && pagging.pageCount>=1" 
			:pagging="pagging" 
			@on-click-next="nextPage"
			leftText="(数据追加至表右)"
		></pagging-footer>

		<statistics-pop @on-close="closePop" :thePop="thePop" :popInfo="popInfo"></statistics-pop>

	</div>
</template>

<script>
import { local } from "@/config";
const en = "listStatistics";
const cn = local.pgKey2Cn[en];
import { mapActions, mapState, mapGetters } from "vuex";
import PaggingFooter from '@/components/PaggingFooter.vue';
import ListForm from '@/components/ListForm.vue';
import StatisticsPop from '@/components/StatisticsPop.vue';

export default {
	name: en,
	components: {
		PaggingFooter, StatisticsPop, ListForm
	},
	data(){
		return {
			enStr: en,
			hideLeft: false,
			popInfo: {type:'', money:0, date:''}
		}
	},
	computed: {
		...mapState('listStatistics', {
			pagging: 'page',
			loadMoreVis: 'loadMoreVis',
			formOpts: 'formOpts',
			total: 'total',
		}),
		...mapGetters('listStatistics', {
			thePop: 'pop',
			dataList: 'list',
		}),
		noDataVis(){
			return this.pagging.totalRecord === 0;
		},
	},
	methods: {
		...mapActions(['setNavigationTitle']),
		...mapActions('listStatistics', ['getListPush', 'clearStoreFormOpts', 'getPop', 'closePop']),
		scrollBasedTime(w, l, timer, totalTime=500, delay=15){
			if(isNaN(w) || isNaN(l) || w==l) return;
			window.clearTimeout(timer);
			const times = parseInt(totalTime / delay, 10); //次数
			let i = 0;
			const f = ()=>{
				if(i>=times){
					window.clearTimeout(timer);
					this.$refs.scrollerList.scrollLeft = w;
					return;
				}
				++i;
				this.$refs.scrollerList.scrollLeft += (w - l) / times;
				timer = window.setTimeout(f, delay);
			};
			timer = window.setTimeout(f, delay);
		},
		nextPage(next){
			const www = this.$refs.scrollerList.scrollWidth;
			const lll = this.$refs.scrollerList.scrollLeft;
			let timer;
			this.getListPush({currentPage: next}).then(res=>{
				if(!res || !res.listArr) return;
				//向右滚动表格
				this.$nextTick(() => {
					this.scrollBasedTime(www, lll, timer, 500);
				});
			});
		},
		clickGetPop(str,date, money){
			if(money==0) return;
			this.getPop({str, date});
			this.popInfo = {
				type: str,
				money,
				date
			};
		},
	},
	mounted() {
		this.setNavigationTitle(cn);
		this.clearStoreFormOpts();
		const myChildForm = this.$children.find(item=>item.$el.classList && item.$el.classList.contains('for-parentVue-findme'));
		if(myChildForm) {
			myChildForm.search();
		}
	},
	
};
</script>

<style scoped lang="less">
table{font-size:14px;border-collapse:collapse;border-spacing:0;width:100%;}
th{font-size:inherit;font-weight:bold;}
th,td{border:1px solid #ccc;height:36px;}
.iiin{color:#ff6900;}
.oout{color:#00a1c2;}
.flex-w{
	display: flex;
}
.div1{
	width:53px;border-right:1px solid #ccc;box-sizing:border-box;
	.t1{
		th{line-height:1.25;text-align: center;}
		tr:nth-child(6){background:rgba(171,138,74,0.1);}
		tr:nth-child(7){background:rgba(191,49,137,0.1);}
	}
}
.div3{
	border-right:1px solid #ccc;box-sizing:border-box;/* width:133px; */
	background:rgba(238, 238, 238, 0.7); /* color:#666;*/
	.t3{
		td{ line-height:1.25;text-align: center;padding:0 4px; }
		tr:nth-child(6){background:rgba(171,138,74,0.1);}
		tr:nth-child(7){background:rgba(191,49,137,0.1);}
	}
}
.div2{
	flex:1;
	border-right:1px solid #ccc;
	overflow: hidden;
	.contnner{width:100%;overflow-x: auto;max-width:100%;}
	.t2{
		margin-left:-1px;
		td{
			white-space: nowrap;word-break: keep-all;word-wrap: none;text-align: right;padding:0 2px;
			&.tc{text-align:center;}
		}
		tr:nth-child(1){ td{text-align:center;} }
		tr:nth-child(3),tr:nth-child(4),tr:nth-child(5){
			color:#ccc;
		}
		tr:nth-child(1){color:#666;}
		tr:nth-child(6)>td,tr:nth-child(7)>td,tr:nth-child(9)>td,tr:nth-child(10)>td{
			position: relative;
			&:after{content: ':';position: absolute;left:4px;bottom:10px;color:#999;}
		}
		tr:nth-child(6){background:rgba(171,138,74,0.1);}
		tr:nth-child(7){background:rgba(191,49,137,0.1);}
		tr:nth-child(8){color:#999;}
		tr:nth-child(9){color:#999;}
		tr:nth-child(10){color:#000;}
	}
}
.oprbar{
	background:#eaeaea; padding:4px; color:rgb(138, 138, 138);font-size:0;
	padding-left:52px;
	span{text-align: left;display: inline-block;font-size:13px;}
	a{color: rgba(0, 146, 214, 0.7);}
}
</style>
