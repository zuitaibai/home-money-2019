<template>
	<div>
		<group gutter="0">
			<x-input title="名称" v-model="obj.name" required show-clear text-align="right" placeholder-align="right" placeholder="必填" ref="name"></x-input>
			<x-input title="金额" v-model="obj.money" required show-clear text-align="right" placeholder-align="right" placeholder="必填，只接受整数" type="number" ref="money">
				<span slot="right" style="margin-left:5px;">元</span>
			</x-input>

			<popup-radio title="[ 账目类型 ]" :options="acctypeDataSrc" v-model="obj.accType"></popup-radio>
			<div v-if="obj.accType=='0' && !ifEdit" class="vux-1px-t infor">
				* 注意：如果当前选中(币种-账户)已有存根，则此操作提交不能成功
			</div>
			<popup-picker v-if="obj.accType==100||obj.accType<0" title="出付账户 －" :data="fromToDataSrc" :columns="3" v-model="obj.fromS" show-name></popup-picker>
			<popup-picker v-if="obj.accType==100||obj.accType>=0" title="入收账户 +" :data="fromToDataSrc" :columns="3" v-model="obj.toS" show-name></popup-picker>

			<calendar v-model="obj.date" title="时间"></calendar><!--  placeholder="默认为今天" -->

			<x-input title="自分类" v-model="obj.selfType" placeholder-align="right" text-align="right"></x-input>
			<x-textarea title="备注" v-model="obj.other" :autosize="true" :rows="1" :max="500" :show-counter="false"></x-textarea>
		</group>
		<div style="padding:20px 15px 0;">
			<x-button type="primary" @click.native="submit" :disabled="submitDisabled" :show-loading="obj.submitLoading">{{ifEdit?'确认修改':'提交新账目'}}</x-button>
			<x-button type="default" @click.native="reset" v-if="!ifEdit">重 置</x-button>
		</div>

	</div>
</template>

<script>
const ID_PARSE_STR1 = 'ID_abc1JOBQ_';
const ID_PARSE_STR2 = 'ID_abc2JOBQ_';
const JION = '@@@';
const types = [
	{ key: '0', value: '存根 +'}, { key: '100', value: '转存 ±'}, { key: '1', value: '借入 +'}, { key: '2', value: '还入 +'},
	{ key: '3', value: '生意收入 +'}, { key: '-1', value: '借出 －'}, { key: '-2', value: '还出 －'}, { key: '-3', value: '生意投资 －'},
];
const ctrlsInitDefault = { name: '', money: '', selfType: '', other: '', date: '', accType: '100', submitLoading: false, fromS: [], toS: [] };

import { mapActions, mapState } from "vuex";
// Datetime, XNumber, CellBox, Checker, CheckerItem
import { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton, dateFormat } from 'vux';

