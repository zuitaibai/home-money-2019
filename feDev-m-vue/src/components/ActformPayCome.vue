<template>
	<div>
		<group gutter="0">
			<x-input title="名称" v-model="obj.name" required show-clear text-align="right" placeholder-align="right" placeholder="必填" ref="name"></x-input>
			<x-input title="金额" v-model="obj.money" required show-clear text-align="right" placeholder-align="right" placeholder="必填，只接受整数" type="number" ref="money">
				<span slot="right" style="margin-left:5px;">元</span>
			</x-input>
			<popup-picker v-if="payComeStr=='Pay'"   title="[ 支出类别 ]" :data="outTypeList" :columns="2" v-model="obj.outType" show-name @on-change="outTypeChange"></popup-picker>
			<popup-picker v-if="payComeStr=='Come'"  title="[ 收入类别 ]" :data="inTypeList"  :columns="1" v-model="obj.inType"  show-name></popup-picker>
			<popup-radio :title="payComeStr=='Pay'?'出付帐户 －':'入收帐户 +'" :options="memberList_popupRadio" v-model="obj.member_popupRadio">
				<p slot="popup-header" class="vux-1px-b mem-title-slot">请选择</p>
			</popup-radio>
			<popup-picker :title="payComeStr=='Pay'?'出付币种 －':'入收币种 +'" :data="moneyTypeList" :columns="2" v-model="obj.moneyType" show-name></popup-picker>

			<!-- 当取值时注意判断shouldShowNormalMembers，以取对应的值forMember_popupRadio或forMember -->
			<popup-radio v-if="(payComeStr=='Pay') && shouldShowNormalMembers" title="消费对象" :options="forMemberList_popupRadio" v-model="obj.forMember_popupRadio">
				<p slot="popup-header" class="vux-1px-b mem-title-slot">请选择</p>
			</popup-radio>
			<popup-picker v-if="(payComeStr=='Pay') && !shouldShowNormalMembers" title="消费对象" :data="forMemberList" :columns="1" v-model="obj.forMember" show-name></popup-picker>

			<calendar v-model="obj.date" title="时间"></calendar><!--  placeholder="默认为今天" -->

			<x-input title="自分类" v-model="obj.selfType" placeholder-align="right" text-align="right"></x-input>
			<x-textarea title="备注" v-model="obj.other" :autosize="true" :rows="1" :max="500" :show-counter="false"></x-textarea>
		</group>

		<div style="padding:20px 15px 0;">
			<x-button type="primary" @click.native="submit" :disabled="submitDisabled" :show-loading="obj.submitLoading">{{ifEdit?'确认修改':payComeStr=='Come'?'提交新收入':'提交新支出'}}</x-button>
			<x-button type="default" @click.native="reset" v-if="!ifEdit">重 置</x-button>
		</div>

	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// Datetime, XNumber, CellBox, Checker, CheckerItem
import { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton, dateFormat } from 'vux';

const ctrlsInitDefault = {
	name: '',
	money: '',
	selfType: '',
	other: '',
	date: '',
	member_popupRadio: '',
	forMember_popupRadio: '',
	forMember: [],
	outType: [],
	inType: [],
	moneyType: [],
	submitLoading: false,
};

