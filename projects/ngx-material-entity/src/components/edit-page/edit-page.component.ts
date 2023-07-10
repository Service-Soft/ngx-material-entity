import { Location, NgFor, NgIf } from '@angular/common';
import { Component, EnvironmentInjector, EnvironmentProviders, HostListener, Inject, InjectionToken, OnInit, Provider, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, DefaultExport, Route } from '@angular/router';
import { Observable, first, map } from 'rxjs';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { EntityService } from '../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityInputModule } from '../input/input.module';
import { EditActionInternal } from '../table/edit-dialog/edit-data.builder';
import { EditEntityData } from '../table/edit-dialog/edit-entity-data';
import { EditData } from '../table/table-data';
import { PageEditDataBuilder, PageEditDataInternal } from './page-edit-data.builder';

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

export const defaultEditDataRoute: Omit<EditDataRoute, 'providers'> = {
    loadComponent: () => NgxMatEntityEditPageComponent,
    title: 'Edit',
    path: 'entities:id'
};

/**
 * The data that needs to be provided for a route to be able to edit a entity.
 */
// eslint-disable-next-line max-len
export type PageEditData<EntityType extends BaseEntityType<EntityType>> = Omit<EditEntityData<EntityType>, 'entity' | 'EntityServiceClass'> & {
    /**
     * Whether or not to display a loading spinner while the entity for the page is loaded.
     *
     * @default true
     */
    displayLoadingSpinner?: boolean,
    /**
     * The data of the default edit page.
     */
    editData?: EditData<EntityType> & {
        /**
         * The data for the dialog when the user tries to leave the site with unsaved changes.
         */
        confirmUnsavedChangesDialogData?: ConfirmDialogData,
        /**
         * Whether or not leaving with unsaved changes should require a confirm dialog.
         *
         * @default true
         */
        unsavedChangesRequireConfirmDialog?: boolean
    }
};

/**
 * The entity service that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
export const NGX_EDIT_DATA_ENTITY_SERVICE: InjectionToken<EntityService<any>> = new InjectionToken<EntityService<any>>('NGX_EDIT_DATA_ENTITY_SERVICE');
/**
 * The entity class that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
export const NGX_EDIT_DATA_ENTITY: InjectionToken<EntityClassNewable<any>> = new InjectionToken<EntityClassNewable<any>>('NGX_EDIT_DATA_ENTITY');
/**
 * The configuration that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NGX_EDIT_DATA: InjectionToken<PageEditData<any>> = new InjectionToken<PageEditData<any>>('NGX_EDIT_DATA');

/**
 * A generic page that allows you to edit a specific entity.
 * For this to work you need to provide some data for the route.
 */
