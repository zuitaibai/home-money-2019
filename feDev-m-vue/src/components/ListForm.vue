<template>
<!-- 
支出 [listPay]:
	名称， 开始,结束，  支类1,支类2,  币种1,币种2， 自分类， 备注， 分页条数， 账户,  消费对象
	name, date_sign_start, date_sign_end,outtype1Key, outtype2Key, 
	bankTypeKey, bankKey,dtype, other, pageSize, memberKey, for_from_memberKey
收入 [listCome]:
	名称， 开始,结束，  收入类别,     币种1,币种2， 自分类， 备注， 分页条数,  账户
	name, date_sign_start, date_sign_end, intypeKey, bankTypeKey,bankKey,dtype, other,  pageSize, memberKey
帐目 [listAccounts]:
	名称， 开始,结束，  帐目类型,                   自分类， 备注， 分页条数
	name, date_sign_start, date_sign_end,type,dtype, other, pageSize
统计 [listStatistics]:
	开始,结束，  统计单位,                                 分页条数
	date_sign_start, date_sign_end, tongjidw, pageSize
 -->
	<div class="list-form for-parentVue-findme" :style="{paddingBottom:showMoreVisible?'20px':0}">
		<transition name="slide-left">
			<p class="list-form-bar" @click="showPart1" v-if="!showMoreVisible" style="padding:8px 0;">
				条件查询
				<x-icon v-if="!showMoreVisible" type="ios-arrow-down"></x-icon>
				<x-icon v-if="showMoreVisible" type="ios-arrow-up"></x-icon>
			</p>
		</transition>
		<transition name="slide-right">
			<div v-show="showMoreVisible">
				<group gutter="0" :class="showMoreMoreVis?'':'no-after'">
					<x-input v-if="pageType!='listStatistics'" title="名称" placeholder-align="right" text-align="right" v-model="name"></x-input>
					<datetime 
						v-model="dateStart" 
						:min-year=2018 
						:max-year="maxYear" 
						format="YYYY-MM-DD" 
						@on-clear="clearDateStart"
						title="起始时间" 
						year-row="{value}年" 
						month-row="{value}月" 
						day-row="{value}日" 
						clear-text="清除"
					></datetime>
					<datetime 
						v-model="dateEnd" 
						:min-year=2018 
						:max-year="maxYear" 
						format="YYYY-MM-DD" 
						@on-clear="clearDateEnd"
						title="结束时间" 
						year-row="{value}年" 
						month-row="{value}月" 
						day-row="{value}日" 
						clear-text="清除"
					></datetime>

					<popup-picker v-if="pageType=='listPay'" title="支出类别" :data="outTypeList" :columns="2" v-model="outType" show-name @on-hide="ifOutTypeEmpty"></popup-picker>
					<popup-picker v-else-if="pageType=='listCome'" title="收入类别" :data="inTypeList" :columns="1" v-model="inType" show-name @on-hide="ifInTypeEmpty"></popup-picker>
					
					<popup-picker v-else-if="pageType=='listAccounts'" title="帐目类型" :data="accountsTypeList" :columns="1" v-model="accountsType" show-name></popup-picker>
					<cell-box v-else-if="pageType=='listStatistics'" style="justify-content:space-between;">
						统计单位
						<checker v-model="statisticsType" :radio-required="true"  default-item-class="checker-item" selected-item-class="checker-item-selected">
							<checker-item value="year">年</checker-item><checker-item value="month">月</checker-item><checker-item value="day">日</checker-item>
						</checker>
					</cell-box>
					<popup-picker v-if="pageType=='listPay'||pageType=='listCome'" title="币种" :data="moneyTypeList" :columns="2" v-model="moneyType" show-name @on-hide="ifMoneyTypeEmpty"></popup-picker>
					<popup-picker v-if="pageType=='listPay'" title="消费对象" :data="forMemberList" :columns="1" v-model="forMember" show-name @on-hide="ifForMemberEmpty"></popup-picker>
					
					<popup-radio v-if="pageType=='listPay'||pageType=='listCome'" title="帐户" :options="memberList_popupRadio" v-model="member_popupRadio">
						<p slot="popup-header" class="vux-1px-b mem-title-slot">请选择</p>
					</popup-radio>
					<!-- <popup-picker v-if="pageType=='listPay'||pageType=='listCome'" title="帐户" :data="memberList" :columns="1" v-model="member" show-name @on-hide="ifMemberEmpty"></popup-picker> -->
					
					<x-number v-if="pageType=='listStatistics'" title="每页条数" v-model="pageSize" :min="5" :max="100" :step="5"></x-number>
					<div v-if="pageType=='listStatistics'" class="vux-1px-t" style="height:1px;margin-bottom:20px;"></div>

					<div v-if="pageType!='listStatistics'" class="vux-1px-t caaa tc" style="margin-left:15px;color:#ccc;padding:11px 16px" :style="{marginBottom:showMoreMoreVis?'-12px':''}" @click="togglePart2">
						更多{{showMoreMoreVis?' &lt;':'...'}}
					</div>
					<div v-if="showMoreMoreVis && pageType!='listStatistics'">
						<x-input title="自分类" placeholder-align="right" v-model="selfType" text-align="right"></x-input>
						<x-textarea title="备注" v-model="other" :autosize="true" :rows="1" :max="500" :show-counter="false"></x-textarea>
						<x-number title="每页条数" v-model="pageSize" :min="1" :max="100" :step="1" :fillable="true"></x-number>
					</div>
				</group>
				<div :style="{marginTop:showMoreMoreVis?'20px':0}" class="fix tc">
					<span class="r caaa" @click="hideAll" style="line-height:1;margin-top:20px;">收起<x-icon v-if="showMoreVisible" type="ios-arrow-up" style="width:20px;"></x-icon></span>
					<x-button action-type="button" @click.native="reset" mini plain style="width:23%;line-height:2.35;font-size:16px;padding:0;" class="l">重置</x-button>
					<x-button  mini 
						type="primary" 
						action-type="button" 
						:show-loading="searchBtnLoadingVis" 
						@click.native="search"
						style="width:47%;margin-top:0;line-height:2.5;font-size:16px;"
						class=""
					>查 询</x-button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import { defaultPageSize } from '@/config';
	import { Datetime, Group, XInput, PopupPicker, XNumber, XTextarea, XButton, dateFormat, CellBox, Checker, CheckerItem, PopupRadio } from 'vux';
	import { mapActions } from 'vuex';
	export default {
		name: "ListForm",
		components: { 
			Group, Datetime, XInput, PopupPicker, XNumber, XTextarea, XButton, CellBox, Checker, CheckerItem, PopupRadio
		},
		props: ['pageType'],
		data(){
			return {
				member_popupRadio: '',
				memberList_popupRadio: [],
				showMoreVisible: false,
				searchBtnLoadingVis: false,
				showMoreMoreVis: false,
				pageSize: defaultPageSize,
				name: '', dateStart: '', dateEnd: '', other: '', selfType: '',
				outType: [],
				inType: [],
				accountsType: ['all'],
				statisticsType: 'month',
				moneyType: [],
				forMember: [],
				member: [],
				outTypeList: [],
				inTypeList: [],
				accountsTypeList: [
					{name: '[全部]', value: 'all'},
					{name: '转存', value: '100'}, {name: '非转存', value: '-100000'}, 
					{name: '存根', value: '0'}, 
					{name: '借入', value: '1'}, {name: '借出', value: '-1'},
					{name: '还入', value: '2'}, {name: '还出', value: '-2'},
					{name: '生意收入', value: '3'}, {name: '生意投资', value: '-3'}
				],
				moneyTypeList: [],
				forMemberList: [],
				memberList: [],
			}
		},
		computed:{
			maxYear(){
				return new Date().getFullYear();
			},
			dtStart(){
				return `${new Date().getFullYear()}-01-01`;
			},
			dtEnd(){
				return dateFormat(new Date(), 'YYYY-MM-DD');
			},
		},
		methods: {
			...mapActions(['setStickyChange']),
			// ...mapActions('listPay', ['getList']),
			getList(val) {
				return this.$store.dispatch(`${this.pageType}/getList`, val);
			},
			hideAll(){
				this.showMoreVisible=false;
				this.showMoreMoreVis=false;
				this.$nextTick(() => this.setStickyChange(true));
			},
			showPart1(){
				this.showMoreVisible=true;
				this.$nextTick(() => this.setStickyChange(true));
			},
			togglePart2(){
				this.showMoreMoreVis=!this.showMoreMoreVis;
				this.$nextTick(() => this.setStickyChange(true));
			},
			search(){
				let name, date_sign_start, date_sign_end, dtype, other, pageSize, outtype1Key, outtype2Key, bankTypeKey, bankKey, memberKey, for_from_memberKey, intypeKey, type, tongjidw;
				name = this.name;
				date_sign_start = this.dateStart;
				date_sign_end = this.dateEnd;
				dtype = this.selfType;
				other = this.other;
				pageSize = this.pageSize;
				outtype1Key = this.outType.length>0 ? this.outType[0] : '';
				outtype2Key = this.outType.length>1 ? this.outType[1] : '';
				bankTypeKey = this.moneyType.length>0 ? this.moneyType[0] : '';
				bankKey = this.moneyType.length>1 ? this.moneyType[1] : '';
				// 如果使用popup-radio，则用member_popupRadio；如果使用popup-picker，则用member，看上面html哪个没注释掉
				// memberKey = this.member.length>0 ? this.member[0] : ''; 
				memberKey = this.member_popupRadio;
				for_from_memberKey = this.forMember.length>0 ? this.forMember[0] : '';
				intypeKey = this.inType.length>0 ? this.inType[0] : '';
				type = this.accountsType.length>0 ? this.accountsType[0] : '';
				tongjidw = this.statisticsType;
				const listPay = {name, date_sign_start, date_sign_end,outtype1Key, outtype2Key, bankTypeKey, bankKey,dtype, other, pageSize, memberKey, for_from_memberKey};
				const listCome = {name, date_sign_start, date_sign_end, intypeKey, bankTypeKey,bankKey,dtype, other,  pageSize, memberKey};
				const listAccounts = {name, date_sign_start, date_sign_end,type,dtype, other, pageSize};
				const listStatistics = {date_sign_start, date_sign_end, tongjidw, pageSize};
				let objs = {listPay, listCome, listAccounts, listStatistics}[this.pageType];
				objs.currentPage = 1;
				this.searchBtnLoadingVis = true;
				this.$emit('on-submit');
				this.getList(objs).then(res=>{
					this.searchBtnLoadingVis = false;
					this.hideAll();
				});
			},
			reset(){
				this.searchBtnLoadingVis = false;
				this.name = this.dateStart = this.dateEnd  = this.other = this.selfType = this.member_popupRadio = '';
				if(this.pageType=='listStatistics'){
					this.dateStart = this.dtStart;
					this.dateEnd = this.dtEnd;
				}
				this.outType = [];
				this.inType = [];
				this.accountsType = ['all'];
				this.statisticsType = 'month';
				this.moneyType = [];
				this.forMember = [];
				this.member = [];
				this.pageSize = defaultPageSize;
			},
			clearDateStart(){ this.dateStart = '' },
			clearDateEnd(){ this.dateEnd = '' },
			ifOutTypeEmpty(closeType){
				if(closeType && this.outType && this.outType.length===2){
					if(this.outType[0]==='no') this.outType=[];
					else if(this.outType[1]==='no') this.outType[1]='';
				}
			},
			ifInTypeEmpty(closeType){
				if(closeType){
					if(this.inType && this.inType.length===1 && this.inType[0]==='no') this.inType=[];
				}
			},
			ifMoneyTypeEmpty(closeType){
				if(closeType && this.moneyType && this.moneyType.length===2){
					if(this.moneyType[0]==='no') this.moneyType=[];
					else if(this.moneyType[1]==='no') this.moneyType[1]='';
				}
			},
			ifForMemberEmpty(closeType){
				if(closeType){
					if(this.forMember && this.forMember.length===1 && this.forMember[0]==='no') this.forMember=[];
				}
			},
			ifMemberEmpty(closeType){
				if(closeType){
					if(this.member && this.member.length===1 && this.member[0]==='no') this.member=[];
				}
			},
		},
		created(){
			if(this.pageType=='listPay'||this.pageType=='listCome'){
				this.http.getMoneyTypeAll().then(res=>{
					if(res){
						res.filter(item=>item.parent==0).forEach(item=>{
							res.unshift({name:'[不选]', value:'no',parent:item.value});
						});
						res.push({name:'[不选]', value:'no', parent:'0'});
						this.moneyTypeList = res;
					}
				});
				this.http.getMemberValue().then(res=>{
					if(res){
						const memArrSrc = res.filter(item=>item.ifhome===1);
						const memArr = memArrSrc.map(item=>({ name: item.name, value: ''+item.id }));
						memArr.push({name:'[不选]', value:'no'});
						const memArrForPopupRadio = memArrSrc.map(item=>({ value: item.name, key: ''+item.id }));
						memArrForPopupRadio.unshift({ value: '', key: '' });
						const forMemArr = res.map(item=>({ name: item.name, value: ''+item.id }));
						forMemArr.push({name:'[不选]', value:'no'});
						this.memberList = memArr;
						this.forMemberList = forMemArr;
						this.memberList_popupRadio = memArrForPopupRadio;
					}
				});
			}
			if(this.pageType=='listPay') this.http.getOutTypeAll().then(res=>{
				if(res){
					res.filter(item=>item.parent==0).forEach(item=>{
						res.unshift({name:'[不选]', value:'no',parent:item.value});
					});
					res.push({name:'[不选]', value:'no', parent:'0'});
					this.outTypeList = res;
				}
			});
			if(this.pageType=='listCome') this.http.getComeValue().then(res=>{
				if(res){
					const arr = res.map(item=>({ name: item.name, value: ''+item.id }));
					arr.push({name:'[不选]', value:'no'});
					this.inTypeList = arr;
				}
			});
			if(this.pageType=='listStatistics'){
				this.dateStart = this.dtStart;
				this.dateEnd = this.dtEnd;
			}
		},
	};
</script>

<style lang="less">
.list-form{padding:0 30px;}
.list-form-bar{color:#ccc;}
.vux-x-icon { fill: #ccc; vertical-align:middle;}
.caaa{color:#aaa;}
.no-after .weui-cells:after{display:none;}
.checker-item {
  border: 1px solid #ececec;
  padding: 0px 10px;
  line-height: 1.5;
  margin-left:5px;
}
.checker-item-selected {
  border: 1px solid #008000;
  background: #fff url(../assets/gou.png) no-repeat right bottom;
}
.mem-title-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.weui-cell.weui-cell_radio{
	.vux-radio-label:empty::after{content: '[全部]'}
}
</style>
