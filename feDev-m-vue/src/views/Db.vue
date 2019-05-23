<template>
	<div style="padding:20px 20px 0;">
		
		<x-button 
			type="default" :plain="true" @click.native="toggleRecrod"
			:disabled="btnToggleRecrod.disabled" :show-loading="btnToggleRecrod.loading"
		>{{ifOpen?'停止日志':'开始日志'}}</x-button>
		
		<x-button 
			type="primary" :plain="true" @click.native="backup" 
			:disabled="btnBackup.disabled" :show-loading="btnBackup.loading"
			style="margin-bottom:30px;"
		>执行备份</x-button>

		<x-button 
			type="default" :plain="true" @click.native="refresh" 
			:disabled="btnRefresh.disabled" :show-loading="btnRefresh.loading"
		>物理刷新</x-button>

		<x-button 
			type="warn" :plain="true" @click.native="restore" 
			:disabled="btnRestore.disabled" :show-loading="btnRestore.loading"
		>执行还原(选中)</x-button>
		<div style="height:116px;overflow:auto;margin:0 2px 30px;" ref="scroller">
			<swipeout>
				<swipeout-item :auto-close-on-button-click="true" v-for="(item, index) in arr" :key="index">
					<div slot="right-menu">
						<swipeout-button @click.native.stop="delItem(item.name, index)" type="warn">删除</swipeout-button>
					</div>
					<div class="vux-1px-t ss-item" slot="content">
						<check-icon :value="item.check" type="plain" @click.native="checks(item.check, index)">{{item.name}}</check-icon>
					</div>
				</swipeout-item>
			</swipeout>
		</div>

		<x-button :plain="true" :disabled="true">执行SQL (请移步pc端)</x-button>
	</div>
</template>

<script>
import { local } from "@/config";
const en = 'db';
const cn = local.pgKey2Cn[en];

import { mapActions } from "vuex";
import { CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, XButton } from 'vux';

export default {
	name: en,
	components: { CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, XButton },
	data(){
		return {
			btnToggleRecrod: { disabled: false, loading: false },
			btnBackup: { disabled: false, loading: false },
			btnRefresh: { disabled: false, loading: false },
			btnRestore: { disabled: false, loading: false },
			ifOpen: false,
			arr: [],
		}
	},
	methods: {
		...mapActions(['setNavigationTitle', 'setLoading']),
		refresh(){
			this.btnRefresh.disabled = this.btnRefresh.loading = true;
			this.http.getDbFilesInfo().then(res => {
				this.btnRefresh.disabled = this.btnRefresh.loading = false;
				if(res){
					this.ifOpen = res.ifOpen;
					this.arr = res.arr.map((v, i) => ({name: v, check: i===0}));
					this.$vux.toast.show({ text: '已刷刷，已刷刷', time: 800});
					this.$refs.scroller.scrollTop = 0;
					//因为本地项目不在外网下运行的话，备份、还原、开关日志等请求会很快，在此时它们都已视为完成，所以不用取消上一个请求
					/* 
					code: 取消上一个请求 (用this.$axios.CancelToken实现) // 而且console.log(this.$axios.CancelToken)的话为undefined，还未细察之
					this.btnToggleRecrod.disabled = this.btnToggleRecrod.loading 
					= this.btnBackup.disabled = this.btnBackup.loading
					= this.btnRestore.disabled = this.btnRestore.loading = false;
					*/

					//[关联1] 另，如果项目中有用到axios的取消请求的话，请在service.js中的handleError中识别, 不要在页面中弹出toast
				}
			});
		},
		restore(){
			this.$vux.confirm.show({
				title: '死了心要还原！！？？',
				content: `整个数据库操作，后果不堪设想`,
				onConfirm : () => {
					this.btnRestore.disabled = this.btnRestore.loading = true;
					const str = this.arr.find(v => v.check).name;
					this.http.restore(str).then(res => {
						this.btnRestore.disabled = this.btnRestore.loading = false;
						if(res){
							this.$vux.toast.show({ text:  res.code === 1 ? '还原成功' : '还原失败', time: 1000});
						}
					});
				}
			});
		},
		backup(){
			this.$vux.confirm.show({
				content: `确定要备份？`,
				onConfirm : () => {
					this.btnBackup.disabled = this.btnBackup.loading = true;
					this.http.backupSql().then(res => {
						this.btnBackup.disabled = this.btnBackup.loading = false;
						if (res) {
							if(res.code === 1){
								this.$vux.toast.show({ text: `备份成功: <br>${res.msg}`, time: 1000});
								this.arr.unshift({name: res.msg, check: false});
								this.checks(false, 0);
								this.$refs.scroller.scrollTop = 0;
							}else{
								this.$vux.toast.show({ text: '备份失败', time: 1000});
							}
						}
					});
				}
			});
		},
		toggleRecrod(){
			this.$vux.confirm.show({
				content: `确定要${this.ifOpen ? '停止日志' : '开始日志'}？`,
				onConfirm : () => {
					this.btnToggleRecrod.disabled = this.btnToggleRecrod.loading = true;
					this.http.startStopLog(!this.ifOpen).then(res => {
						this.btnToggleRecrod.disabled = this.btnToggleRecrod.loading = false;
						if (res && res.code === 1) {
							this.ifOpen = res.open;
						}
					});
				}
			});
		},
		getList(){
			this.setLoading({ text: '', show: true });
			this.http.getDbFilesInfo().then(res => {
				this.setLoading({ show: false });
				if(res){
					this.ifOpen = res.ifOpen;
					this.arr = res.arr.map((v, i) => ({name: v, check: i===0}));
				}
			});
		},
		checks(check, index){
			if(!check){
				this.arr.forEach((item,ind)=>{
					item.check = ind === index;
				});
			}
		},
		delItem(name, index) {
			this.$vux.confirm.show({
				title: '死了心要删？',
				content: '数据删除，后果不堪设想',
				onConfirm : () => {
					this.setLoading({ text: '我删，我删删删', show: true });
					const dels = [name];
					this.http.delSqlBackupFiles({dels}).then(res => {
						this.setLoading({ show: false });
						if (res) {
							if(res.code === 1){
								if (res.done && res.done.length > 0) {
									this.arr.splice(index,1);
									this.checks(false, 0);
									this.$vux.toast.show({ text: '删除成功', time: 1000});
								}
							}else {
								this.$vux.toast.show({ text: '删除失败', time: 1000});
							}
						}
					});
				}
			});
		}
	},
	
	mounted() {
		this.setNavigationTitle(cn);
		this.getList();
	},
}
</script>

<style scoped lang="less">
.ss-item{padding:6px 0;}
</style>

