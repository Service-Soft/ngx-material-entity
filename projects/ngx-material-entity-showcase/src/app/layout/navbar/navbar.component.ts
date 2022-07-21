/* eslint-disable jsdoc/require-jsdoc */
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {NavbarRow, NavElement } from '../../nav.model';
import { NavUtilities } from '../../utilities/nav.utilities';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    NavUtilities = NavUtilities;

    @Input()
    navbarRows!: NavbarRow[];

    @Input()
    minHeight!: number;

    @Input()
    minHeightOtherElements!: number;

    @Input()
    minSidenavWidth?: string;

    @ViewChild('sidenav')
    sidenav!: MatSidenav;

    sidenavElements: NavElement[] = [];

    burgerMenu: NavElement = {
        type: 'button',
        name: '',
        icon: 'fas fa-bars',
        action: () => this.sidenav.toggle(),
        collapse: 'never'
    };

    sanitizedMinHeight!: SafeStyle;

    screenWidth!: number;
    screenWidthName!: 'lg' | 'md' | 'sm';

    constructor(public sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        if (
            !this.minHeight || typeof this.minHeight !== 'number'
            || !this.minHeightOtherElements || typeof this.minHeightOtherElements !== 'number'
        ) {
            throw new Error('Incorrect input data');
        }
        else {
            this.sanitizedMinHeight = this.sanitizer.bypassSecurityTrustStyle(
                `calc(100vh - ${this.minHeight + this.minHeightOtherElements}px)`
            );
            this.screenWidth = window.innerWidth;
            this.screenWidthName = this.getCurrentScreenWidth();
            this.sidenavElements = NavUtilities.getSidenavElements(this.screenWidthName, this.navbarRows);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.screenWidth = window.innerWidth;
        this.screenWidthName = this.getCurrentScreenWidth();
        this.sidenavElements = NavUtilities.getSidenavElements(this.screenWidthName, this.navbarRows);
        if (!this.sidenavElements.length && this.sidenav.opened) {
            this.sidenav.close();
        }
    }

    clickSidenavElement(element: NavElement): void {
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

    private getCurrentScreenWidth(): 'lg' | 'md' | 'sm' {
        if (this.screenWidth < 768) {
            return 'sm';
        }
        else if (this.screenWidth < 992) {
            return 'md';
        }
        else {
            return 'lg';
        }
    }
}