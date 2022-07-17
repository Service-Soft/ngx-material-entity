/* eslint-disable max-len */
/* eslint-disable jsdoc/require-jsdoc */
import { Routes } from '@angular/router';
import { NavbarRows } from './nav.model';
import { NavUtilities } from './utilities/nav.utilities';

export const navbarRows: NavbarRows[] = [
    {
        elements: [
            {
                type: 'title',
                title: 'Showcase Project',
                icon: 'fa-brands fa-angular'
            },
            {
                type: 'internalLink',
                name: 'Home',
                icon: 'fas fa-home',
                route: {
                    path: '',
                    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
                }
            },
            {
                type: 'internalLink',
                name: 'Table',
                icon: 'fas fa-table',
                route: {
                    path: 'table',
                    loadChildren: () => import('./components/showcase-table/showcase-table.module').then(m => m.ShowcaseTableModule)
                }
            },
            {
                type: 'menu',
                name: 'Inputs',
                icon: 'fas fa-keyboard',
                elements: [
                    {
                        type: 'internalLink',
                        name: '@string',
                        route: 'inputs/string'
                    },
                    {
                        type: 'internalLink',
                        name: '@number',
                        route: 'inputs/number'
                    },
                    {
                        type: 'internalLink',
                        name: '@boolean',
                        route: 'inputs/boolean'
                    },
                    {
                        type: 'internalLink',
                        name: '@array',
                        route: 'inputs/array'
                    },
                    {
                        type: 'internalLink',
                        name: '@object',
                        route: 'inputs/object'
                    }
                ]
            },
            {
                type: 'menu',
                name: 'Dialogs',
                icon: 'fas fa-circle-exclamation',
                elements: []
            },
            {
                type: 'button',
                name: 'Reset Data',
                icon: 'fas fa-rotate-right',
                action: () => fetch('http://localhost:3000/reset/', { method: 'POST' }).then(() => location.reload())
            }
        ]
    }
];

export const additionalRoutes: Routes = [
    {
        path: 'inputs/:type',
        loadChildren: () => import('./components/showcase-inputs/showcase-inputs.module').then(m => m.ShowcaseInputsModule)
    }
]

export const routes: Routes = NavUtilities.getAngularRoutes(navbarRows, additionalRoutes);