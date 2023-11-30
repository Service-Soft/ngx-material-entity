import { Location, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EnvironmentInjector, HostListener, Inject, InjectionToken, OnInit, Renderer2, runInInjectionContext } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Observable, first, map } from 'rxjs';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../default-global-configuration-values';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { getValidationErrorsTooltipContent } from '../../functions/get-validation-errors-tooltip-content.function.ts';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { ValidationError, ValidationUtilities } from '../../utilities/validation.utilities';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityInputModule } from '../input/input.module';
import { EditActionInternal } from '../table/edit-dialog/edit-data.builder';
import { EditEntityData } from '../table/edit-dialog/edit-entity-data';
import { EditData } from '../table/table-data';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { PageEditDataBuilder, PageEditDataInternal } from './page-edit-data.builder';

/**
 * The data that needs to be provided for a route to be able to edit a entity.
 */
// eslint-disable-next-line max-len
export type PageEditData<EntityType extends BaseEntityType<EntityType>> = Omit<EditEntityData<EntityType>, 'entity' | 'EntityServiceClass'> & {
    /**
     * Whether or not to display a loading spinner while the entity for the page is loaded.
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
         * @default true
         */
        unsavedChangesRequireConfirmDialog?: boolean
    }
};

/**
 * The entity service that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line max-len, typescript/no-explicit-any, constCase/uppercase
export const NGX_EDIT_DATA_ENTITY_SERVICE: InjectionToken<EntityService<any>> = new InjectionToken<EntityService<any>>('NGX_EDIT_DATA_ENTITY_SERVICE');
/**
 * The entity class that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line max-len, typescript/no-explicit-any, constCase/uppercase
export const NGX_EDIT_DATA_ENTITY: InjectionToken<EntityClassNewable<any>> = new InjectionToken<EntityClassNewable<any>>('NGX_EDIT_DATA_ENTITY');
/**
 * The configuration that needs to be provided in the providers array of the edit page route.
 */
// eslint-disable-next-line typescript/no-explicit-any, constCase/uppercase
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
        MatMenuModule,
        MatBadgeModule,
        TooltipComponent
    ]
})
export class NgxMatEntityEditPageComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The tabs to display.
     */
    entityTabs!: EntityTab<EntityType>[];

    /**
     * The entity that is being edited.
     */
    entity!: EntityType;
    /**
     * The entity before any changes have been made.
     */
    entityPriorChanges!: EntityType;

    /**
     * Configuration data for the component.
     */
    data!: PageEditDataInternal<EntityType>;

    /**
     * All validation errors of the entity.
     */
    validationErrors: ValidationError[] = [];
    /**
     * Whether or not the entity is valid.
     */
    isEntityValid: boolean = true;
    /**
     * Whether or not the entity is dirty.
     */
    isEntityDirty: boolean = false;
    /**
     * What to display inside the tooltip.
     */
    tooltipContent: string = '';

    /**
     * Whether or not the entity is readonly.
     */
    isEntityReadOnly!: boolean;
    /**
     * Whether or not the current user is allowed to delete the entity.
     */
    allowDelete!: boolean;

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
        private readonly inputData: PageEditData<EntityType>,
        private readonly http: HttpClient,
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        protected readonly globalConfig: NgxGlobalDefaultValues
    ) { }

    /**
     * Checks if the input with the given key is readonly.
     * @param key - The key for the input to check.
     * @returns Whether or not the input for the key is read only.
     */
    isReadOnly(key: keyof EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            const metadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(this.entity, key);
            if (!metadata) {
                throw new Error(`No metadata was found for the key "${String(key)}"`);
            }
            return this.isEntityReadOnly || metadata.isReadOnly(this.entity);
        });
    }

    async ngOnInit(): Promise<void> {
        this.data = new PageEditDataBuilder(this.inputData, this.globalConfig).getResult();
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

        runInInjectionContext(this.injector, () => {
            this.isEntityReadOnly = !this.data.allowUpdate(this.entityPriorChanges);
            this.allowDelete = this.data.allowDelete(this.entityPriorChanges);
        });
        this.entityTabs = EntityUtilities.getEntityTabs(this.entity, this.injector, false, true);
        setTimeout(() => this.checkOffset(), 1);
        setTimeout(() => void this.checkIsEntityValid(), 1);
    }

    /**
     * Checks if the bottom row should be displayed as fixed.
     */
    @HostListener('window:scroll')
    checkOffset(): void {
        const scrollY: number = window.scrollY;
        const bottomRow: HTMLElement | null = (this.el.nativeElement as HTMLElement).querySelector('.bottom-row');
        const bottomRowContainer: HTMLElement | null = (this.el.nativeElement as HTMLElement).querySelector('.bottom-row-container');

        if (bottomRow && bottomRowContainer) {
            const bottomRowContainerOffset: number = bottomRowContainer.offsetTop;
            const windowHeight: number = window.innerHeight;

            if (scrollY + windowHeight >= bottomRowContainerOffset) {
                this.renderer.removeClass(bottomRow, 'fixed');
            }
            else {
                this.renderer.addClass(bottomRow, 'fixed');
            }
        }
    }

    /**
     * Whether the page can be left without confirmation (of unsaved changes).
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
        await this.checkIsEntityValid();
        this.isEntityDirty = await EntityUtilities.isDirty(this.entity, this.entityPriorChanges, this.http);
    }

    private async checkIsEntityValid(): Promise<void> {
        this.validationErrors = await ValidationUtilities.getEntityValidationErrors(this.entity, this.injector, 'update');
        this.tooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.validationErrors));
        this.isEntityValid = this.validationErrors.length === 0;
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
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.data.editData.confirmEditDialogData)
            .withDefault('text', this.globalConfig.confirmSaveText)
            .withDefault('confirmButtonLabel', this.globalConfig.saveLabel)
            .withDefault('title', this.globalConfig.editLabel)
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
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.data.editData.confirmDeleteDialogData)
            .withDefault('text', this.globalConfig.confirmDeleteText)
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', this.globalConfig.deleteLabel)
            .withDefault('title', this.globalConfig.deleteLabel)
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
     * @param action - The action to run.
     */
    runEditAction(action: EditActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = runInInjectionContext(this.injector, () => {
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
        void runInInjectionContext(this.injector, async () => {
            await action.action(this.entity, this.entityPriorChanges);
            await this.checkEntity();
        });
    }

    /**
     * Checks if an EditAction is disabled (e.g. Because the current entry doesn't fullfil the requirements).
     * @param action - The EditAction to check.
     * @returns Whether or not the Action can be used.
     */
    editActionDisabled(action: EditActionInternal<EntityType>): boolean {
        return runInInjectionContext(this.injector, () => !action.enabled(this.entityPriorChanges));
    }
}