import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';

@Component({
    selector: 'app-edit-type',
    templateUrl: './edit-type.component.html',
    styleUrls: ['./edit-type.component.css']
})
export class EditTypeComponent implements OnInit {

    mdsO = {
        a1: '', a2: '', a3: '', a4: '', a5: '',
        b1: '', b2: '', b3: '', b4: '', b5: '',
        c5: ''
    };

    hidesO: {[key: string]: boolean} = {
        hides1: false,
        hides2: false,
        hides3: false
    };
    outtype1: {[key: string]: any}[];
    outtype1B: {[key: string]: any}[];
    outtype2: {[key: string]: any}[];
    outtype2B: {[key: string]: any}[];
    intype: {[key: string]: any}[];
    intypeB: {[key: string]: any}[];
    banks: {[key: string]: any}[];
    banksB: {[key: string]: any}[];
    members: {[key: string]: any}[];
    membersB: {[key: string]: any}[];
    pid: number;
    constructor(private apiServ: ApiService) { }
    addMode = {
        optType: 'add',
        tableType: '',
        id: 0,
        name: '',
        order: 0,
        ifHome: 0,
        pid: 0
    };

    ngOnInit() {
        this.hidesO = this.lcStory;
        this.apiServ.getOut1Value().subscribe((res: {[key: string]: any}[]) => {
            this.outtype1 = res;
            this.outtype1B = JSON.parse(JSON.stringify(res));
            if (res.length > 0) {
                this.pid = res[0].id;
                this.getOut2ById(res[0].id);
            }
        });
        this.apiServ.getComeValue().subscribe((res: {[key: string]: any}[]) => {
            this.intype = res;
            this.intypeB = JSON.parse(JSON.stringify(res));
        });
        this.apiServ.getBanksOnly().subscribe((res: {[key: string]: any}[]) => {
            this.banks = res;
            this.banksB = JSON.parse(JSON.stringify(res));
        });
        this.apiServ.getMemberValue().subscribe((res: {[key: string]: any}[]) => {
            this.members = res;
            this.membersB = JSON.parse(JSON.stringify(res));
        });
    }

    bstore1(index: number) {
        this.outtype1[index] = {...this.outtype1B[index], showEdit: false};
    }
    bstore2(index: number) {
        this.outtype2[index] = {...this.outtype2B[index], showEdit: false};
    }
    bstore3(index: number) {
        this.intype[index] = {...this.intypeB[index], showEdit: false};
    }
    bstore4(index: number) {
        this.banks[index] = {...this.banksB[index], showEdit: false};
    }
    bstore5(index: number) {
        this.members[index] = {...this.membersB[index], showEdit: false};
    }
    changePid(id: number) {
        this.pid = id;
        this.getOut2ById(id);
    }
    getOut2ById(id: number) {
        this.apiServ.getOut2Value(id).subscribe((res: {[key: string]: any}[]) => {
            this.outtype2 = res;
            this.outtype2B = JSON.parse(JSON.stringify(res));
        });
    }
    add(type: string, name: string, order: number, ifhome?: boolean|undefined) {
        if (!name || !order) { alert('请填写完整！'); return; }
        if (!confirm('确定新增？')) { return; }
        const ifHome = ifhome ? 1 : 0;
        const ps = {optType: 'add', tableType: type, name, order, ifHome, pid: this.pid};
        this.apiServ.insertOrUpdateStype(ps).subscribe((res: {[key: string]: any}) => {
            if (res && res.affectedRows === 1) {
                alert('成功！');
                location.reload(true);
            } else {
                alert('失败！');
            }
        });
    }
    del(type: string, id: number) {
        if (!confirm('确定要删？')) { return; }
        const ps = {tableType: type, id};
        this.apiServ.deleteStype(ps).subscribe((res: {[key: string]: any}) => {
            if (res && res.affectedRows === 1) {
                alert('成功！');
                location.reload(true);
            } else {
                alert('失败！');
            }
        });
    }
    edit(tableType: string, id: number, name: string, order: number, ifhome?: boolean|undefined) {
        if (!name || !order) { alert('请填写完整！'); return; }
        if (!confirm('确定更改？')) { return; }
        const ifHome = ifhome ? 1 : 0;
        const ps = {optType: 'edit', tableType, id, name, order, ifHome, pid: this.pid};
        this.apiServ.insertOrUpdateStype(ps).subscribe((res: {[key: string]: any}) => {
            if (res && res.affectedRows === 1) {
                alert('成功！');
                location.reload(true);
            } else {
                alert('失败！');
            }
        });
    }
    private get lcStory() {
        const lc = localStorage.getItem('hides');
        return lc ? JSON.parse(lc) : {hides1: false, hides2: false, hides3: false};
    }
    private set lcStory(o: {[key: string]: boolean}) {
        localStorage.setItem('hides', JSON.stringify(o));
    }
    private hides(num: number) {
        const bl = this.hidesO['hides' + num] = !this.hidesO['hides' + num];
        this.lcStory = {...this.lcStory, ['hides' + num]: bl};
    }

}
