import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-db',
    templateUrl: './db.component.html',
    styleUrls: ['./db.component.css']
})
export class DbComponent implements OnInit {

    ifOpen = false;
    arr: {[key: string]: any}[] = [];
    sqlTxt = '';
    infos = {
        backupInfo : '',
        runSqlInfo : '',
        delsInfo : '',
        restoreInfo : ''
    };
    constructor(
        private apiServ: ApiService,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.fds.clearAll();
        this.apiServ.getDbFilesInfo().subscribe((res: {[key: string]: any}) => {
            this.ifOpen = res.ifOpen;
            this.arr = res.arr.map((v: string, i: number) => ({name: v, check: false, ok: i === 0}));
        });
    }
    refreshList() {
        this.apiServ.getDbFilesInfo().subscribe((res: {[key: string]: any}) => {
            this.ifOpen = res.ifOpen;
            this.arr = res.arr.map((v: string, i: number) => ({name: v, check: false, ok: i === 0}));
        });
        this.infos.backupInfo = this.infos.runSqlInfo = this.infos.delsInfo = this.infos.restoreInfo = '';
    }
    updateArrOk(index: number) {
        this.arr.forEach((v: {[key: string]: any}) => v.ok = false);
        this.arr[index].ok = true;
    }
    changeOk(index: number) {
        this.updateArrOk(index);
    }
    startStopLog() {
        if (!confirm(`确定要${this.ifOpen ? '停止起录' : '开始起录'}？`)) { return; }
        this.apiServ.startStopLog(!this.ifOpen).subscribe((res: {[key: string]: any}) => {
            if (res && res.code === 1) {
                this.ifOpen = res.open;
            }
        });
    }
    runSql() {
        if (!confirm('确定要执行sql？--慎重！！\n-- -- -- -- -- -- 再慎重！！')) { return; }
        this.infos.runSqlInfo = '执行中...';
        this.apiServ.runSql({postD: this.sqlTxt}).subscribe((res: {[key: string]: any}) => {
            if (res && res.code === 1) {
                this.infos.runSqlInfo = '执行成功！';
                return;
            }
            this.infos.runSqlInfo = '执行失败！';
        });
    }
    backup() {
        if (!confirm('确定要备份？')) { return; }
        this.infos.backupInfo = '备份中...';
        this.apiServ.backupSql().subscribe((res: {[key: string]: any}) => {
            if (res && res.code === 1) {
                this.infos.backupInfo = `备份成功: ${res.msg}`;
                this.arr.unshift({name: res.msg, check: false, ok: true});
                this.updateArrOk(0);
                return;
            }
            this.infos.backupInfo = '备份失败。';
        });
    }
    delSqlFiles() {
        if (!this.arr.some(v => v.check)) {
            alert('你倒是选一个啊！');
            return;
        }
        if (!confirm('确定要删除？--慎重！！\n-- -- -- -- -- -- 慎重！！')) {
            return;
        }
        const dels = this.arr.filter(v => v.check).map(v => v.name);
        this.apiServ.delSqlBackupFiles({dels}).subscribe((res: {[key: string]: any}) => {
            if (res && res.code === 1) {
                if (res.done && res.done.length > 0) {
                    const a = this.arr.length;
                    this.arr = this.arr.filter(v => !dels.find(vv => vv === v.name));
                    this.infos.delsInfo = `删除成功:[${a - this.arr.length}]个`;
                    this.updateArrOk(0);
                }
                return;
            }
            alert('删除失败！');
        });
    }
    restore() {
        if (!confirm('确定要还原？--慎重！！\n-- -- -- -- -- -- 慎重！！')) {
            return;
        }
        this.infos.restoreInfo = '还原中...';
        const str = this.arr.find(v => v.ok).name;
        this.apiServ.restore(str).subscribe((res: {[key: string]: any}) => {
            this.infos.restoreInfo = (res && res.code === 1) ? '还原成功。' : '还原失败。';
        });
    }
}
