import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-edit-pay-come',
    templateUrl: './edit-pay-come.component.html',
    styleUrls: ['./edit-pay-come.component.css']
})
export class EditPayComeComponent implements OnInit {
    id: number;
    payOrCome: string;
    constructor(private route: ActivatedRoute, private location: Location) { }

    ngOnInit() {
        this.id = +this.route.snapshot.paramMap.get('id');
        this.payOrCome = this.route.snapshot.data.type;

    }
    goBack() {
        this.location.back();
    }

}
