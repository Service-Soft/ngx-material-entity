import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxMatEntityCreatePageComponent } from '../components/create-page/create-page.component';
import { NgxMatEntityEditPageComponent } from '../components/edit-page/edit-page.component';

/**
 * Can be either an edit or an create page.
 */
// eslint-disable-next-line typescript/no-explicit-any
type PageComponent = NgxMatEntityEditPageComponent<any> | NgxMatEntityCreatePageComponent<any>;

/**
 * A guard that checks if the user has unsaved changes and then prompts a confirmation from him.
 * Is used by the ngx-material-entity edit and create pages.
 * @param component - The component, can be either an edit or create page.
 * @returns An observable containing whether or not the user can continue.
 */
export function UnsavedChangesGuard(component: PageComponent): Observable<boolean | UrlTree> {
    return new Observable<boolean | UrlTree>((obs) => {
        if (component.canDeactivate()) {
            obs.next(true);
            return;
        }

        component.openConfirmNavigationDialog().subscribe(v => {
            obs.next(v);
        });
    });
}