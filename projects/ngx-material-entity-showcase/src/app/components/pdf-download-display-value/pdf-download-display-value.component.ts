/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { NgxMatEntityBaseDisplayColumnValueComponent } from 'ngx-material-entity';
import { Person } from '../sandbox/sandbox.component';

@Component({
    selector: 'app-pdf-download-display-value',
    templateUrl: './pdf-download-display-value.component.html',
    styleUrls: ['./pdf-download-display-value.component.scss']
})
export class PdfDownloadDisplayValueComponent extends NgxMatEntityBaseDisplayColumnValueComponent<Person> implements OnInit {
    logToConsole(): void {
        console.log('Clicked on the pdf column of the entity', this.entity.firstName, this.entity.lastName);
    }
}