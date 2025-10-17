/* eslint-disable no-console */
import { Component } from '@angular/core';
import { Entity, NgxMatEntityBaseDisplayColumnValueComponent } from 'ngx-material-entity';

@Component({
    selector: 'app-pdf-download-display-value',
    templateUrl: './pdf-download-display-value.component.html'
})

export class PdfDownloadDisplayValueComponent<T extends Entity> extends NgxMatEntityBaseDisplayColumnValueComponent<T> {
    logToConsole(): void {
        console.log('Clicked on the pdf column of the entity', this.entity.id);
    }
}