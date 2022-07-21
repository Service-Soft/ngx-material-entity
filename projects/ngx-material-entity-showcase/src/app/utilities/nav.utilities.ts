/* eslint-disable jsdoc/require-jsdoc */
import { Route, Routes } from '@angular/router';
import { NavbarRow, NavButton, NavElement, NavExternalLink, NavImage, NavImageWithExternalLink, NavImageWithInternalLink, NavInternalLink, NavMenu, NavMenuElement, NavTitle, NavTitleWithExternalLink, NavTitleWithInternalLink } from '../nav.model';

export abstract class NavUtilities {

    static asAngularRoute(route: Route | string): Route {
        return route as Route;
    }

    static asStringRoute(route: Route | string): string {
        return route as string;
    }

    static asTitle(element: NavElement): NavTitle {
        return element as NavTitle;
    }

    static asTitleWithExternalLink(element: NavElement): NavTitleWithExternalLink {
        return element as NavTitleWithExternalLink;
    }

    static asTitleWithInternalLink(element: NavElement): NavTitleWithInternalLink {
        return element as NavTitleWithInternalLink;
    }

    static asImage(element: NavElement): NavImage {
        return element as NavImage;
    }

    static asImageWithExternalLink(element: NavElement): NavImageWithExternalLink {
        return element as NavImageWithExternalLink;
    }

    static asImageWithInternalLink(element: NavElement): NavImageWithInternalLink {
        return element as NavImageWithInternalLink;
    }

    static asButton(element: NavElement | NavMenuElement): NavButton {
        return element as NavButton;
    }

    static asInternalLink(element: NavElement | NavMenuElement): NavInternalLink {
        return element as NavInternalLink;
    }

    static asExternalLink(element: NavElement | NavMenuElement): NavExternalLink {
        return element as NavExternalLink;
    }

    static asMenu(element: NavElement | NavMenuElement): NavMenu {
        return element as NavMenu;
    }

    static isInternalLink(element: NavElement): element is NavInternalLink {
        if ((element as NavInternalLink).route) {
            return true;
        }
        return false;
    }

    static isMenu(element: NavElement): element is NavMenu {
        if ((element as NavMenu).elements) {
            return true;
        }
        return false;
    }

    static isAngularRoute(route: Route | string): route is Route {
        if ((route as Route).path) {
            return true;
        }
        return false;
    }

    static isNavElement(value: NavElement | NavbarRow): value is NavElement {
        if ((value as NavElement).type) {
            return true;
        }
        return false;
    }

    static getAngularRoutes(navbarRows: NavbarRow[] = [], additionalRoutes: Routes = []): Routes {
        let allRoutes: Routes = [];
        allRoutes = allRoutes.concat(NavUtilities.getRoutesFromNavbar(navbarRows));
        allRoutes = allRoutes.concat(additionalRoutes);
        // Filters to only contain unique paths
        const uniquePaths: string[] = [];
        const res: Routes = [];
        for (const route of allRoutes) {
            if (!uniquePaths.find(r => r === route.path)) {
                res.push(route);
            }
        }
        return res;
    }

    static getRoutesFromNavbar(navbarRows: NavbarRow[]): Routes {
        let res: Routes = [];
        for (const row of navbarRows) {
            res = res.concat(NavUtilities.getRoutesFromElements(row.elements));
        };
        return res;
    }

    private static getRoutesFromElements(elements: NavElement[]): Routes {
        let res: Routes = [];
        const internalLinks: NavInternalLink[] = elements.filter(e => NavUtilities.isInternalLink(e)) as NavInternalLink[];
        const angularRoutes: Routes = internalLinks.filter(l => NavUtilities.isAngularRoute(l.route)).map(l => l.route) as Routes;
        res = res.concat(angularRoutes);
        const menus: NavMenu[] = elements.filter(e => NavUtilities.isMenu(e)) as NavMenu[];
        for (const menu of menus) {
            res = res.concat(NavUtilities.getRoutesFromElements(menu.elements as NavElement[]));
        }
        return res;
    }

    static getNavbarElements(
        position: 'left' | 'center' | 'right',
        screenWidth: 'lg' | 'md' | 'sm',
        elements?: NavElement[] | NavbarRow[]
    ): NavElement[] {
        if (!elements || !elements.length) {
            return [];
        }
        let res: NavElement[] = [];
        if (NavUtilities.isNavElement(elements[0])) {
            res = res.concat(elements as NavElement[]);
        }
        else {
            for (const row of elements as NavbarRow[]) {
                res = res.concat(row.elements);
            }
        }

        if (position === 'left') {
            res = res.filter(e => !e.position || e.position === position);
        }
        else {
            res = res.filter(e => e.position === position);
        }
        switch (screenWidth) {
            case 'lg':
                return res.filter(e => e.collapse !== 'always' && e.collapse !== 'lg');
            case 'md':
                return res.filter(e => e.collapse !== 'always' && e.collapse !== 'lg' && e.collapse !== 'md');
            case 'sm':
                return res.filter(e => e.collapse !== 'always' && e.collapse !== 'lg' && e.collapse !== 'md' && e.collapse !== 'sm');
        }
    }

    static getSidenavElements(screenWidth: 'lg' | 'md' | 'sm', rows?: NavbarRow[]): NavElement[] {
        if (!rows || !rows.length) {
            return [];
        }
        let res: NavElement[] = [];
        for (const row of rows) {
            res = res.concat(row.elements);
        }
        switch (screenWidth) {
            case 'lg':
                return res.filter(e => e.collapse === 'always' || e.collapse === 'lg');
            case 'md':
                return res.filter(e => e.collapse === 'always' || e.collapse === 'lg' || e.collapse === 'md');
            case 'sm':
                return res.filter(e => e.collapse === 'always' || e.collapse === 'lg' || e.collapse === 'md' || e.collapse === 'sm');
        }
    }
}