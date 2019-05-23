import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-try-ctr-group',
    templateUrl: './try-ctr-group.component.html',
    styleUrls: ['./try-ctr-group.component.css']
})
export class TryCtrGroupComponent implements OnInit {

    try = new FormGroup({
        // cks: new FormControl(),
        cks: new FormControl(['song']),
        rdos: new FormControl('song'),
        rdos2: new FormControl()
    });

    cksDatas = [
        { name: '电影', value: 'movie' }, { name: '音乐', value: 'song' }, { name: '阅读', value: 'read' },
        { name: '登山', value: 'mountain' }, { name: '游泳', value: 'swim' }
    ];
    rdoDatas = [
        { name: '电影', value: 'movie' }, { name: '音乐', value: 'song' }, { name: '阅读', value: 'read' },
        { name: '登山', value: 'mountain' }, { name: '游泳', value: 'swim' }
    ];
    rdoDatas2 = [
        { name: 'a', value: 1 }, { name: 'b', value: 2 }, { name: 'cc', value: 3 },
        { name: 'd', value: 4 }, { name: 'e', value: 5 }
    ];
    cksDatas2 = [
        { name: 'a', value: 1 }, { name: 'b', value: 2 }, { name: 'cc', value: 3 },
        { name: 'd', value: 4 }, { name: 'e', value: 5 }
    ];
    ckbDisableds = ['swim'];
    rdoDisableds = ['swim'];

    rdosBBB = '';
    cksBBB = [];

    constructor() { }

    ngOnInit() {
        // this.try.patchValue({cks: ['mountain', 'swim']});
    }
    gouXuanCkb() { this.try.patchValue({cks: ['song']}); }
    gouXuanRdo() { this.try.patchValue({rdos: 'song'}); }
    jinYongCkb() { this.ckbDisableds = ['movie', 'song']; }
    jinYongRdo() { this.rdoDisableds = ['movie', 'song']; }
    onCksChange(obj: any) { console.log(obj); }
    onRdoChange(obj: any) { console.log(obj); }
    onRdoChange2(obj: any) { console.log(obj); }
    onCksChange2(obj: any) { console.log(obj); }

}
