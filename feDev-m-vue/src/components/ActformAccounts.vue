<template>

	<div>
		<group gutter="0" class="forCtrlColor">
			<x-input title="名称" v-model="obj.name" required show-clear text-align="right" placeholder-align="right" placeholder="必填" ref="name"></x-input>
			<x-input title="金额" v-model="obj.money" required show-clear text-align="right" placeholder-align="right" placeholder="必填，只接受整数" type="number" ref="money">
				<span slot="right" style="margin-left:5px;color:#888">元</span>
			</x-input>

			<popup-radio title="[ 账目类型 ]" :options="acctypeDataSrc" v-model="obj.accType" @on-show="typeDiff=obj.accType" @on-hide="onAccTypeChange" :readonly="ifEdit" :class="{myReadonly: ifEdit}"></popup-radio>
			<div v-if="obj.accType=='0' && !ifEdit" class="vux-1px-t infor">
				* 注意：如果当前选中(币种-账户)已有存根，则此操作提交不能成功
			</div>


            <cell v-if="obj.accType==2||obj.accType==-2" title="对应帐目" @click.native="openChooseListModal" is-link :disabled="ifEdit">
                <span>{{obj.targetId}}</span>
                <span class="mnobskk" v-show="obj.targetId==''">必填，请选择</span>
            </cell>


			<popup-picker v-if="obj.accType==100||obj.accType<0" title="出付账户 －" :data="fromToDataSrc" :columns="3" v-model="obj.fromS" show-name></popup-picker>



            <x-input v-if="obj.accType==1||obj.accType==-1||(ifEdit && (obj.accType==2||obj.accType==-2))" :title="{'1': '由', '-1': '至','2': '由', '-2': '至'}[obj.accType]+'对方'" v-model="obj.personName" required show-clear placeholder-align="right" text-align="right" placeholder="必填，以后不可更改" ref="personName" :readonly="ifEdit" :class="{myReadonly: ifEdit}"></x-input>


			<popup-picker v-if="obj.accType==100||obj.accType>=0" title="入收账户 +" :data="fromToDataSrc" :columns="3" v-model="obj.toS" show-name></popup-picker>

			<calendar v-model="obj.date" title="时间"></calendar><!--  placeholder="默认为今天" -->

			<x-input title="自分类" v-model="obj.selfType" placeholder-align="right" text-align="right"></x-input>
			<x-textarea title="备注" v-model="obj.other" :autosize="true" :rows="1" :max="500" :show-counter="false"></x-textarea>
		</group>
		<div style="padding:20px 15px 0;">
			<x-button type="primary" @click.native="submit" :disabled="submitDisabled" :show-loading="obj.submitLoading">{{ifEdit?'确认修改':'提交新账目'}}</x-button>
			<x-button type="default" @click.native="reset" v-if="!ifEdit">重 置</x-button>
		</div>

        <div v-transfer-dom>
            <popup v-model="chooseListModal.show" position="left" width="100%" :is-transparent="true">
                <div class="popup-inner">
                    <div class="popup-inner-t">
                        <div>{{{'2': '[借出]', '-2': '[借入]'}[this.obj.accType]||''}}列表：请选择一笔帐目</div>
                        <div href="javascript:;" @click="chooseListModal.show=false;chooseListModal.trIndex=null"><x-icon type="close-outline"></x-icon></div>
                    </div>
                    <div class="popup-inner-h">
                        <ul class="listCol b vux-1px-b">
                            <li class="li2"><p>日期</p></li>
                            <li class="li3"><p>金额</p></li>
                            <!-- <li class="li5"><p>账户</p></li> -->
                            <li class="li4"><p>名称</p></li>
                            <li class="li6"><p>ID</p></li>
                            <li class="li1"></li>
                        </ul>
                    </div>
                    <div class="popup-inner-m">
                        <div class="vux-1px-b" v-for="(item, index) in chooseListModal.list" :key="item.id">
                            <ul class="listCol item-top" @click="clickChooseListModalTr(item.id, index)">
                                <li class="li2"><p>{{item.header['1']}}</p></li>
                                <li class="li3"><p>{{item.header['2']}}</p></li>
                                <!-- <li class="li5"><p>{{item.header['4']}}</p></li> -->
                                <li class="li4"><p>{{item.header['3']}}</p></li>
                                <li class="li6"><p>{{item.id}}</p></li>
                                <li class="li1" @click.stop="checkThisTr(index, item)"><x-icon class="fbisdj" type="checkmark-circle-outline"></x-icon></li>
                            </ul>
                            <group gutter="0" v-if="index===chooseListModal.trIndex" style="margin-left:40px;">

                                <cell-form-preview :list="item.transform1" style="font-size:14px;"></cell-form-preview>

                                <cell-form-preview :list="[{label: '还款状态', value: {'0': '✘ 未还', '1': '✔ 已还', '2': '◕ 已还部分'}[item.isFinished]||'' }]" style="font-size:14px;border-top:1px solid #ccc;"></cell-form-preview>
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

                                <cell-form-preview :list="item.transform2" style="font-size:14px;"></cell-form-preview>

                            </group>
                        </div>
                        <load-more v-if="chooseListModal.loadMoreVis" tip="正在加载"></load-more>
                        <pagging-footer
                            :show="chooseListModal.pagging.totalRecord != 0 && chooseListModal.pagging.pageCount>=1"
                            :pagging="chooseListModal.pagging"
                            @on-click-next="goChooseListNextPage"
                        ></pagging-footer>
                        <load-more v-if="chooseListModal.pagging.totalRecord == 0 && !chooseListModal.loadMoreVis" :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
                    </div>
                    <div class="popup-inner-b">
                        <a href="javascript:;" @click="chooseListModal.show=false;chooseListModal.trIndex=null">关 闭</a>
                    </div>
                </div>

            </popup>
        </div>

	</div>
