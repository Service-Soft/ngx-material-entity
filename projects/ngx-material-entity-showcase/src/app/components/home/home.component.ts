import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        CommonModule
    ]
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class HomeComponent {
    constructor() { }
}