/* eslint-disable jsdoc/require-jsdoc */

import { Route } from '@angular/router';

abstract class BaseNavElement {
    type!: 'title' | 'titleWithInternalLink' | 'titleWithExternalLink'
        | 'image' | 'imageWithInternalLink' | 'imageWithExternalLink'
        | 'internalLink' | 'button' | 'externalLink' | 'menu';
    position?: 'left' | 'center' | 'right';
    collapse!: 'lg' | 'md' | 'sm' | 'never' | 'always';
}

export interface NavTitle extends BaseNavElement {
    type: 'title',
    title: string,
    icon?: string
}

export interface NavTitleWithInternalLink extends BaseNavElement {
    type: 'titleWithInternalLink',
    title: string,
    icon?: string,
    link: Omit<NavInternalLink, 'name' | 'icon' | 'type' | 'collapse' | 'position'>
}

export interface NavTitleWithExternalLink extends BaseNavElement {
    type: 'titleWithExternalLink',
    title: string,
    icon?: string,
    link: Omit<NavExternalLink, 'name' | 'icon' | 'type' | 'collapse' | 'position'>
}

export interface NavImage extends BaseNavElement {
    type: 'image',
    url: string
}

export interface NavImageWithInternalLink extends BaseNavElement {
    type: 'imageWithInternalLink',
    url: string,
    link: Omit<NavInternalLink, 'name' | 'icon' | 'type' | 'collapse' | 'position'>
}

export interface NavImageWithExternalLink extends BaseNavElement {
    type: 'imageWithExternalLink',
    url: string,
    link: Omit<NavExternalLink, 'name' | 'icon' | 'type' | 'collapse' | 'position'>
}

abstract class NavLink extends BaseNavElement {
    name!: string;
    icon?: string;
    openInNewTab?: boolean;
}

export interface NavButton extends NavLink {
    type: 'button',
    action: (...args: unknown[]) => unknown
}

export interface NavInternalLink extends NavLink {
    type: 'internalLink',
    route: Route | string
}

export interface NavExternalLink extends NavLink {
    type: 'externalLink',
    url: string
}


export type NavElement =
    NavTitle | NavTitleWithInternalLink | NavTitleWithExternalLink
    | NavImage | NavImageWithExternalLink | NavImageWithInternalLink
    | NavButton | NavInternalLink | NavExternalLink | NavMenu;

export type NavMenuElement =
    Omit<NavTitle, 'collapse'> | Omit<NavTitleWithInternalLink, 'collapse'> | Omit<NavTitleWithExternalLink, 'collapse'>
    | Omit<NavImage, 'collapse'> | Omit<NavImageWithExternalLink, 'collapse'> | Omit<NavImageWithInternalLink, 'collapse'>
    | Omit<NavButton, 'collapse'> | Omit<NavInternalLink, 'collapse'> | Omit<NavExternalLink, 'collapse'> | Omit<NavMenu, 'collapse'>;

export interface NavMenu extends BaseNavElement {
    type: 'menu',
    name: string,
    elements: NavMenuElement[],
    icon?: string
}

export interface NavbarRow {
    elements: NavElement[]
}