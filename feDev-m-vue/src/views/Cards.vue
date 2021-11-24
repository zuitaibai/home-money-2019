<template>
	<div style="padding:16px 10px 0;" class="forCtrlColor">

		<transition name="slide-left">
			<div v-if="formShow">
				<group :title="formType=='add'?'新增卡片':'编辑卡片'">
					<popup-picker title="银行" :data="form.bankList" :columns="1" v-model="form.bank" show-name></popup-picker>
					<x-input title="卡号" v-model="form.num" show-clear text-align="right" placeholder-align="right"></x-input>
					<x-input title="别名" v-model="form.sname" show-clear text-align="right" placeholder-align="right"></x-input>
					<popup-radio title="成员" :options="form.memberList" v-model="form.memberKey"></popup-radio>
					<cell-box style="justify-content:space-between;">
						卡种
						<checker v-model="form.bankTypeKey" :radio-required="true"  default-item-class="checker-item" selected-item-class="checker-item-selected">
							<checker-item value="2">借记卡</checker-item><checker-item value="3">信用卡</checker-item><checker-item value="5">其它</checker-item>
						</checker>
					</cell-box>
					<x-input title="有效期" v-model="form.validityPeriod" show-clear text-align="right" placeholder-align="right"></x-input>
					<x-input title="背三数" v-model="form.threeNum" show-clear text-align="right" placeholder-align="right"></x-input>
					<x-textarea title="备注" show-clear v-model="form.other" :autosize="true" :rows="1" :max="500" :show-counter="false"></x-textarea>
				</group>
				<div style="margin-top:20px;">
					<flexbox>
						<flexbox-item :span="4" v-if="formType=='edit'"><x-button type="warn" :show-loading="delLoading" @click.native="delCard(3)">删除</x-button></flexbox-item>
						<flexbox-item :span="formType=='edit'?5:7"><x-button type="primary" :show-loading="sbtLoading" @click.native="formSubmit">{{formType=='edit'?'修改':'新增'}}</x-button></flexbox-item>
						<flexbox-item><x-button @click.native="formShow = false">取消</x-button></flexbox-item>
					</flexbox>
				</div>
			</div>
		</transition>
		<transition name="slide-right">
			<div v-if="!formShow">
				<div v-for="(value, key, index) in picsList" :key="key+'_'+index" :style="{marginTop: index!==0?'16px':''}">
					<div style="margin:0 20px;"><divider>{{key}}</divider></div>
					<!-- <swiper :list="pic1List" v-model="pic1Index" @on-index-change="pic1IndexChange" :aspect-ratio="500/800" :show-desc-mask="false"></swiper> -->
					<swiper auto v-model="picsIndexs[index]" :aspect-ratio="501/800" :show-desc-mask="false" dots-position="left">
						<swiper-item class="swiper-item" v-for="(item, index) in value" :key="index+'_'+item.id">
							<img :src="item.img" alt="">
							<div class="card-word card-num">{{item.num}}</div>
							<div class="card-word card-type">{{item.type}}</div>
							<div class="card-word card-name">{{item.name}}</div>
							<div class="card-mask" @click="clickPic(key, item)"></div>
						</swiper-item>
					</swiper>
				</div>
				<divider style="margin-top:16px;">*</divider>
				<div style="color:#ccc;font-size:14px;margin-top:-10px;" class="fix">
					<span class="l">^_^ 点击卡片管理</span>
					<a class="r" href="javascript:;" @click="resetShowForm('add')">+ 添加卡片</a>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { local } from "@/config";
const en = 'cards';
const cn = local.pgKey2Cn[en];

import { mapActions } from "vuex";

import { Swiper, SwiperItem, Divider, Group, XInput, PopupPicker, PopupRadio, XButton, XTextarea, Checker, CheckerItem, CellBox, Flexbox, FlexboxItem } from 'vux';
/* import {Swiper, SwiperItem} from 'vux/src/components/swiper/index.js';
import Divider from 'vux/src/components/divider/index.vue';
import Group from 'vux/src/components/group/index.vue';
import XInput from 'vux/src/components/x-input/index.vue';
import PopupPicker from 'vux/src/components/popup-picker/index.vue';
import PopupRadio from 'vux/src/components/popup-radio/index.vue';
import XTextarea from 'vux/src/components/x-textarea/index.vue';
import XButton from 'vux/src/components/x-button/index.vue';
import {Checker, CheckerItem} from 'vux/src/components/checker/index.js';
import CellBox from 'vux/src/components/cell-box/index.vue';
import {Flexbox, FlexboxItem} from 'vux/src/components/flexbox/index.js'; */



