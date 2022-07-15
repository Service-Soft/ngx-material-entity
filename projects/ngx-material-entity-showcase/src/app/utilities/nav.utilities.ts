/* eslint-disable jsdoc/require-jsdoc */
import { Routes } from '@angular/router';
import { NavElement, NavInternalLink, NavMenu, NavTitle } from '../nav.model';
import { navbarRows } from '../routes';

export abstract class NavUtilities {

    static asTitle(element: NavElement): NavTitle {
        return element as NavTitle;
    }

    static asInternalLink(element: NavElement): NavInternalLink {
        return element as NavInternalLink;
    }

    static getAngularRoutes(): Routes {
        let res: Routes = [];
        res = res.concat(this.getRoutesFromNavbar());
        return res;
    }

    static getRoutesFromNavbar(): Routes {
        let res: Routes = [];
        for (const row of navbarRows) {
            res = res.concat(NavUtilities.getRoutesFromElements(row.elements, res));
            const menus: NavMenu[] = row.elements.filter(e => this.isMenu(e)) as NavMenu[];
            for (const menu of menus) {
                res = res.concat(NavUtilities.getRoutesFromElements(menu.elements, res));
            }
        };
        return res;
    }

    private static getRoutesFromElements(elements: NavElement[], foundRoutes: Routes): Routes {
        const res: Routes = [];
        const internalLinks: NavInternalLink[] = elements.filter(e => this.isInternalLink(e)) as NavInternalLink[];
        const routes = internalLinks.map(l => l.angularRoute);
        for (const route of routes) {
            if (!res.map(r => r.path).includes(route.path) && ! foundRoutes.map(r => r.path).includes(route.path)) {
                res.push(route);
            }
        }
        return res;
    }

    static isInternalLink(element: NavElement): element is NavInternalLink {
        if ((element as NavInternalLink).angularRoute) {
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
}