import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { DefaultExport, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UnsavedChangesGuard } from '../../services/unsaved-changes.guard';

/**
 * The definition for a route to use with the "NgxMatEntityEditPageComponent".
 */
export interface EditDataRoute extends Route {
    // eslint-disable-next-line max-len, jsdoc/require-jsdoc
    loadComponent: () => Type<unknown> | Observable<Type<unknown> | DefaultExport<Type<unknown>>> | Promise<Type<unknown> | DefaultExport<Type<unknown>>>,
    // eslint-disable-next-line jsdoc/require-jsdoc
    providers: (Provider | EnvironmentProviders)[],
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: string,
    // eslint-disable-next-line jsdoc/require-jsdoc
    path: string
}

/**
 * The default data for a edit route.
 */
export const defaultEditDataRoute: Omit<EditDataRoute, 'providers'> = {
    loadComponent: () => import('./edit-page.component').then(m => m.NgxMatEntityEditPageComponent),
    title: 'Edit',
    path: 'entities:id',
    canDeactivate: [UnsavedChangesGuard]
};