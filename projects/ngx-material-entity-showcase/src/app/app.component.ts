/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { DefaultNavRouteDataType, NavRoute, NavbarRow } from 'ngx-material-navigation';
import { navbarRows } from './routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    navbarRows: NavbarRow<NavRoute<DefaultNavRouteDataType>>[] = navbarRows;
}