import pic_normal from '../assets/card/normal.png';
import pic_gongShang from '../assets/card/gongShang.png';
import pic_guangFa from '../assets/card/guangFa.png';
import pic_jianShe from '../assets/card/jianShe.png';
import pic_jiaoTong from '../assets/card/jiaoTong.png';
import pic_minSheng from '../assets/card/minSheng.png';
import pic_nongShang from '../assets/card/nongShang.png';
import pic_nongYe from '../assets/card/nongYe.png';
import pic_youZheng from '../assets/card/youZheng.png';
import pic_zhaoShang from '../assets/card/zhaoShang.png';
import pic_zhongGuo from '../assets/card/zhongGuo.png';
import pic_beiJing from '../assets/card/beiJing.png';

const serv2local = {
	'1': pic_zhaoShang,
	'2': pic_guangFa,
	'3': pic_gongShang,
	'4': pic_jiaoTong,
	'5': pic_zhongGuo,
	'6': pic_jianShe,
	'7': pic_minSheng,
	'8': pic_beiJing,
	'9': pic_nongShang,
	'10': pic_nongYe,
	'11': pic_youZheng,
	'13': pic_normal,
};

const formDataInit =  {
	sname: '',
	num: '',
	validityPeriod: '',
	threeNum: '',
	bankTypeKey: '2',
	other: '',
};

