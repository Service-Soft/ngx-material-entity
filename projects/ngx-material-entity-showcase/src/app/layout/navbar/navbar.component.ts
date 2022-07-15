import { Component } from '@angular/core';
import { navbarRows } from '../../routes';
import { NavUtilities } from '../../utilities/nav.utilities';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class NavbarComponent {

    NavUtilities = NavUtilities;

    navbarRows = navbarRows;

    constructor() { }
}