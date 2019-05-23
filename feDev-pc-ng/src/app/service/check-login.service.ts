import { Injectable } from '@angular/core';
interface User {
    login: boolean;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class CheckLoginService {

    private user: User = { login: false};

    constructor() {
        const storage = sessionStorage.getItem('b-user');
        if (storage) {
            this.user = JSON.parse(storage);
        }
    }
    setUser(obj: {[key: string]: any} = {}) {
        this.user = { ...this.user, ...obj };
        sessionStorage.setItem('b-user', JSON.stringify(this.user));
    }
    getUser(prop?: string) {
        const storage = sessionStorage.getItem('b-user');
        let user = { login: false };
        if (storage) {
            user = JSON.parse(storage);
        }
        return prop ? user[prop] : user;
    }
    clearUser() {
        this.user = { login: false };
        sessionStorage.removeItem('b-user');
    }
}
