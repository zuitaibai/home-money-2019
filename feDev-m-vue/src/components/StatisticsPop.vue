<template>
	<div v-transfer-dom>
		<popup v-model="showing" position="bottom" :popup-style="{'max-height':'85%'}" should-scroll-top-on-show>
			<!-- pay -->
			<div v-if="popInfo.type==='zhichu'" class="ff-div">
				<div class="fix" style="padding-top:12px;">
					<span class="l">{{popInfo.date}}支出：</span>
					<span class="r">¥ <span class="b">{{popInfo.money}}</span></span>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr class="mm-tr-"><td class="b">虚拟</td><td>&nbsp;</td><td class="money-td">{{thePop.zhichu.xuniXianjin.xuni}}</td></tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr class="mm-tr-"><td class="b">现金</td><td>&nbsp;</td><td class="money-td">{{thePop.zhichu.xuniXianjin.xianjin}}</td></tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr>
							<th colspan="5" class="fix">
								<span class="l">支出账户</span>
								<span class="r" style="font-weight:normal;">{{getSum2('zhichu')}}</span>
							</th>
						</tr>
						<tr v-for="(item,index) in thePop.zhichu.bizhongList" :key="index+'_zhichu_bizhong'">
							<td>{{item.memberName}}</td>
							<td>{{item.bankName}}</td>
							<td>{{item.banktypeName}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr> <th colspan="3">消费对象</th> </tr>
						<tr v-for="(item,index) in thePop.zhichu.forMemberList" :key="index+'_zhichu_duixiang'">
							<td>{{item.forMemberName}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr> <th colspan="3">类别</th> </tr>
						<tr v-for="(item,index) in thePop.zhichu.typeList" :key="index+'_zhichu_type'">
							<td>{{item.id==-100?'[':''}}{{item.name}}{{item.id==-100?']':''}}{{item.id==-100?'':':'}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
				<p style="padding:5px;font-size:13px;"> （注：生意亏损不包含在支出总数里）</p>
			</div>
			<!-- come -->
			<div v-else-if="popInfo.type==='shouru'" class="ff-div">
				<div class="fix" style="padding-top:12px;">
					<span class="l">{{popInfo.date}}收入：</span>
					<span class="r">¥ <span class="b">{{popInfo.money}}</span></span>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr class="mm-tr-"><td class="b">虚拟</td><td>&nbsp;</td><td class="money-td">{{thePop.shouru.xuniXianjin.xuni}}</td></tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr class="mm-tr-"><td class="b">现金</td><td>&nbsp;</td><td class="money-td">{{thePop.shouru.xuniXianjin.xianjin}}</td></tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr>
							<th colspan="5" class="fix">
								<span class="l">收入账户</span>
								<span class="r" style="font-weight:normal;">{{getSum2('shouru')}}</span>
							</th>
						</tr>
						<tr v-for="(item,index) in thePop.shouru.bizhongList" :key="index+'_shouru_bizhong'">
							<td>{{item.memberName}}</td>
							<td>{{item.bankName}}</td>
							<td>{{item.banktypeName}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
				<div class="tablediv">
					<table class="tb_normal">
						<tr> <th colspan="3">类别</th> </tr>
						<tr v-for="(item,index) in thePop.shouru.typeList" :key="index+'_shouru_type'">
							<td>{{item.id==-100?'[':''}}{{item.name}}{{item.id==-100?']':''}}{{item.id==-100?'':':'}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
				<p style="padding:5px;font-size:13px;"> （注：生意利润不包含在收入总数里）</p>
			</div>
			<!-- cha e -->
			<div v-else-if="popInfo.type==='z_cha_e'" class="ff-div">
				<div class="fix" style="padding-top:12px;">
					<span class="l">{{popInfo.date}}帐户差额：</span>
					<span class="r">¥ <span class="b">{{popInfo.money}}</span></span>
				</div>
				<div class="tablediv" v-for="(value, name, index) in thePop.z_cha_e" :key="index+name+'_z_cha_e'">
					<table class="tb_normal">
						<tr>
							<th colspan="4" class="fix">
								<span class="l">{{name}}</span>
								<span class="r" style="font-weight:normal;">{{getSum1(value, true)}}</span>
							</th>
						</tr>
						<tr v-for="(item,indd) in value" :key="indd+'_'+index+name+'_z_cha_e'">
							<td>{{item.bankTypeName}}</td>
							<td>{{item.bankName}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
			</div>
			<!-- yu e -->
			<div v-else-if="popInfo.type==='yu_e'" class="ff-div">
				<div class="fix" style="padding-top:12px;">
					<span class="l">{{popInfo.date}}账户余额：</span>
					<span class="r">¥ <span class="b">{{popInfo.money}}</span></span>
				</div>
				<div class="tablediv" v-for="(value, name, index) in thePop.yu_e" :key="index+name+'_yu_e'">
					<table class="tb_normal">
						<tr>
							<th colspan="4" class="fix">
								<span class="l">{{name}}</span>
								<span class="r" style="font-weight:normal;">{{getSum1(value)}}</span>
							</th>
						</tr>
						<tr v-for="(item,indd) in value" :key="indd+'_'+index+name+'_yu_e'">
							<td>{{item.bankTypeName}}</td>
							<td>{{item.bankName}}</td>
							<td>&nbsp;</td>
							<td class="money-td">{{item.money}}</td>
						</tr>
					</table>
				</div>
			</div>
			<div style="width:90%;margin:20px auto 0;padding-bottom:5px;">
				<x-button action-type="button" type="primary" @click.native="closePop">关 闭</x-button>
			</div>
		</popup>
	</div>
</template>

<script>
	import { Popup, XButton, TransferDomDirective as TransferDom } from 'vux';
	export default {
		name: "StatisticsPop",
		directives: { TransferDom },
		components: { Popup, XButton },
		props: ['thePop', 'popInfo'],
		computed: {
			showing:{
				get: function(){ return this.thePop.show },
				set: function(nv){ if(nv===false) this.closePop(); }
			},
		},
		methods: {
			closePop: function(){
				this.$emit('on-close');
			},
			getSum1(arr, ifChaE){
				let r = arr.reduce((r,cur)=>r+Number(cur.money), 0) || 0;
				if(ifChaE && r>0) r = '+' +r;
				return r;
			},
			getSum2(type){
				const arr = this.thePop[type].bizhongList;
				const o = {};
				arr.forEach(item => {
					if(o[item.memberName]) o[item.memberName] += Number(item.money);
					else o[item.memberName] = Number(item.money);
				});
				return Object.keys(o).map(name=>name+':'+o[name]).join('　');
			},
		},
	};
</script>

<style scoped lang="less">
.ff-div{width:90%;margin:0 auto;}
.tablediv{
	padding-top:13px;
	.tb_normal{
		font-size:14px;border-collapse:collapse;border-spacing:0;width:100%;
		th{font-size:inherit;font-weight:bold;}
		th,td{border:1px solid #ccc;height:40px;}
		.mm-tr-{background:rgba(189, 189, 189, 0.6);}
		border-right:1px solid #ccc;border-left:1px solid #ccc; 
		th{text-align: left;background:#bdbdbd;}
		th,td{border-left:none;border-right:none;}
		.money-td{color: #af4c33;text-align: right;}
		tr{
			background:#fff;
			th:nth-child(1),td:nth-child(1){padding-left:.8em;}
			th:last-child,td:last-child{padding-right:.8em;}
		}
	}	
}
</style>