</template>

<script>
const ID_PARSE_STR1 = 'ID_abc1JOBQ_';
const ID_PARSE_STR2 = 'ID_abc2JOBQ_';
const JION = '@@@';
const types = [
	{ key: '100', value: '转存 ±'}, { key: '1', value: '借入 +'}, { key: '2', value: '还入 +'},
	{ key: '-1', value: '借出 －'}, { key: '-2', value: '还出 －'}, { key: '0', value: '存根 +'},
    { key: '3', value: '生意收入 +'}, { key: '-3', value: '生意投资 －'},
];
const ctrlsInitDefault = {
    name: '', money: '', selfType: '', other: '', date: '', accType: '100', submitLoading: false,
    targetId: '', personName: '', fromS: [], toS: []
};

import { Http } from '../store/storeVar';
import { mapActions, mapState } from "vuex";
import PaggingFooter from '@/components/PaggingFooter.vue';

import { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton, dateFormat, Popup, TransferDom, Cell, CellFormPreview, LoadMore } from 'vux';
/* import Group from 'vux/src/components/group/index.vue';
import XInput from 'vux/src/components/x-input/index.vue';
import PopupPicker from 'vux/src/components/popup-picker/index.vue';
import PopupRadio from 'vux/src/components/popup-radio/index.vue';
import Calendar from 'vux/src/components/calendar/index.vue';
import XTextarea from 'vux/src/components/x-textarea/index.vue';
import XButton from 'vux/src/components/x-button/index.vue';
import dateFormat from 'vux/src/tools/date/format.js';
import Popup from 'vux/src/components/popup/index.vue';
import TransferDom from 'vux/src/directives/transfer-dom/index.js';
import Cell from 'vux/src/components/cell/index.vue';
import CellFormPreview from 'vux/src/components/cell-form-preview/index.vue';
import LoadMore from 'vux/src/components/load-more/index.vue'; */

