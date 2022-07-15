/* eslint-disable jsdoc/require-jsdoc */

import { Route } from '@angular/router';

abstract class BaseNavElement {
    type!: 'title' | 'image' | 'internalLink' | 'externalLink' | 'menu';
}

export interface NavTitle extends BaseNavElement {
    title: string
}

export interface NavImage extends BaseNavElement {
    url: string
}

abstract class NavLink extends BaseNavElement {
    name!: string;
    icon?: string;
}

export interface NavInternalLink extends NavLink {
    angularRoute: Route
}

export interface NavExternalLink extends NavLink {
    url: string
};

export type NavElement = NavTitle | NavImage | NavInternalLink | NavExternalLink | NavMenu;

export interface NavMenu extends BaseNavElement {
    name: string,
    elements: NavElement[]
}

export interface NavbarRows {
    elements: NavElement[]
}