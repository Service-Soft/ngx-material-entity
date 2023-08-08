/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { Entity, NgxMatEntityBaseDisplayColumnValueComponent } from 'ngx-material-entity';

@Component({
    selector: 'app-pdf-download-display-value',
    templateUrl: './pdf-download-display-value.component.html',
    styleUrls: ['./pdf-download-display-value.component.scss']
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PdfDownloadDisplayValueComponent extends NgxMatEntityBaseDisplayColumnValueComponent<any> implements OnInit {
    logToConsole(): void {
        console.log('Clicked on the pdf column of the entity', (this.entity as Entity).id);
    }
}