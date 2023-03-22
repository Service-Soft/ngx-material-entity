import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxMatEntityEditPageComponent } from '../components/edit-page/edit-page.component';

// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any
export function UnsavedChangesGuard(component: NgxMatEntityEditPageComponent<any>): Observable<boolean | UrlTree> {
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