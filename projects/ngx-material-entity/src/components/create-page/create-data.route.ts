import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { DefaultExport, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UnsavedChangesGuard } from '../../services/unsaved-changes.guard';

/**
 * The definition for a route to use with the "NgxMatEntityCreatePageComponent".
 */
export interface CreateDataRoute extends Route {
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadComponent: () => Type<unknown> | Observable<Type<unknown> | DefaultExport<Type<unknown>>> | Promise<Type<unknown> | DefaultExport<Type<unknown>>>,
    // eslint-disable-next-line jsdoc/require-jsdoc
    providers: (Provider | EnvironmentProviders)[],
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: string,
    // eslint-disable-next-line jsdoc/require-jsdoc
    path: string
}

/**
 * The default data for a create route.
 */
export const defaultCreateDataRoute: Omit<CreateDataRoute, 'providers'> = {
    loadComponent: () => import('./create-page.component').then(m => m.NgxMatEntityCreatePageComponent),
    title: 'Create',
    path: 'entities/create',
    canDeactivate: [UnsavedChangesGuard]
};