import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    public eventEmit: any;

    constructor() {
        this.eventEmit = new EventEmitter();
    }


}