@Component({
    selector: 'ngx-mat-entity-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatButtonModule,
        MatTabsModule,
        NgxMatEntityInputModule,
        MatProgressSpinnerModule,
        MatMenuModule
    ]
})
export class NgxMatEntityEditPageComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    entityTabs!: EntityTab<EntityType>[];

    entity!: EntityType;
    entityPriorChanges!: EntityType;

    data!: PageEditDataInternal<EntityType>;

    isEntityValid: boolean = true;
    isEntityDirty: boolean = false;

    isEntityReadOnly!: boolean;

    private inConfirmNavigation: boolean = false;

    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasUnsavedChanges(): boolean {
        return this.isEntityDirty && this.data.editData.unsavedChangesRequireConfirmDialog;
    }

    constructor(
        private readonly dialog: MatDialog,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly injector: EnvironmentInjector,
        @Inject(NGX_EDIT_DATA_ENTITY_SERVICE)
        readonly entityService: EntityService<EntityType>,
        @Inject(NGX_EDIT_DATA_ENTITY)
        private readonly EntityClass: EntityClassNewable<EntityType>,
        @Inject(NGX_EDIT_DATA)
        private readonly inputData: PageEditData<EntityType>
    ) { }

    /**
     * Checks if the input with the given key is readonly.
     *
     * @param key - The key for the input to check.
     * @returns Whether or not the input for the key is read only.
     */
    isReadOnly(key: keyof EntityType): boolean {
        return this.injector.runInContext(() => {
            const metadata: PropertyDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(this.entity, key);
            return this.isEntityReadOnly || metadata.isReadOnly(this.entity);
        });
    }

    async ngOnInit(): Promise<void> {
        this.data = new PageEditDataBuilder(this.inputData).getResult();
        if (this.data == null) {
            this.confirmNavigateBack();
            throw new Error('No edit data was provided for "NGX_EDIT_DATA". You need to provide a value in your routes providers array.');
        }

        const id: EntityType[keyof EntityType] = this.route.snapshot.paramMap.get('id') as EntityType[keyof EntityType];
        const foundEntity: EntityType | undefined = await this.entityService.findById(id);

        if (foundEntity == null) {
            this.confirmNavigateBack();
            throw new Error(`Could not find entity with id ${id}`);
        }

        this.entity = new this.EntityClass(foundEntity);
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.entity);

        this.isEntityReadOnly = !this.data.allowUpdate(this.entityPriorChanges);
        this.entityTabs = EntityUtilities.getEntityTabs(this.entity, false, true);
    }

    /**
     * Whether the page can be left without confirmation (of unsaved changes).
     *
     * @returns Whether or not the page can be left without confirmation.
     */
    @HostListener('window:beforeunload')
    canDeactivate(): boolean {
        return !this.hasUnsavedChanges || this.inConfirmNavigation;
    }

    /**
     * Checks if the entity has become invalid or dirty.
     */
    async checkEntity(): Promise<void> {
        this.isEntityValid = EntityUtilities.isEntityValid(this.entity, 'update');
        this.isEntityDirty = await EntityUtilities.isDirty(this.entity, this.entityPriorChanges);
    }

    /**
     * Tries to save the changes and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    edit(): void {
        if (this.isEntityReadOnly || !this.isEntityValid || !this.isEntityDirty) {
            return;
        }
        if (!this.data.editData.editRequiresConfirmDialog) {
            this.confirmEdit();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editData.confirmEditDialogData)
            .withDefault('text', ['Do you really want to save all changes?'])
            .withDefault('confirmButtonLabel', 'Save')
            .withDefault('title', 'Edit')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmEdit();
            }
        });
    }

    private confirmEdit(): void {
        void this.entityService.update(this.entity, this.entityPriorChanges).then(() => this.confirmNavigateBack());
    }

    /**
     * Tries to delete the entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    delete(): void {
        if (!this.data.editData.deleteRequiresConfirmDialog) {
            this.confirmDelete();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.data.editData.confirmDeleteDialogData)
            .withDefault('text', ['Do you really want to delete this entity?'])
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', 'Delete')
            .withDefault('title', 'Delete')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmDelete();
            }
        });
    }

    private confirmDelete(): void {
        void this.entityService
            .delete(this.entityPriorChanges)
            .then(() => this.confirmNavigateBack());
    }

    /**
     * Tries to navigate back.
     */
    navigateBack(): void {
        if (!this.hasUnsavedChanges) {
            this.confirmNavigateBack();
            return;
        }

        this.openConfirmNavigationDialog().subscribe(res => {
            if (res) {
                this.confirmNavigateBack();
            }
        });
    }

    /**
     * Opens the confirm dialog for navigating with unsaved changes.
     * This is exposed because the UnsavedChangesGuard needs to access this.
     *
     * @returns The first observable result of the confirm dialog.
     */
    openConfirmNavigationDialog(): Observable<boolean> {
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: this.data.editData.confirmUnsavedChangesDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        return dialogRef.afterClosed().pipe(first(), map(p => (p ?? false)));
    }

    private confirmNavigateBack(): void {
        this.inConfirmNavigation = true;
        EntityUtilities.resetChangesOnEntity(this.entity, this.entityPriorChanges);
        this.location.back();
    }

    /**
     * Runs the edit action on the entity.
     *
     * @param action - The action to run.
     */
    runEditAction(action: EditActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = this.injector.runInContext(() => {
            return action.requireConfirmDialog(this.entityPriorChanges);
        });

        if (!requireConfirmDialog) {
            this.confirmRunEditAction(action);
            return;
        }
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: action.confirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmRunEditAction(action);
            }
        });
    }

    private confirmRunEditAction(action: EditActionInternal<EntityType>): void {
        this.injector.runInContext(() => {
            action.action(this.entityPriorChanges);
        });
    }

    /**
     * Checks if an EditAction is disabled (e.g. Because the current entry doesn't fullfil the requirements).
     *
     * @param action - The EditAction to check.
     * @returns Whether or not the Action can be used.
     */
    editActionDisabled(action: EditActionInternal<EntityType>): boolean {
        return this.injector.runInContext(() => {
            return !action.enabled(this.entityPriorChanges);
        });
    }
}