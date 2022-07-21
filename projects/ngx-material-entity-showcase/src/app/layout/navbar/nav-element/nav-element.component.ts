/* eslint-disable jsdoc/require-jsdoc */
import { AfterContentChecked, Component, HostListener, Input, ViewChild } from '@angular/core';
import { NavElement } from '../../../nav.model';
import { NavUtilities } from '../../../utilities/nav.utilities';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-nav-element',
    templateUrl: './nav-element.component.html',
    styleUrls: ['./nav-element.component.scss']
})
export class NavElementComponent implements AfterContentChecked {

    NavUtilities = NavUtilities;

    @Input()
    element!: NavElement;

    @Input()
    sidenav?: MatSidenav;

    @Input()
    sidenavElement?: boolean;

    @ViewChild('menuButton')
    menuButton!: MatButton;

    menuWidth!: number;

    ngAfterContentChecked(): void {
        if (this.menuButton) {
            this.menuWidth = this.getMenuWidth();
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (this.menuButton) {
            this.menuWidth = this.getMenuWidth();
        }
    }

    private getMenuWidth(): number {
        return (this.menuButton._elementRef.nativeElement as HTMLElement).offsetWidth;
    }
}