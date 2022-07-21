/* eslint-disable max-len */
/* eslint-disable jsdoc/require-jsdoc */
import { Routes } from '@angular/router';
import { NavbarRow } from './nav.model';
import { NavUtilities } from './utilities/nav.utilities';

export const navbarRows: NavbarRow[] = [
    {
        elements: [
            {
                type: 'imageWithInternalLink',
                url: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png',
                link: {
                    route: 'home',
                },
                collapse: 'never'
            },
            {
                type: 'titleWithInternalLink',
                title: 'Showcase Project',
                icon: 'fa-brands fa-angular',
                link: {
                    route: 'home'
                },
                collapse: 'sm'
            },
            {
                type: 'internalLink',
                name: 'Home',
                icon: 'fas fa-home',
                route: {
                    path: 'home',
                    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
                },
                collapse: 'md'
            },
            {
                type: 'internalLink',
                name: 'Table',
                icon: 'fas fa-table',
                route: {
                    path: 'table',
                    loadChildren: () => import('./components/showcase-table/showcase-table.module').then(m => m.ShowcaseTableModule)
                },
                position: 'center',
                collapse: 'md'
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
                ],
                position: 'center',
                collapse: 'md'
            },
            {
                type: 'menu',
                name: 'Dialogs',
                icon: 'fas fa-circle-exclamation',
                elements: [],
                position: 'center',
                collapse: 'md'
            },
            {
                type: 'button',
                name: 'Reset Data',
                icon: 'fas fa-rotate-right',
                action: () => fetch('http://localhost:3000/reset/', { method: 'POST' }).then(() => location.reload()),
                position: 'right',
                collapse: 'sm'
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