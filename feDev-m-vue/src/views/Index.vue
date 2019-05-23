<template>
	<div style="padding-top:10px;">
		<divider>今年概况</divider>
		<card>
			<div slot="content" class="total-num">
				<div class="vux-1px-r"><span>{{basic.shouru}}</span><br/>收入</div>
				<div class="vux-1px-r"><span>{{basic.huanru}}</span><br/>还入</div>
				<div class="vux-1px-r"><span>{{basic.jieru}}</span><br/>借入</div>
				<div><span>{{basic.shengyi_shouru}}</span><br/>商业收益</div>
			</div></card>
		<card style="margin-bottom:20px;">
			<div slot="content" class="total-num">
				<div class="vux-1px-r"><span>{{basic.zhichu}}</span><br/>支出</div>
				<div class="vux-1px-r"><span>{{basic.jiechu}}</span><br/>借出</div>
				<div class="vux-1px-r"><span>{{basic.huanchu}}</span><br/>还出</div>
				<div><span>{{basic.shengyi_touzi}}</span><br/>商业投资</div>
			</div>
		</card>

		<divider>收入 · 类别</divider>
		<div class="tubiao tubiao1" ref="tubiao1">
			<v-chart :data="srCake.data">
				<v-tooltip />
				<v-pie :radius="0.85" series-field="name" />
				<v-legend :options="srCake.legendOptions" />
			</v-chart>
		</div>

		<divider>收入 · 帐户</divider>
		<div class="sw">
			<div class="zcEh" v-for="(value,key) in srAcc" :key="key+'_sr'">
				<div>{{key}}</div>
				<div>
					<div class="zcEh-s" v-for="(v2,k2) in value" :key="key+'_sr'+k2">
						<div>{{k2}}</div>
						<div>
							<div class="zcEh-s-s" v-for="(item,index) in v2" :key="key+'_sr'+v2+index">
								<div>{{item.bankName}}</div>
								<div>{{item.money}}</div>
							</div>
						</div>
					</div>
				</div>
				<div>{{srAccSub[key]}}</div>
			</div>
		</div>

		<divider>支出 · 类别</divider>
		<div class="tubiao">
			<v-chart :data="zcType" ref="zcType">
				<v-bar :colors="['#FCCE10','#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#B5C334']" />
				<v-tooltip :show-x-value="true" />
			</v-chart>
		</div>
		

		<divider>支出 · 消费对象</divider>
		<div class="tubiao">
			<v-chart :data="zcForwho" ref="zcForwho">
				<v-bar :colors="['#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#B5C334','#FCCE10']" />
				<v-tooltip :show-x-value="true" />
			</v-chart>
		</div>

		<divider>支出 · 帐户</divider>
		<div class="sw">
			<div class="zcEh" v-for="(value,key) in zcAcc" :key="key+'_zc'">
				<div>{{key}}</div>
				<div>
					<div class="zcEh-s" v-for="(v2,k2) in value" :key="key+'_zc'+k2">
						<div>{{k2}}</div>
						<div>
							<div class="zcEh-s-s" v-for="(item,index) in v2" :key="key+'_zc'+v2+index">
								<div>{{item.bankName}}</div>
								<div>{{item.money}}</div>
							</div>
						</div>
					</div>
				</div>
				<div>{{zcAccSub[key]}}</div>
			</div>
		</div>

		<divider>余额资产 · ￥{{basic.yu_e}}</divider>
		<div class="sw">
			<div class="zcEh" v-for="(value,key) in yeAcc" :key="key+'_ye'">
				<div>{{key}}</div>
				<div>
					<div class="zcEh-s" v-for="(v2,k2) in value" :key="key+'_ye'+k2">
						<div>{{k2}}</div>
						<div>
							<div class="zcEh-s-s" v-for="(item,index) in v2" :key="key+'_ye'+v2+index">
								<div>{{item.bankName}}</div>
								<div>{{item.money}}</div>
							</div>
						</div>
					</div>
				</div>
				<div>{{yeAccSub[key]}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { local } from "@/config";
const en = "index";
const cn = local.pgKey2Cn[en];
import { mapActions } from "vuex";
// , VLine, VArea
import { Divider, Card, VChart, VTooltip, VLegend, VBar, VPie, VScale } from "vux";

export default {
	name: en,
	// , VLine, VArea
	components:{ Divider, Card, VChart, VTooltip, VLegend, VBar, VPie, VScale },
	data(){
		return {
			zcType: [{name: '', money:0}],
			zcForwho: [{name: '', money:0}],
			srCake: {
				legendOptions: {
					position: 'right',
					itemFormatter: val => val + ' ' + (this.srCake.data.find(item=>item.name==val) || {}).money
				},
				data: [{}]
			},
			zcAcc: {},
			zcAccSub: {},
			srAcc: {},
			srAccSub: {},
			yeAcc: {},
			yeAccSub: {},
			basic: {},
		}
	},
	methods: {
		...mapActions(["setNavigationTitle"]),
	},
	mounted() {
		this.setNavigationTitle(cn);
	},
	created(){
		this.http.getZhichu().then(res=>{
			if(!res) return;
			this.zcType = res.typeList.map(item=>({
				name: item.name.length>2 ? item.name.substring(0,1)+item.name.substring(2,3) : item.name, 
				money: item.money
			})).sort((a,b)=>b.money-a.money);
			this.zcForwho = res.forMemberList.map(item=>({
				name: item.forMemberName,
				money: item.money
			})).sort((a,b)=>b.money-a.money);
			// this.$refs.zcType.rerender();
			
			res.bizhongList.sort((a,b)=> {
				const c = a.memberKey- b.memberKey;
				if(c===0) return b.bankTypeKey - a.bankTypeKey;
				return c;
			});
			const o = {}, m = {};
			res.bizhongList.forEach(item=>{
				if(m[item.memberName]) m[item.memberName] += item.money;
				else m[item.memberName] = item.money;

				if(o[item.memberName]) {
					if(o[item.memberName][item.banktypeName]) o[item.memberName][item.banktypeName].push(item);
					else o[item.memberName][item.banktypeName] = [item];
				}
				else {
					o[item.memberName] = { [item.banktypeName]: [item]};
				}
			});
			this.zcAcc = o;
			this.zcAccSub = m;
		});
		this.http.getShouru().then(res=>{
			if(!res) return;
			const allMoney = res.typeList.reduce((t, item)=>t+item.money, 0);
			this.srCake.data = res.typeList.map(item=>({
				name: item.name,
				percent: (item.money / allMoney).toFixed(2)*1,
				money: item.money
			}));

			res.bizhongList.sort((a,b)=> {
				const c = a.memberKey- b.memberKey;
				if(c===0) return b.bankTypeKey - a.bankTypeKey;
				return c;
			});
			const o = {}, m = {};
			res.bizhongList.forEach(item=>{
				if(m[item.memberName]) m[item.memberName] += item.money;
				else m[item.memberName] = item.money;

				if(o[item.memberName]) {
					if(o[item.memberName][item.banktypeName]) o[item.memberName][item.banktypeName].push(item);
					else o[item.memberName][item.banktypeName] = [item];
				}
				else {
					o[item.memberName] = { [item.banktypeName]: [item]};
				}
			});
			this.srAcc = o;
			this.srAccSub = m;
			this.$nextTick(()=>{
				this.$refs.tubiao1.firstElementChild.style.backgroundColor='rgba(255, 255, 255, 0)';
			});
		});
		this.http.getYuE().then(res=>{
			if(!res) return;
			const o = {}, om = {};
			Object.keys(res).forEach(key=>{
				let t = 0;
				o[key] = {};
				res[key].forEach(item=>{
					if(o[key][item.bankTypeName]) o[key][item.bankTypeName].push(item);
					else o[key][item.bankTypeName] = [item];
					t += item.money;
				});
				om[key] = t;
			});
			this.yeAcc = o;
			this.yeAccSub = om;
		});

		const date = new Date();
		const y = date.getFullYear();
		const m = ('000' + (date.getMonth() + 1)).slice(-2);
		const d = ('000' + date.getDate()).slice(-2);
		this.http.getIndexTotal({
            date_sign_start: y + '-01-01',
            date_sign_end: y + '-' + m +'-' + d,
            tongjidw: 'year',
            pageSize: 10,
            currentPage: 1
        }).then(res=>{
			if(!res) return;
			if (res.listArr && res.listArr.length) {
                this.basic = { ...res.listArr[0] };
            }
		});
	},
};
</script>

<style scroped lang="less">
.total-num {
	display: flex;padding: 5px 0;
	&>div{
		flex: 1; text-align: center; font-size: 12px;
		span{color: #f74c31;}
	}
}

.zcEh{
	font-size:13px;
	display:flex;
	align-items: center;
	border:1px dashed #ccc;
	color:#666;
	line-height: 1.7;
	div{box-sizing: border-box;padding-left:4px;}
	&>div{
		&:nth-child(1){width:40px;}
		&:nth-child(2){flex:1;border-right:1px solid #ccc;}
		&:nth-child(3){width:57px;}
	}
	.zcEh-s{
		display: flex;
		align-items: center;
		border-left:1px solid #ccc;
		&:not(:last-child){border-bottom:1px solid #ccc;}
		&>div:nth-child(1){width:64px;}
		&>div:nth-child(2){flex:1;}
		.zcEh-s-s{
			display: flex;
			border-left:1px solid #ccc;
			&:not(:last-child){border-bottom:1px solid #ccc;}
			&>div:nth-child(1){width:80px;}
			&>div:nth-child(2){flex:1;border-left:1px solid #ccc;color:#000;padding-left:6px;}
		}
	}
}
.sw{
	padding: 16px 10px 30px;
}
.tubiao{
	overflow-x: auto;
	margin: -10px 0 10px;
	&.tubiao1{margin-top:-30px;margin-bottom:0;}
}


</style>


