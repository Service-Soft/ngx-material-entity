import { Component } from '@angular/core';
import { navbarRows } from './routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class AppComponent {
    navbarRows = navbarRows;
}