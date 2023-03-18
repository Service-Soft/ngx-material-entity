import { Component } from '@angular/core';
import { NavbarRow, NavRoute, DefaultNavRouteDataType } from 'ngx-material-navigation';
import { navbarRows } from './routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class AppComponent {
    navbarRows: NavbarRow<NavRoute<DefaultNavRouteDataType>>[] = navbarRows;
}