export default {
	name: en,
	components: { Swiper, SwiperItem, Divider, Group, XInput, PopupPicker, PopupRadio, XButton, XTextarea, Checker, CheckerItem, CellBox, Flexbox, FlexboxItem },
	data(){
		return {
			/*
			// pic1List:
			{
				'公共': [
					{ img: pic_normal, name: '什么', type: '借记卡', num: '5678 5623 8958 4721 0020 325', id: 666, memberKey: 2, cardTypeKey: 3 }
				]
			}
			*/
			picsList: {},
			picsIndexs: [],
			banks: {},
			members: {},
			banktypes: {},
			dataSrc: {},
			formShow: false,
			formType: 'add',
			sbtLoading: false,
			delLoading: false,
			formId: 0,
			form: {
				...formDataInit,
				memberList: [],
				memberKey: '',
				bankList: [],
				bank: [],
			},
			save: { memberKey:'', bank: [] },
		}
	},
	methods: {
		...mapActions(['setNavigationTitle', 'setLoading']),
		resetShowForm(str){
			this.formType = str;
			this.sbtLoading = this.delLoading = false;
			this.formShow = true;
			this.form = {...this.form, ...formDataInit, ...this.save};
		},
		delCard(){
			if(!this.formId) return;
			this.$vux.confirm.show({
				title: '确定要么？',
				content: `数据有风险，删除需谨慎`,
				onConfirm : () => {
					this.delLoading = true;
					this.http.delCard(this.formId).then(res => {
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
		formSubmit(){
			if(!this.formId) return;
			this.$vux.confirm.show({
				content: `确定要${this.formType ==='edit' ? '修改' : '新增'}？`,
				onConfirm : () => {
					this.sbtLoading = true;
					let {sname, num, validityPeriod, threeNum, other, memberKey, bankTypeKey, bank} = this.form;
					let data = {
						sname,
						num,
						validityPeriod,
						threeNum,
						other,
						memberKey: Number(memberKey),
						bankTypeKey: Number(bankTypeKey),
						bankKey: Number(bank[0]),
					};
					let methodPromiseDone;
					if(this.formType === 'edit'){
						methodPromiseDone = this.http.updateCard(this.formId, data);
					}else if(this.formType === 'add'){
						methodPromiseDone = this.http.addCard(data);
					}
					methodPromiseDone.then(res => {
						this.sbtLoading = false;
						if(res){
							let tipWord = this.formType === 'edit'?'编辑':'添加';
							if(res.affectedRows === 1){
								/* if(this.formType ==='add') this.$vux.toast.show({ text: '添加成功', time: 1000});
								else{
									// changedRows: 如果提交和现有数据一致，没有改动，changedRows为0
									if(res.changedRows === 1)  this.$vux.toast.show({ text: '编辑成功', time: 1000});
									else this.$vux.toast.show({ text: '编辑失败', time: 1000});
								} */
								this.$vux.toast.show({ text: `${tipWord}成功`, time: 1000});
								this.getPage();
							}else {
								this.$vux.toast.show({ text: `${tipWord}失败`, time: 1000});
							}
						}
					});
				}
			});
		},
		clickPic(cnKey, picItem){
			this.resetShowForm('edit');
			let {id, memberKey, cardTypeKey} = picItem;
			let dataThis = this.dataSrc[memberKey][cardTypeKey].find(arrItem=>arrItem.id==id);
			this.formId = id;
			// console.log(dataThis);
			/* {
				sname: "广发卡", num: "6225683721003149608", validityPeriod: "", threeNum: "", other: "", bankTypeKey: 2, memberKey: 2, bankKey: 2,
				pay: 0, yu_e: 0, income: 0, bankName: "广发", bankTypeName: "借记卡",memberName: "老公", num2: "6225 6837 2100 3149 608",
				cungen: 0, id: 2, if_show: 0
			} */
			let {sname, num, validityPeriod, threeNum, other, bankTypeKey, bankKey} = dataThis;
			this.form = {
				...this.form,
				sname: sname || '',
				num: num || '',
				validityPeriod: validityPeriod || '',
				threeNum: threeNum || '',
				other: other || '',
				memberKey,
				bankTypeKey: ''+bankTypeKey,
				bank: [''+bankKey],
			}
		},

		getPage(){
			this.formShow = false;
			this.setLoading({text: '', show: true});
			this.http.getListCards().then(res=>{
				this.setLoading({text: '', show: false});
				if(res){
					let {list, members, banks, banktypes, } = res;

					let swiperrO = {}, swiperrIndexs = [];
					Object.keys(list).forEach(memberKey=>{
						let cardTypesO = list[memberKey] || {};
						let arr = [];
						Object.keys(cardTypesO).forEach(cardTypeKey=>{
							arr.push(...cardTypesO[cardTypeKey].map(item=>({
								name: item.sname, type: banktypes[cardTypeKey] || '未知',
								num: item.num2, img: serv2local[item.bankKey] || pic_normal,
								// swiper不使用：
								id: item.id, memberKey: ''+memberKey, cardTypeKey: cardTypeKey
							})));
						});
						swiperrO[members[memberKey]] = arr;
						swiperrIndexs.push(0);
					});
					this.picsList = swiperrO;
					this.picsIndexs = swiperrIndexs;

					// this.banks = banks;
					// this.members = members;
					// this.banktypes = banktypes;
					this.dataSrc = list;

					this.form.memberList = Object.keys(members).map(key=>({value: members[key], key}));
					if(this.form.memberList.length>0) {
						this.form.memberKey = this.form.memberList[0].key;
						this.save.memberKey = this.form.memberList[0].key;
					}
					this.form.bankList = Object.keys(banks).map(key=>({name: banks[key], value: key}));
					if(this.form.bankList.length>0) {
						this.form.bank = [this.form.bankList[0].value];
						this.save.bank = [this.form.bankList[0].value];
					}
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
.swiper-item {
	img{width: 100%;}
	.card-word{
		position: absolute;background:rgba(0, 0, 0, 0.6);height:34px;line-height:34px;padding-left:10px;
		overflow: hidden;text-overflow: ellipsis;box-sizing: border-box;border-radius: 2px;
	}
	.card-num{ left: 7%; top: 46%; right: 5%;padding-right:10px;color:#fff;font-size:18px;}
	.card-type{left: 7%; top: calc(46% + 34px + 7px);width:68px;color:yellow;}
	.card-name{left: calc(8% + 68px + 8px); top: calc(46% + 34px + 7px);padding-right:13px;color:rgba(145, 255, 0, 1);}
	.card-mask{position: absolute;left:0;right:0;top:0;bottom:0;}
}

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
.forCtrlColor{
    & /deep/ .vux-cell-value{color: #a168fd; }
    & /deep/ .weui-input{color: #a168fd; }
    & /deep/ .weui-textarea{color: #a168fd;text-align: right;}
    & /deep/ .weui-cell__ft{color: #a168fd;}
    & /deep/ .checker-item-selected{border-color: #a168fd;}
}
</style>

