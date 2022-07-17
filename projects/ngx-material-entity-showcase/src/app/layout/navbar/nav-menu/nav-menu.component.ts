import { Component, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NavMenu } from '../../../nav.model';
import { NavUtilities } from '../../../utilities/nav.utilities';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class NavMenuComponent {

    @ViewChild('menu', {static: true})
    menu!: MatMenu;

    // eslint-disable-next-line jsdoc/require-jsdoc
    @Input()
    navMenu!: NavMenu;

    NavUtilities = NavUtilities;

    constructor() { }
}