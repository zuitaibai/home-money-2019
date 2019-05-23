import { Component, OnInit } from '@angular/core';
import { ForDetailBackSessionMngService } from '../../service/for-detail-back-session-mng.service';

@Component({
    selector: 'app-add-accounts',
    templateUrl: './add-accounts.component.html',
    styleUrls: ['./add-accounts.component.css']
})
export class AddAccountsComponent implements OnInit {

    constructor(private fds: ForDetailBackSessionMngService) { }

    ngOnInit() {
        this.fds.clearAll();
    }

}
