/* eslint-disable no-console */
import { Component } from '@angular/core';
import { Entity, NgxMatEntityBaseDisplayColumnValueComponent } from 'ngx-material-entity';

// eslint-disable-next-line angular/prefer-standalone
@Component({
    selector: 'app-pdf-download-display-value',
    templateUrl: './pdf-download-display-value.component.html',
    styleUrls: ['./pdf-download-display-value.component.scss']
})

export class PdfDownloadDisplayValueComponent<T extends Entity> extends NgxMatEntityBaseDisplayColumnValueComponent<T> {
    logToConsole(): void {
        console.log('Clicked on the pdf column of the entity', this.entity.id);
    }
}