export default {
	name: 'ActformPayCome',
	props: ['payComeStr', 'datas', 'addOrEdit'],
	components: { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton  },
	data(){
		return {
			shouldShowNormalMembers: true,
			ifEdit: this.addOrEdit!=='add',
			obj: { ...ctrlsInitDefault },
			outTypeList: [],
			inTypeList: [],
			moneyTypeList: [],
			memberList_popupRadio: [],
			forMemberList_popupRadio: [],
			forMemberList: [],

			saveObj: {},
		};
	},
	computed: {
		submitDisabled(){
			return this.obj.name.trim()==='' || (''+this.obj.money).trim()==='';
		},
	},
	methods: {
		...mapActions('listPay', { updateItem_listPay: 'updateItem' }),
		...mapActions('listCome', { updateItem_listCome: 'updateItem' }),
		outTypeChange(v){
			// v[0]=='9': 人情往来
			this.shouldShowNormalMembers = v[0]!='9' && v[0]!='12';
		},
		submit(){
			// const a = this.$refs.name;
			// const b = this.$refs.money;
			if(this.obj.name.trim()==='' || (''+this.obj.money).trim()===''){
				// a.focus(); b.focus(); a.blur(); b.blur();
				return;
			}

			this.obj.submitLoading = true;
			const id = this.datas && this.datas.id;
			const data = this.getCtrlVal();
			let tipWord, obser;
			if(this.ifEdit){
				tipWord = '编辑';
				obser = this.http.updateDetailPayCome(id, data);
			}else{
				data.type = {'Come': 1, 'Pay': 0}[this.payComeStr];
				tipWord = '新建';
				obser = this.http.addDetailPayCome(data);
			}
			obser.then(res=>{
				this.obj.submitLoading = false;
				if(res){
					if(res.affectedRows == 1){
						this.$vux.toast.show({ text: `${tipWord}成功` });
						if(this.ifEdit){
							// 更新store的item
							const methodStr = {'Pay': 'updateItem_listPay', 'Come': 'updateItem_listCome'}[this.payComeStr];
							this[methodStr]({...data, id});

							this.$router.go(-1);
							return;
						}
						this.reset();
						return;
					}
					this.$vux.toast.show({ text: `${tipWord}失败` });
				}
			});
		},
		reset(){
			this.obj = {
				...ctrlsInitDefault,
				...this.saveObj
			};
			this.$nextTick(()=>{
				this.$refs.name.reset();
				this.$refs.money.reset();
			});
		},
		setCtrlVal(o){
			this.obj = {
				name : o.name,
				money : o.money,
				selfType : o.dtype||'',
				other : o.other||'',
				date : o.date_sign,
				member_popupRadio : ''+o.memberKey,
				forMember_popupRadio : ''+o.for_from_memberKey,
				forMember : [''+o.for_from_memberKey],
				outType : [''+o.outtype1Key, ''+o.outtype2Key],
				inType : [''+o.intypeKey],
				moneyType : [''+o.bankTypeKey, ''+o.bankKey],
			};
		},
		getCtrlVal(){
			let { name, money, selfType, other, date, member_popupRadio, forMember_popupRadio, forMember, outType, inType, moneyType } = this.obj;
			return {
				name,
				money: Number(money||0),
				dtype: selfType,
				other,
				date_sign: date,
				memberKey: Number(member_popupRadio),
				for_from_memberKey:  Number(this.shouldShowNormalMembers ? forMember_popupRadio: forMember[0]),
				outtype1Key: Number(outType[0]),
				outtype2Key: Number(outType[1]),
				intypeKey: Number(inType[0]),
				bankTypeKey: Number(moneyType[0]),
				bankKey: Number(moneyType[1]),
			};
		},
	},
	created(){
		const a = ()=>{
			return this.http.getMoneyTypeAll().then(res=>{
				if(res) {
					this.moneyTypeList = res;
					let v2 = '';
					const v1 = (res.find(item=>item.parent=='0')||{value:''}).value;
					if(v1) v2 = (res.find(item=>item.parent==v1)||{value:''}).value;
					this.obj.moneyType = [v1, v2];
					this.saveObj.moneyType = [v1, v2];
				}
				return res;
			});
		};
		const b = ()=>{
			return this.http.getMemberValue().then(res=>{
				if(res){
					const memArrSrc = res.filter(item=>item.ifhome===1);
					const memArrForPopupRadio = memArrSrc.map(item=>({ value: item.name, key: ''+item.id }));
					const forMemArrForPopupRadio = memArrSrc.map(item=>({ value: item.name, key: ''+item.id }));
					const forMemArr = res.map(item=>({ name: item.name, value: ''+item.id }));
					this.forMemberList = forMemArr;
					if(forMemArr.length>0) {
						this.obj.forMember = [forMemArr[0].value];
						this.saveObj.forMember = [forMemArr[0].value];
					}
					this.memberList_popupRadio = memArrForPopupRadio;
					if(memArrForPopupRadio.length>0) {
						this.saveObj.member_popupRadio = this.obj.member_popupRadio = memArrForPopupRadio[0].key;
					}
					this.forMemberList_popupRadio = forMemArrForPopupRadio;
					if(forMemArrForPopupRadio.length>0) {
						this.saveObj.forMember_popupRadio = this.obj.forMember_popupRadio = forMemArrForPopupRadio[0].key;
					}
				}
				return res;
			});
		};
		const c = ()=>{
			return this.http.getOutTypeAll().then(res=>{
				if(res) {
					this.outTypeList = res;
					let v2 = '';
					const v1 = (res.find(item=>item.parent=='0')||{value:''}).value;
					if(v1) v2 = (res.find(item=>item.parent==v1)||{value:''}).value;
					this.obj.outType = [ v1, v2 ];
					this.saveObj.outType = [ v1, v2 ];
				}
				return res;
			});
		};
		const d = ()=>{
			return this.http.getComeValue().then(res=>{
				if(res) {
					const arr = res.map(item=>({ name: item.name, value: ''+item.id }));
					this.inTypeList = arr;
					if(arr.length>0) {
						this.obj.inType = [arr[0].value];
						this.saveObj.inType = [arr[0].value];
					}
				}
				return res;
			});
		};
		Promise.all([a(), b(), c(), d()]).then(res=>{
			if(res[0] && res[1] && res[2] && res[3]){
				this.saveObj.date = this.obj.date = dateFormat(new Date(), 'YYYY-MM-DD');
				this.$emit('on-component-loaded', true);
				return;
			}
			this.$emit('on-component-loaded', false);
		});
	},
	watch: {
		datas: function(newv,oldv){
			// 如果是编辑页会传入datas，再次为form设置控件值
			if(newv && newv.id){
				this.setCtrlVal(newv);
			}
		}
	},
}
</script>

<style scoped lang="less">
.mem-title-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
</style>