export default {
	name: 'ActformAccounts',
	props: ['datas', 'addOrEdit'],
	components: { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton },
	data(){
		return {
			ifEdit: this.addOrEdit !== 'add',
			obj: {
				...ctrlsInitDefault,
			},
			acctypeDataSrc:[...types],
			saveObj: {},
			fromToDataSrc: [],
		};
	},
	computed: {
		submitDisabled(){
			return this.obj.name.trim()==='' || (''+this.obj.money).trim()==='';
		},
	},
	methods: {
		...mapActions('listAccounts', ['updateItem']),
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
				obser = this.http.updateDetailAccounts(id, data);
			}else{
				tipWord = '新建';
				obser = this.http.addDetailAccounts(data);
			}
			obser.then(res=>{
				this.obj.submitLoading = false;
				if(res){
					if(res.affectedRows == 1){
						this.$vux.toast.show({ text: `${tipWord}成功` });
						if(this.ifEdit){
							// 更新store的item
							this.updateItem({...data, id});

							this.$router.go(-1);
							return;
						}
						this.reset();
					} else if(res.isExistCung === 'yet' && res.status === 'fail') {
						this.$vux.toast.show({ text: `已存在此人此币种的存根，${tipWord}失败` });
					} else {
						this.$vux.toast.show({ text: `${tipWord}失败` });
					}
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
		setCtrlVal(o, ifEdit){
			const obj = {
				name : o.name,
				money : o.money,
				selfType : o.dtype||'',
				other : o.other||'',
				date : o.date_sign,
				accType: ''+o.type,
			};
			let a1 = o.memberKey_from, a2 = o.bankTypeKey_from, a3 = ''+o.bankKey_from;
			let b1 = o.memberKey_to, b2 = o.bankTypeKey_to, b3 = ''+o.bankKey_to;
			let smItem;
			a1 = `${ID_PARSE_STR1}${JION}${a1}`;
			smItem = this.fromToDataSrc.find(item=>item.parent==a1);
			if(smItem){
				const v2 = smItem.value;
				const pre = v2.substring(0, v2.indexOf(JION)+3);
				a2 = pre + a2;
			}
			obj.fromS = [a1, a2, a3];
			b1 = `${ID_PARSE_STR1}${JION}${b1}`;
			smItem = this.fromToDataSrc.find(item=>item.parent==b1);
			if(smItem){
				const v2 = smItem.value;
				const pre = v2.substring(0, v2.indexOf(JION)+3);
				b2 = pre + b2;
			}
			obj.toS = [b1, b2, b3];

			if(ifEdit){
				if(o.type!=0) this.acctypeDataSrc = this.acctypeDataSrc.filter(item=>item.key!=0);
			}

			this.obj = {...this.obj, ...obj};
		},
		getCtrlVal(){
			let { name, money, selfType, other, date, accType, fromS, toS } = this.obj;
			let memberKey_from = fromS[0];
			memberKey_from = memberKey_from.substring(memberKey_from.indexOf(JION)+3);
			memberKey_from = Number(memberKey_from);
			let bankTypeKey_from = fromS[1];
			bankTypeKey_from = bankTypeKey_from.substring(bankTypeKey_from.indexOf(JION)+3);
			bankTypeKey_from = Number(bankTypeKey_from);
			let bankKey_from = fromS[2];
			bankKey_from = Number(bankKey_from);
			let memberKey_to = toS[0];
			memberKey_to = memberKey_to.substring(memberKey_to.indexOf(JION)+3);
			memberKey_to = Number(memberKey_to);
			let bankTypeKey_to = toS[1];
			bankTypeKey_to = bankTypeKey_to.substring(bankTypeKey_to.indexOf(JION)+3);
			bankTypeKey_to = Number(bankTypeKey_to);
			let bankKey_to = toS[2];
			bankKey_to = Number(bankKey_to);
			return {
				name,
				money: Number(money||0),
				dtype: selfType,
				other,
				date_sign: date,
				type: Number(accType),
				memberKey_from,
				bankTypeKey_from,
				bankKey_from,
				memberKey_to,
				bankTypeKey_to,
				bankKey_to,
			};
		},
	},
	created(){
		Promise.all([this.http.getMoneyTypeAll(), this.http.getMemberValue()]).then(res=>{
			if(res[0] && res[1]){
				this.saveObj.date = this.obj.date = dateFormat(new Date(), 'YYYY-MM-DD');
				//转化三级联动所需格式
				const money = res[0];
				let member = res[1];
				member = member.filter(item=>item.ifhome===1);
				const smember = member.map(item=>({ name: item.name, value: ID_PARSE_STR1+JION+item.id, parent: 0 }));
				const arr = smember.map((mem, index)=>{
					const a = [...money].map(item=>{
						let name = item.name, value, parent;
						if(item.parent==0){
							parent = mem.value;
							value = `${ID_PARSE_STR2}${index}_${JION}`+item.value;
						}else{
							parent = `${ID_PARSE_STR2}${index}_${JION}`+item.parent;
							value = item.value;
						}
						return {name, value, parent};
					});
					return a;
				});
				arr.unshift(smember);
				let ok = arr.flat(2)
				this.fromToDataSrc = ok;

				let a = '', b = '', c = '';
				const smItem_1 = ok.find(item=>item.parent == 0);
				if(smItem_1){
					a = smItem_1.value;
					const smItem_2 = ok.find(item=>item.parent == a);
					if(smItem_2){
						b = smItem_2.value;
						const smItem_3 = ok.find(item=>item.parent == b);
						if(smItem_3){
							c = smItem_3.value;
						}
					}
				}
				//设置三级联动初始值及暂存
				this.obj.fromS = [a, b, c];
				this.saveObj.fromS = [a, b, c];
				this.obj.toS = [a, b, c];
				this.saveObj.toS = [a, b, c];

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
				this.setCtrlVal(newv, this.ifEdit);
			}
		}
	},
}
</script>

<style scoped lang="less">
.infor{
	color: rgba(1, 60, 187, 0.4); font-size: 13px; padding: 5px 3.2em; margin-left: 15px; line-height: 1.4;
}
.checker-w{
	padding:10px 0;
	text-align: center;
}
.checker-item {
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  padding: 0 5px;
  line-height: 1.4;
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
</style>