import { Component, OnInit } from '@angular/core';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-add-pay-come',
    templateUrl: './add-pay-come.component.html',
    styleUrls: ['./add-pay-come.component.css']
})
export class AddPayComeComponent implements OnInit {

    payOrCome = 'pay';

    constructor(private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.fds.clearAll();
    }

    changeSsstype(str: string) {
        this.payOrCome = str;
    }

}
