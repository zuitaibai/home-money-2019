<template>
	<div>
		<div style="height:28px;"><!-- // 禁用原生检测时，高度div加在外围加 -->
			<sticky
				scroll-box="vux_view_box_body"
				ref="sticky"
				:offset="46"
				:check-sticky-support="false"
				:disabled="stickyDisabled"
			>
				<div class="jufy oprbar">
					<span v-if="showChecksBl">
						求和:
						<em>{{checksMoneySum}}</em>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						选中:
						<em>{{checksSum}}</em>
					</span>
					<span v-else>&nbsp;</span>
					<span>
						<a href="javascript:;" class="color1" @click="goTop">
							&nbsp;<x-icon type="md-arrow-up" class="mmvuxico"></x-icon>&nbsp;
						</a>&nbsp;&nbsp;&nbsp;
						<a href="javascript:;" class="color2" v-if="showChecksBl && pageType!='listAccounts'" @click="btnDelAll">&nbsp;删除&nbsp;</a>&nbsp;
						<a href="javascript:;" class="color3" @click="showChecksBl=!showChecksBl">&nbsp;{{showChecksBl?'隐藏':'批量'}}</a>
					</span>
				</div>
			</sticky>
			<!-- <div class="vux-sticky-fill" style="height:28px;"></div> --><!--  使用原生检测时，`div`紧挨着组件之后，并设置类名`vux-sticky-fill` -->
		</div>

		<!-- 支出：listPay       日期	金额	名称	类别	币种	自分类    支出账户	消费对象 -->
		<!-- 收入：listCome      日期	金额	名称	类别	币种	自分类    收入账户 -->
		<!-- 帐目：listAccounts  日期	金额	名称	类别	        自分类	  由	至 -->
		<ul class="listCol list-header vux-1px-b b" :class="{'show-checks':showChecksBl, 'if-accounts':pageType=='listAccounts'}" v-if="!noDataVis">
			<li class="li2"><p>日期</p></li>
			<li class="li3"><p>金额</p></li>
			<li class="li4"><p>名称</p></li>
			<li class="li5"><p>账户</p></li><!-- {{pageType=='listAccounts'?'类别':'账户'}} -->
			<li class="li1" @click="toggleCheckAll"><check-icon :value.sync="checkAllBl" style="line-height:normal;vertical-align:top" /></li>
		</ul>
		<swipeout>
			<div class="vux-1px-b" v-for="(item,index) in dataList_" :key="item.id" @click="showItemDetail(item,index)">
				<swipeout-item :auto-close-on-button-click="false">
					<div slot="right-menu">
						<swipeout-button @click.native.stop="btnEditItem(pageType,item.id)" type="primary">编辑</swipeout-button>
						<swipeout-button @click.native.stop="btnDelItem(item.id, item)" type="warn">删除</swipeout-button>
					</div>
					<ul class="listCol item-top" slot="content" :class="{'show-checks':showChecksBl, 'if-accounts':pageType=='listAccounts'}">
						<li class="li2"><p>{{item.header['1']}}</p></li>
						<li class="li3"><p>{{item.header['2']}}</p></li>
						<li class="li4"><p>{{item.header['3']}}</p></li>
						<li class="li5"><p>{{item.header['4']}}</p></li>
						<li class="li1"><check-icon :value="item.checked" type="plain" style="line-height:normal;vertical-align:top" @click.native.stop="itemCheck(item,index)"/></li>
					</ul>
				</swipeout-item>
				<!-- 码源修改： -->
				<!-- 当拖动swipeout-item上下滚动页面时报错：[Intervention] Ignored attempt to cancel a touchmove event with cancelable=false, for example because scrolling is in progress and cannot be interrupted. -->
				<!-- 原因：在swipeout-item组件里的有ev.preventDefault()事件，然而如果页页处于拖动滚动中时，此时无法中断滚动行为 -->
				<!-- 解决：在其源码中，vux/src/components/swipeout/swipeout-item.vue，所有ev.preventDefault()均改为：if(ev.cancelable) ev.preventDefault() -->

				<!-- 码源修改： -->
				<!-- 此处对vux:swipeout-item.vue源码进行修改(方法start体内)，以使swipeout实例下能容纳非swipeout-item元素而不报错 -->
				<!-- 修改处：l:87 return item.$data.styles.transform.indexOf('(0px, 0, 0)') === -1 -->
				<!-- 改成：
					l:87 if(item.$data&&item.$data.styles) return item.$data.styles.transform.indexOf('(0px, 0, 0)') === -1
					l:88 return false
				-->
				<group gutter="0" v-if="item.vs" style="margin-left:40px;">
					<cell-form-preview :list="item.transform1" style="font-size:14px;"></cell-form-preview>


                    <div v-if="pageType=='listAccounts' && Math.abs(item.type) == 1">
                        <cell-form-preview :list="[{label: '还款状态', value: {'0': '✘ 未还', '1': '✔ 已还', '2': '◕ 已还部分'}[item.isFinished]||'' }]" style="font-size:14px;"></cell-form-preview>
                        <div v-if="item.finisheds && item.finisheds.list" class="nfdstable">
                            <div>还帐历史：</div>
                            <div>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <th>ID</th>
                                        <th>日期</th>
                                        <th>金额</th>
                                        <th>名称</th>
                                    </tr>
                                    <tr v-for="(histroyItem, histroyIndex) in item.finisheds.list" :key="item.id + '-' + histroyIndex">
                                        <td>{{histroyItem.id}}</td>
                                        <td>{{histroyItem.date_sign}}</td>
                                        <td>{{histroyItem.money}}</td>
                                        <td>{{histroyItem.name}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>


					<cell-form-preview :list="item.transform2" style="font-size:14px;"></cell-form-preview>
				</group>
			</div>
		</swipeout>
		<load-more v-if="loadMoreVis" tip="正在加载"></load-more>
		<pagging-footer :show="!noDataVis && pagging.pageCount>=1" :pagging="pagging" @on-click-next="nextPage"></pagging-footer><!-- !noDataVis && pagging.pageCount>1 -->
		<div v-if="!noDataVis && pageType=='listAccounts' && pagging.pageCount>=1" class="jufy footer-s">
			<span>非转存计：</span>
			<span v-if="iin===0&&out===0">...</span>
			<span v-else><em>{{iin}}</em> - <em>{{out}}</em> = {{iin-out}}</span>
		</div>
		<load-more v-if="noDataVis && !loadMoreVis" :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
		</div>
</template>

<script>
    import { Http } from '../store/storeVar';
	import { Swipeout, SwipeoutItem, SwipeoutButton, CellFormPreview, Group, CheckIcon, LoadMore, Sticky } from 'vux';
    /* import {Swipeout, SwipeoutItem, SwipeoutButton} from 'vux/src/components/swipeout/index.js';
    import CellFormPreview from 'vux/src/components/cell-form-preview/index.vue';
    import Group from 'vux/src/components/group/index.vue';
    import LoadMore from 'vux/src/components/load-more/index.vue';
    import CheckIcon from 'vux/src/components/check-icon/index.vue';
    import Sticky from 'vux/src/components/sticky/index.vue'; */

	import { mapActions, mapState } from 'vuex';
	import PaggingFooter from '@/components/PaggingFooter.vue';

	export default {
		name: "ListTable",
		components: { PaggingFooter, Swipeout, SwipeoutItem, SwipeoutButton, CellFormPreview, Group, CheckIcon, LoadMore, Sticky},
		props: ['dataList', 'pageType', 'pagging', 'loadMoreVis'],
		data(){
			return {
				checkAllBl: false,
				showChecksBl: false,
				stickyDisabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
			}
		},
		computed: {
			...mapState(['stickyChange']),
			dataList_(){
				return this.dataList;
			},
			checksMoneySum(){
				return this.dataList_.filter(item=>item.checked).reduce((prev,item)=>prev+item.money,0) || '^';
			},
			checksSum(){
				return this.dataList_.filter(item=>item.checked).length || '^';
			},
			//'100':'转存', '0':'存根', '1':'借入', '-1':'借出', '2':'还入', '-2':'还出', '3':'生意收入', '-3':'生意投资'
			iin(){
				return this.dataList_.filter(item=>item.type==0||item.type==1||item.type==2||item.type==3).reduce((prev,item)=>prev+item.money,0);
			},
			out(){
				return this.dataList_.filter(item=>item.type==-1||item.type==-2||item.type==-3).reduce((prev,item)=>prev+item.money,0);
			},
			noDataVis(){
				return this.pagging.totalRecord === 0;
			}
		},
		watch:{
			stickyChange: function (newv, oldv) {
				if(newv){
					this.$refs.sticky.bindSticky();
					this.setStickyChange(false);
				}
			},
		},
		methods: {
			...mapActions(['setLoading','setStickyChange']),
			// 这三个方法不要在store中改名，三个页面此处统一使用
			// ...mapActions('listPay?||listCome?||listAccounts', ['getListPush','del','delAll']),
			getListPush(val) {
				return this.$store.dispatch(`${this.pageType}/getListPush`, val);
			},
			del(val) {
				return this.$store.dispatch(`${this.pageType}/del`, val);
			},
			delAll(val) {
				return this.$store.dispatch(`${this.pageType}/delAll`, val);
			},
			nextPage(next){
				this.getListPush({currentPage: next});
			},
			showItemDetail(item,index){
                if(item.vs) this.$set(this.dataList_, index, {...item, vs: false});
                else{
                    this.$set(this.dataList_, index, {...item, vs: true});
                    if(this.pageType=='listAccounts' && Math.abs(item.type) == 1){
                        !item.finisheds &&  Http.getDetailAccounts(item.id).then(res => {
                            let newItem = {...item, finisheds: res.finisheds, vs: true}; //这个vs:true也必须加，因为其父代码块内的vs或许没有进入nextTick
                            this.$set(this.dataList_, index, newItem);
                        });
                    }
                }
                this.dataList_.forEach( (v,i) => (i !== index) && this.dataList_.splice(i, 1, {...v, vs: false}) );
			},
			itemCheck(item,index){
				item.checked = !item.checked;
				this.$set(this.dataList_, index, item);
				this.checkAllBl = !this.dataList_.some(item=>!item.checked);
			},
			toggleCheckAll(){
				this.dataList_.forEach((item, index)=>{
					item.checked = this.checkAllBl;
					this.$set(this.dataList_, index, item);
				});
			},
			btnEditItem(pageType, id){
				this.$router.push(`/${pageType}/edit/${id}`, routerTo=>{});
			},
			btnDelItem(id, item){
                let content = '删除需谨慎，你丫确定？';
                if(this.pageType=='listAccounts' && Math.abs(item.type) == 1){
                    let t1 = '入', t2 = '出';
                    if(item.type == 1){
                        t1 = '出';
                        t2 = '入';
                    }
                    content = `确定要删？<br><br>！！！！！注意：<br>此借${t2}连带的所有[还${t1}]记录将被同步删除`;
                }
				this.$vux.confirm.show({
                    content,
                    onConfirm : () => {
						this.setLoading({ text: '我删，我删删删', show: true });
						this.del(id).then(res=>{
							this.setLoading({ show: false });
							// 如果在上层(service.js)已经被catch捕获了，则res为undefined
							if(res) {
								const txt = res==='err' ? '删除失败' : '删除成功';
								this.$vux.toast.show({ text: txt, time: 1000});
							}
						});
                    }
                });
			},
			btnDelAll(){
				if(this.dataList_.filter(item=>item.checked).length<1){
					this.$vux.toast.show({ text: '你倒是选一个啊！', time: 1200 });
					return;
				}
				this.$vux.confirm.show({
					title: '死了心要删？',
                    content: '删除批量，后果不堪设想',
                    onConfirm : () => {
						this.setLoading({ text: '我删，我删删删', show: true });
						let idsArr = this.dataList_.filter(item=>item.checked).map(item=>item.id);
                        this.delAll(idsArr).then(res=>{
							this.setLoading({ show: false });
							// 如果在上层(service.js)已经被catch捕获了，则res为undefined
							if(res) {
								const txt = res==='err' ? '删除失败' : '删除成功';
								this.$vux.toast.show({ text: txt, time: 1000});
							}
						});
                    }
                });
			},
			goTop(){
				const scroller = document.getElementById('vux_view_box_body');
				if(scroller) {
					// scroller.scrollTo(0,0);
					let timer;
					this.scrollTop(scroller, timer, 300);
				}
			},
			scrollTop(scroller, timer, totalTime=500, delay=15){
				const nowTop = scroller.scrollTop;
				window.clearTimeout(timer);
				const times = parseInt(totalTime / delay, 10); //次数
				let i = 0;
				const f = ()=>{
					if(i>=times){
						window.clearTimeout(timer);
						scroller.scrollTop = 0;
						return;
					}
					++i;
					scroller.scrollTop -= nowTop / times;
					timer = window.setTimeout(f, delay);
				};
				timer = window.setTimeout(f, delay);
			},
		},
		mounted(){
			//for fix 目前sticky存在的bug:初载页面，刷新当前页都可用，但在router切换时失效
			this.$nextTick(function(){
				window.setTimeout(()=>this.setStickyChange(true),500);
			});
		},
	};
</script>

<style scoped lang="less">
.listCol{
	list-style: none; font-size: 0;
	&>li{
		display:inline-block; box-sizing: border-box;margin:0; height:40px; line-height: 40px;
		&.li1{display:none;vertical-align:top;width:35px;padding-top:7px;}
		&.li2, &.li3, &.li4, &.li5{
			padding: 0 4px;
			p {white-space: nowrap; word-break: keep-all; text-overflow:ellipsis; overflow: hidden;height:100%;font-size:14px;}
		}
		&.li2{width:24%;}
		&.li3{width:16%;}
		&.li4{width:49%;}
		&.li5{width:10.9%;}
	}
	&.item-top>li.li2{color:rgb(161, 161, 161); p{font-size:13px;}}
	&.item-top>li.li3{color:rgb(255, 123, 0);}
	&.show-checks{
		&>li.li1{display:inline-block;}
		&>li.li4{width:calc( 49% - 35px );}
	}
	&.list-header.if-accounts>li.li5{padding-right:6px;}
	&.if-accounts{
		&>li{
			&.li2{width:24%;}
			&.li3{width:16%;}
			&.li4{width:39.9%;}
			&.li5{width:20%;text-align: right;}
		}
		&.show-checks{
			&>li.li4{width:calc( 39.9% - 35px );}
		}
	}
}
.vux-sticky-box.vux-fixed{width:96.5%;}
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

.nfdstable{
    font-size: 13px;color: #999; /* border-bottom:1px solid #ccc; */ margin: 0 13px 10px 15px;line-height:1.4;padding-bottom:6px;
    // &>div:nth-child(1){}
    &>div:nth-child(2){
        table{width:100%;table-layout: fixed;border-collapse:collapse;
            th,td{border: 1px solid #aaa;padding: 0;padding: 3px 5px;}
        }
    }
}
</style>
