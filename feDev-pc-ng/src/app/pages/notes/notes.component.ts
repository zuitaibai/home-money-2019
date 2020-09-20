import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ObjTpye } from '../../util/types';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

    addSt: boolean;

    pageData: ObjTpye = {
        list: []
    };
    addModel: ObjTpye = {};
    addModelCache: ObjTpye = {}; // for click btn canel
    itemsDataCache = {}; // for click btn canel

    constructor(
        private apiServ: ApiService,
        private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.request();
        this.fds.clearAll();
    }

    request() {
        this.apiServ.getListNotes().subscribe(res => {
            this.pageData = res;
            this.addModelCache = {
                sname: '',
                date_sign: this.format(new Date()),
                dtype: '',
                con: ''
            };
            this.addModel = {...this.addModelCache}; // 由于里面没有引用类型，故不用深拷贝
        });
    }

    addSure() {
        if (!confirm('确认新增？')) { return; }
        this.apiServ.addNote(this.addModel).subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert('添加成功！');
                this.request();
            } else {
                alert('添加失败！');
            }
        });
    }
    addCanel() {
        this.addModel = { ...this.addModelCache };
    }
    delItem(id: number) {
        if (!confirm('确认删除？')) { return; }
        this.apiServ.delNote(id).subscribe(res => {
            if (res && res.affectedRows === 1) {
                alert('删除成功！');
                this.request();
            } else {
                alert('删除失败！');
            }
        });
    }
    eidtSure(tr: ObjTpye) {
        if (!confirm('确认提交？')) { return; }
        const { sname,date_sign,dtype,con} = tr;
        const body = { sname,date_sign,dtype,con};
        this.apiServ.updateNote(tr.id, body).subscribe(res => {
            if (res && res.affectedRows === 1 && res.changedRows === 1) {
                alert('编辑成功！');
                this.request();
            } else {
                alert('编辑失败！');
            }
        });
    }
    eidtCanel(index: number) {
        this.pageData.list[index] = {
            ...this.itemsDataCache[index],
            editSt: false
        };
    }
    gotoEdit(tr: ObjTpye, index: number) {
        tr.editSt = true;
        this.itemsDataCache[index] = { ...tr };
    }
    format(date: Date|string|number, sp: string = '-', ifShort: boolean = false) {
        const datee = new Date(date);
        const ys = datee.getFullYear();
        const ms = datee.getMonth() + 1;
        const ds = datee.getDate();
        const re = [ys, (ms < 10 ? '0' + ms : ms), (ds < 10 ? '0' + ds : ds)];
        if (ifShort) { re.shift(); }
        return re.join(sp);
    }

}
