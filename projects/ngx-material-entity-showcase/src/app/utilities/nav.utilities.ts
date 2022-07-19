/* eslint-disable jsdoc/require-jsdoc */
import { Route, Routes } from '@angular/router';
import { NavbarRows, NavButton, NavElement, NavExternalLink, NavInternalLink, NavMenu, NavTitle } from '../nav.model';

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

    static asButton(element: NavElement): NavButton {
        return element as NavButton;
    }

    static asInternalLink(element: NavElement): NavInternalLink {
        return element as NavInternalLink;
    }

    static asExternalLink(element: NavElement): NavExternalLink {
        return element as NavExternalLink;
    }

    static asMenu(element: NavElement): NavMenu {
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

    static getAngularRoutes(navbarRows: NavbarRows[] = [], additionalRoutes: Routes = []): Routes {
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

    static getRoutesFromNavbar(navbarRows: NavbarRows[]): Routes {
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
            res = res.concat(NavUtilities.getRoutesFromElements(menu.elements));
        }
        return res;
    }

    static getLeftElements(elements?: NavElement[]): NavElement[] {
        if (!elements) {
            return [];
        }
        return elements.filter(e => !e.position || e.position === 'left');
    }
    static getCenterElements(elements?: NavElement[]): NavElement[] {
        if (!elements) {
            return [];
        }
        return elements.filter(e => e.position && e.position === 'center');
    }
    static getRightElements(elements?: NavElement[]): NavElement[] {
        if (!elements) {
            return [];
        }
        return elements.filter(e => e.position && e.position === 'right');
    }
}