export default {
	name: 'ActformAccounts',
	props: ['datas', 'addOrEdit'],
	components: { Group, XInput, PopupPicker, PopupRadio, Calendar, XTextarea, XButton, Popup, Cell, CellFormPreview, LoadMore, PaggingFooter },
    directives: { TransferDom },
	data(){
		return {
			ifEdit: this.addOrEdit !== 'add',
			obj: {
				...ctrlsInitDefault,
			},
			acctypeDataSrc:[...types],
			saveObj: {},sf:{},
			fromToDataSrc: [],
            chooseListModal: {
                show: false,
                trIndex: '',
                list: [],
                loadMoreVis: false,
                pagging: {
                    currentPage: 1,
                    totalRecord: 0,
                    pageCount: 0
                }
            },
            typeDiff: 99999
		};
	},
	computed: {
		submitDisabled(){
            let m = this.obj.name.trim()==='' || (''+this.obj.money).trim()==='';
            let n = false;
			if(this.obj.accType==1||this.obj.accType==-1) n = this.obj.personName.trim()==='';
            else if(this.obj.accType==2||this.obj.accType==-2) n = (''+this.obj.targetId).trim()==='';
            return m || n;
		},
	},
	methods: {
		...mapActions('listAccounts', ['updateItem']),
		submit(){

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
				this.$refs.personName && this.$refs.personName.reset();
			});
		},
		setCtrlVal(o){
            const obj = {
				name : o.name,
				money : o.money,
				selfType : o.dtype||'',
				other : o.other||'',
				date : o.date_sign,
				accType: ''+o.type,
				targetId: ''+o.finishedFormIds,
				personName: ''+o.otherpartyName
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
            for(let i in obj){
                if(obj[i] === null || obj[i] === undefined || obj[i] === "undefined") obj[i] = '';
            }
            this.sf = obj;
            this.obj = {...this.obj, ...obj};
		},
		getCtrlVal(){
            function s(v){
                let str = String(v);
                return (str === 'undefined' || str === 'null' || str === 'false') ? '' : '' + v;
            }
			let { name, money, selfType, other, date, accType, fromS, toS, targetId, personName } = this.obj;
			let memberKey_from = s(fromS[0]);
			memberKey_from = memberKey_from.substring(memberKey_from.indexOf(JION)+3);
			memberKey_from = Number(memberKey_from);
			let bankTypeKey_from = s(fromS[1]);
			bankTypeKey_from = bankTypeKey_from.substring(bankTypeKey_from.indexOf(JION)+3);
			bankTypeKey_from = Number(bankTypeKey_from);
			let bankKey_from = s(fromS[2]);
			bankKey_from = Number(bankKey_from);
			let memberKey_to = s(toS[0]);
			memberKey_to = memberKey_to.substring(memberKey_to.indexOf(JION)+3);
			memberKey_to = Number(memberKey_to);
			let bankTypeKey_to = s(toS[1]);
			bankTypeKey_to = bankTypeKey_to.substring(bankTypeKey_to.indexOf(JION)+3);
			bankTypeKey_to = Number(bankTypeKey_to);
			let bankKey_to = s(toS[2]);
			bankKey_to = Number(bankKey_to);

            money = Number(money||0);
            let dtype = selfType;
            let date_sign = date;
            let type = Number(accType);
            let otherpartyName = personName;
            let finishedFormIds = targetId;

            let allHave = {name, money, dtype, other, date_sign, type}, expecil;
            switch(type){
                case 1:  //借入
                    expecil = {memberKey_to, bankTypeKey_to, bankKey_to, otherpartyName};
                    break;
                case -1:  //借出
                    expecil = {memberKey_from, bankTypeKey_from, bankKey_from, otherpartyName};
                    break;
                case 2: //还入
                    expecil = {memberKey_to, bankTypeKey_to, bankKey_to, otherpartyName, finishedFormIds};
                    break;
                case -2: //还出
                    expecil = {memberKey_from, bankTypeKey_from, bankKey_from, otherpartyName, finishedFormIds};
                    break;
                case 3: //生意收入
                    expecil = {memberKey_to, bankTypeKey_to, bankKey_to};
                    break;
                case -3: //生意投本
                    expecil = {memberKey_from, bankTypeKey_from, bankKey_from};
                    break;
                case 0: //存根
                    expecil = {memberKey_to, bankTypeKey_to, bankKey_to};
                    break;
                case 100: //转存
                    expecil = {memberKey_from, bankTypeKey_from, bankKey_from, memberKey_to, bankTypeKey_to, bankKey_to};
                    break;
                default:
                    expecil = {};
            }

            let returnn = {...allHave, ...expecil};

            if(this.ifEdit){
                delete returnn.type;
                delete returnn.otherpartyName;
                delete returnn.finishedFormIds;
            }
            return returnn;

		},
        openChooseListModal(){
            if(this.ifEdit) return;
            this.getChooseModalList(true);
            this.chooseListModal.show = true;
        },
        getChooseModalList(ifFirst){
            if(ifFirst) {
                this.chooseListModal.list = [];
                this.chooseListModal.pagging.currentPage = 1;
                this.chooseListModal.pagging.pageCount = 0;
            }
            this.chooseListModal.loadMoreVis = true;
            Http.getListAcc({
                currentPage: this.chooseListModal.pagging.currentPage,
                pageSize: 100,
                type: {'2': -1, '-2': 1}[this.obj.accType]
            }).then(res => {
                if(res===undefined) return;
                let arr = this.fmtData(res.list);
                this.chooseListModal.list = [...this.chooseListModal.list, ...arr];
                this.chooseListModal.pagging = {...res.page};
                this.chooseListModal.loadMoreVis = false;
            });
        },
        fmtData(list){
            const getType = type => ({'1':'借入', '-1':'借出'}[type]);
            return list.map(item=>{
                let fromto;
                const typeCn = getType(item.type);
                if(item.type==100) fromto = `${item.memberKey_fromName}-${item.memberKey_toName}`; //转存
                else fromto = `[${typeCn}]`;
                item.header = {
                    1: item.date_sign,
                    2: item.money,
                    3: item.name,
                    4: fromto
                };
                let listSub = Object.keys(item).filter(key=>{
                    return [
                        'name','money','date_sign','id','date_dbCreate','dtype','other'
                    ].includes(key);
                }).map(key=>{
                    const obj = {
                        name: {t:'名称', o:1},
                        money: {t: '金额', o:3},
                        date_sign: {t: '日期', o:4},
                        id: {t: 'ID', o:2},
                        date_dbCreate: {t: '添加时间', o:12},
                        dtype: {t: '自分类', o:9},
                        other: {t: '备注', o:10},
                    };
                    const keyCn = obj[key].t;
                    const order = obj[key].o;
                    return { label: keyCn, value: item[key], order: order };
                });
                listSub.push({label: '帐目类型', value: `[ ${typeCn} ]`, order: 6});
                let ffrom = '';
                let tto = '';
                if(item.type==-1){
                    ffrom=`${item.memberKey_fromName} - ${item.bankTypeKey_fromName} - ${item.bankKey_fromName}`;
                    tto = item.otherpartyName || '';
                }
                if(item.type==1){
                    tto = `${item.memberKey_toName} - ${item.bankTypeKey_toName} - ${item.bankKey_toName}`;
                    ffrom = item.otherpartyName || '';
                }
                listSub.push({label: '由哪里', value: ffrom, order: 7});
                listSub.push({label: '至哪里', value: tto , order: 8});
                listSub.sort((a,b)=>a.order - b.order);
                item.transform1 = listSub.slice(0,7);
                item.transform2 = listSub.slice(7);
                item.finisheds = '';
                return {...item};
            });
        },
        clickChooseListModalTr(id, index){
            if(index===this.chooseListModal.trIndex){
                this.chooseListModal.trIndex = null;
            }else{
                this.chooseListModal.trIndex = index;
                !this.chooseListModal.list[index].finisheds && Http.getDetailAccounts(id).then(res => {
                    // this.chooseListModal.list[index].finisheds = res.finisheds;
                    this.$set(this.chooseListModal.list, index, {...this.chooseListModal.list[index], finisheds: res.finisheds});
                });
            }
        },
        onAccTypeChange(a){
            if(this.typeDiff != this.obj.accType){
                this.obj.targetId = '';
                this.obj.personName = '';
                this.$nextTick(()=>{
                    this.$refs.personName && this.$refs.personName.reset();
                })
            }
        },
        checkThisTr(index, trItem){
            this.obj.targetId = trItem.id;
            this.obj.personName = trItem.otherpartyName;
            this.chooseListModal.show = false;
        },
        goChooseListNextPage(nxet){
            this.chooseListModal.pagging.currentPage = nxet;
            this.getChooseModalList();
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
			}
			else this.$emit('on-component-loaded', false);
		});
	},
	watch: {
		datas: function(newv, oldv){
			// 如果是编辑页会传入datas，再次为form设置控件值
			if(this.ifEdit && newv && newv.id){
                this.setCtrlVal(newv);
			}
		},
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


.listCol{
	list-style: none; font-size: 0;

	&>li{
		display:inline-block; box-sizing: border-box;margin:0; height:40px; line-height: 40px;font-size:14px;
		&.li1{ vertical-align:top;width:34px;padding:0; text-align: right;}
		&.li2, &.li3, &.li4, &.li5, &.li6{
			padding: 0 4px;
			p {white-space: nowrap; word-break: keep-all; text-overflow:ellipsis; overflow: hidden;height:100%;}
		}
		&.li2{width:22%;}
		&.li3{width:18%;}
		&.li4{width:calc( 44% - 34px );}
		// &.li5{width:12%;}
		&.li6{width:16%;}
	}
	&.item-top{
        &>li.li2{color:rgb(161, 161, 161);font-size:13px;}
        &>li.li3{color:rgb(255, 123, 0);}
        .fbisdj{
            width:30px;
            height:30px;
            &:active{color:#11915c;font-weight: bold;}
        }
    }
    &.active{
        /* &:active{
            background: #bbeef1;
            .fbisdj{color:#11915c}
        } */
        // background: #bbeef1;
        // .fbisdj{color:#11915c}
    }
}

.popup-inner{height:calc(100% - 30px);margin: 20px 2.5% 0;display:flex;flex-direction:column;}
.popup-inner-m{flex:1;overflow-y: auto;-webkit-overflow-scrolling: touch;}
.popup-inner-t{
    background:#e2efe6;border-bottom:2px solid #fff;
    display: flex;
    justify-content: space-between;
    // margin-bottom:12px;
    color: #666;
    border-radius: 5px 5px 0 0;
    padding: 6px 7px 5px 7px;
    &>div:nth-child(2){
        width:25px;height:25px;overflow: hidden;
        *{width:110%;height:110%;}
    }
}
.popup-inner-h{
    background:#eee;
}
.popup-inner-m{
    background:#fff;
}
.popup-inner-b{
    padding-top:12px;
    &>a{color: rgb(21 161 21);display: block;
    border-color: rgba(25, 112, 25, 0.6);border: 1px solid #1aad19;    font-size: 18px;
    text-align: center;
    text-decoration: none;line-height: 2.4;
    border-radius: 5px;background:#e2efe6;-webkit-tap-highlight-color: rgba(0, 0, 0, .8);}
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
.forCtrlColor{
    & /deep/ .vux-cell-value{color: #a168fd; }
    & .myReadonly /deep/ .vux-cell-value{color: #b2b2b2; }
    & /deep/ .weui-input{color: #a168fd; }
    & .myReadonly /deep/ .weui-label{color: #939393; }
    & .myReadonly /deep/ .weui-input[readonly]{color: #b2b2b2; }

    & .myReadonly /deep/ .vux-label{color: #939393; }

    & /deep/ .weui-textarea{color: #a168fd;text-align: right;}
    & /deep/ .weui-cell__ft{color: #a168fd;}
    & /deep/ .weui-cell__ft .mnobskk{color: #b2b2b2;}
    & /deep/ .vux-cell-disabled:active { background-color: transparent; }
    & /deep/ .vux-cell-disabled .weui-cell__ft{color: #b2b2b2; &::after{display: none;}}
}
</style>