/* eslint-disable jsdoc/require-jsdoc */
import { Component, Input } from '@angular/core';
import { NavbarRows } from '../../nav.model';
import { NavUtilities } from '../../utilities/nav.utilities';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    NavUtilities = NavUtilities;

    @Input()
    navbarRows!: NavbarRows[];

    constructor() { }
}