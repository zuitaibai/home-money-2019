import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
// import { CheckLoginService } from '../../service/check-login.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    ifNavFold = false;
    userTip = '';
    calcShow = false;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onNavFold: EventEmitter<boolean> = new EventEmitter();
    constructor(
        private router: Router,
        // private loginServ: CheckLoginService,
        private apiServ: ApiService) {
    }
    onCalcClose(show: boolean) { this.calcShow = show; }
    ngOnInit() {
        this.apiServ.getUerInfo().subscribe((res: {[key: string]: any}) => {
            const sname = res.sname;
            const level = res.level;
            // this.loginServ.setUser({ sname, level });
            this.userTip = `${level === 2 ? '*' : ''}[ ${sname} ]`;
        });
    }

    foldNav() {
        const bl = this.ifNavFold = !this.ifNavFold;
        this.onNavFold.emit(bl);
    }
    loginOut() {
        this.apiServ.loginOut().subscribe((res: {[key: string]: any}) => {
            if (res.code === 'ok') {
                // this.loginServ.clearUser();
                this.router.navigate(['/login']);
            }
        });
    }

}
