/* eslint-disable jsdoc/require-jsdoc */
import { Routes } from '@angular/router';
import { NavbarRows } from './nav.model';
import { NavUtilities } from './utilities/nav.utilities';

export const navbarRows: NavbarRows[] = [
    {
        elements: [
            {
                type: 'title',
                title: 'Showcase Project'
            },
            {
                type: 'internalLink',
                icon: 'fas fa-home',
                name: 'Home',
                angularRoute: {
                    path: '',
                    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
                }
            },
            {
                type: 'internalLink',
                icon: 'fas fa-table',
                name: 'Table',
                angularRoute: {
                    path: 'table',
                    loadChildren: () => import('./components/showcase-table/showcase-table.module').then(m => m.ShowcaseTableModule)
                }
            }
        ]
    }
];

export const routes: Routes = NavUtilities.getAngularRoutes();