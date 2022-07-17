/* eslint-disable jsdoc/require-jsdoc */

import { Route } from '@angular/router';

abstract class BaseNavElement {
    type!: 'title' | 'image' | 'internalLink' | 'button' | 'externalLink' | 'menu';
}

export interface NavTitle extends BaseNavElement {
    type: 'title',
    title: string,
    icon?: string
}

export interface NavImage extends BaseNavElement {
    type: 'image',
    url: string
}

abstract class NavLink extends BaseNavElement {
    name!: string;
    icon?: string;
}

export interface NavButton extends NavLink {
    type: 'button',
    action: (...args: unknown[]) => unknown
}

export interface NavInternalLink extends NavLink {
    type: 'internalLink',
    openInNewTab?: boolean,
    route: Route | string
}

export interface NavExternalLink extends NavLink {
    type: 'externalLink',
    openInNewTab?: boolean,
    url: string
};

export type NavElement = NavTitle | NavImage | NavButton | NavInternalLink | NavExternalLink | NavMenu;

export interface NavMenu extends BaseNavElement {
    type: 'menu',
    name: string,
    elements: NavElement[],
    icon?: string
}

export interface NavbarRows {
    elements: NavElement[]
}