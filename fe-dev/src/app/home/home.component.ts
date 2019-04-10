import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ModalService } from '../service/modal.service';
import { ObjTpye } from '../util/types';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    forFoldCss = false;

    modal: ObjTpye = {
        modalSize: 'large',
        modalTit: '',
        modalInner: '',
        modalIfShow: 'no',
        modalOverlay: 'no',
        modalData: {},
        modalCompName: ''
    };

    @HostListener('document:keyup.esc', ['$event'])
    search(event: KeyboardEvent): void {
        this.modal.modalIfShow = this.modal.modalOverlay = 'no';
    }

    constructor(private modalService: ModalService) { }
    ngOnInit() {
        this.modalService.eventEmit.subscribe((value: ObjTpye) => {
            this.modal = {
                ...this.modal,
                ...value
            };
        });
    }

    onModalClose(ifShow: string) {
        const s = this.modal.onClose && this.modal.onClose();
        this.modal.modalIfShow = ifShow;
        this.modal.moverlay = ifShow;
    }

    onNavFoldChange(ifNavFold: boolean) {
        this.forFoldCss = ifNavFold;
    }

}
