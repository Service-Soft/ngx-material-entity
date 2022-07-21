/* eslint-disable jsdoc/require-jsdoc */
import { AfterContentChecked, Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NavMenu, NavMenuElement } from '../../../nav.model';
import { NavUtilities } from '../../../utilities/nav.utilities';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements AfterContentChecked {

    @ViewChild('menu', {static: true})
    menu!: MatMenu;

    @Input()
    navMenu!: NavMenu;

    @Input()
    sidenav?: MatSidenav;

    @Input()
    menuWidth!: number;

    NavUtilities = NavUtilities;

    @ViewChild('nestedMenuButton')
    nestedMenuButton!: MatButton;

    nestedMenuWidth!: number;

    ngAfterContentChecked(): void {
        if (this.nestedMenuButton) {
            this.nestedMenuWidth = this.getMenuWidth();
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (this.nestedMenuButton) {
            this.nestedMenuWidth = this.getMenuWidth();
        }
    }

    private getMenuWidth(): number {
        return (this.nestedMenuButton._elementRef.nativeElement as HTMLElement).offsetWidth;
    }

    clickSidenavElement(element: NavMenuElement): void {
        if (this.sidenav) {
            switch (element.type) {
                case 'image':
                case 'title':
                case 'menu':
                    return;
                default:
                    this.sidenav.toggle();
                    return;
            }
        }
    }
}