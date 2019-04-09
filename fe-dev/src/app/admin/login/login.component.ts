import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
// import { CheckLoginService } from '../../service/check-login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    verCode = '';
    loginYet = false;
    loginInfo = '';
    loginO = {
        username: '',
        userpwd: '',
        usercode: ''
    };
    @ViewChild('nameCtrRef') nameCtrRef: ElementRef; // for ctr auto focus
    constructor(
        private router: Router,
        // private loginServ: CheckLoginService,
        private apiServ: ApiService) { }
    @HostListener('document:keyup.Enter', ['$event'])
    search(event: KeyboardEvent): void {
        this.login();
    }
    ngOnInit() {
        this.apiServ.checkLogin().subscribe((res: {[key: string]: any}) => {
            this.loginYet = res.login;
        });
        if (!this.loginYet) {
            this.apiServ.getVerCode().subscribe((res: {[key: string]: any}) => {
                this.verCode = res.code;
            });
        }
    }
    reGetVerCode() {
        this.apiServ.getVerCode().subscribe((res: {[key: string]: any}) => {
            this.verCode = res.code;
        });
    }
    ngAfterViewInit() {
        this.nameCtrRef.nativeElement.focus();
    }
    reset() {
        this.loginO = { username: '', userpwd: '', usercode: '' };
        this.reGetVerCode();
        this.nameCtrRef.nativeElement.focus();
    }
    login() {
        if (!this.loginO.usercode || !this.loginO.username || !this.loginO.userpwd) {
            this.loginInfo = '我草，写点东西上去啊！';
            return;
        }
        this.apiServ.login(this.loginO).subscribe((res: {[key: string]: any}) => {
            if (res.code === 'no') {
                this.loginInfo = res.err;
                if (res.ran) {
                    this.verCode = res.ran;
                }
            } else if (res.code === 'ok') {
                // this.loginServ.setUser({login: true});
                this.router.navigate(['/index']);
            }
        });
    }
    loginOut() {
        this.apiServ.loginOut().subscribe((res: {[key: string]: any}) => {
            if (res.code === 'ok') {
                // this.loginServ.clearUser();
                this.loginYet = false;
            }
        });
    }
}
