import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-edit-accounts',
    templateUrl: './edit-accounts.component.html',
    styleUrls: ['./edit-accounts.component.css']
})
export class EditAccountsComponent implements OnInit {

    id: number;
    constructor(private route: ActivatedRoute, private location: Location) { }

    ngOnInit() {
        this.id = +this.route.snapshot.paramMap.get('id');
    }
    goBack() {
        this.location.back();
    }

}
