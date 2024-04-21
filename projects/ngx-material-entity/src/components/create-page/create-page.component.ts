import { Location, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EnvironmentInjector, HostListener, Inject, InjectionToken, OnInit, Renderer2, runInInjectionContext } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { PageCreateDataBuilder, PageCreateDataInternal } from './page-create-data.builder';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { getValidationErrorsTooltipContent } from '../../functions/get-validation-errors-tooltip-content.function.ts';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { UnsavedChangesPage } from '../../services/unsaved-changes.guard';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { ValidationError, ValidationUtilities } from '../../utilities/validation.utilities';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityFormComponent } from '../form/form.component';
import { CreateEntityData } from '../table/create-dialog/create-entity-data';
import { CreateData } from '../table/table-data';
import { TooltipComponent } from '../tooltip/tooltip.component';

/**
 * The data that needs to be provided for a route to be able to create a entity.
 */
export type PageCreateData<EntityType extends BaseEntityType<EntityType>> = Omit<CreateEntityData<EntityType>, 'entity' | 'EntityServiceClass'> & {
    /**
     * Whether or not to display a loading spinner while the data for the page is loaded.
     * @default true
     */
    displayLoadingSpinner?: boolean,
    /**
     * The data of the default create page.
     */
    createData?: CreateData & {
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
 * The entity service that needs to be provided in the providers array of the create page route.
 */
// eslint-disable-next-line typescript/no-explicit-any
export const NGX_CREATE_DATA_ENTITY_SERVICE: InjectionToken<EntityService<any>> = new InjectionToken<EntityService<any>>('NGX_CREATE_DATA_ENTITY_SERVICE');
/**
 * The entity class that needs to be provided in the providers array of the create page route.
 */
// eslint-disable-next-line typescript/no-explicit-any
export const NGX_CREATE_DATA_ENTITY: InjectionToken<EntityClassNewable<any>> = new InjectionToken<EntityClassNewable<any>>('NGX_CREATE_DATA_ENTITY');
/**
 * The configuration that needs to be provided in the providers array of the create page route.
 */
// eslint-disable-next-line typescript/no-explicit-any
export const NGX_CREATE_DATA: InjectionToken<PageCreateData<any>> = new InjectionToken<PageCreateData<any>>('NGX_CREATE_DATA');

/**
 * A generic page that allows you to create a specific entity.
 * For this to work you need to provide some data for the route.
 */
@Component({
    selector: 'ngx-mat-entity-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        TooltipComponent,
        NgxMatEntityFormComponent
    ]
})
export class NgxMatEntityCreatePageComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit, UnsavedChangesPage {

    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The entity to create.
     */
    entity!: EntityType;
    /**
     * The entity before any changes have been made.
     * This is used to determine if leaving the page is possible without interruption.
     */
    entityPriorChanges!: EntityType;

    /**
     * Configuration data for this component.
     */
    data!: PageCreateDataInternal<EntityType>;

    /**
     * All validation errors of the entity.
     */
    validationErrors!: ValidationError[];
    /**
     * Whether or not the entity is valid.
     */
    isEntityValid: boolean = false;
    /**
     * Whether or not the entity is dirty.
     */
    isEntityDirty: boolean = false;
    /**
     * What to display inside the tooltip.
     */
    tooltipContent: string = '';

    /**
     * Whether or not the page has been loaded.
     */
    isLoaded: boolean = false;

    private inConfirmNavigation: boolean = false;

    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasUnsavedChanges(): boolean {
        return this.isEntityDirty && this.data.createData.unsavedChangesRequireConfirmDialog;
    }

    constructor(
        private readonly dialog: MatDialog,
        private readonly location: Location,
        private readonly injector: EnvironmentInjector,
        @Inject(NGX_CREATE_DATA_ENTITY_SERVICE)
        readonly entityService: EntityService<EntityType>,
        @Inject(NGX_CREATE_DATA_ENTITY)
        private readonly EntityClass: EntityClassNewable<EntityType>,
        @Inject(NGX_CREATE_DATA)
        private readonly inputData: PageCreateData<EntityType>,
        private readonly http: HttpClient,
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        protected readonly globalConfig: NgxGlobalDefaultValues
    ) { }

    async ngOnInit(): Promise<void> {
        this.data = new PageCreateDataBuilder(this.inputData, this.globalConfig).getResult();
        if (this.data == null) {
            this.confirmNavigateBack();

            throw new Error('No create data was provided for "NGX_CREATE_DATA". You need to provide a value in your routes providers array.');
        }

        this.entity = new this.EntityClass();
        EntityUtilities.setDefaultValues(this.entity);
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.entity);
        await this.checkIsEntityValid();

        this.isLoaded = true;
        setTimeout(() => this.checkOffset(), 1);
        // setTimeout(() => this.checkEntity(), 1);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    @HostListener('window:beforeunload')
    canDeactivate(): boolean {
        return !this.hasUnsavedChanges || this.inConfirmNavigation;
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
     * Checks if the entity has become invalid or dirty.
     */
    async checkEntity(): Promise<void> {
        await this.checkIsEntityValid();
        this.isEntityDirty = await EntityUtilities.isDirty(this.entity, this.entityPriorChanges, this.http);
    }

    private async checkIsEntityValid(): Promise<void> {
        this.validationErrors = await ValidationUtilities.getEntityValidationErrors(this.entity, this.injector, 'create');
        this.tooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.validationErrors));
        this.isEntityValid = this.validationErrors.length === 0;
    }

    /**
     * Tries create the entity and navigate back afterwards.
     * Also handles the confirmation if required.
     */
    create(): void {
        if (!this.isEntityValid) {
            return;
        }
        if (!this.data.createData.createRequiresConfirmDialog) {
            this.confirmCreate();
            return;
        }

        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.data.createData.confirmCreateDialogData)
            .withDefault('text', this.globalConfig.confirmCreateText)
            .withDefault('confirmButtonLabel', this.globalConfig.createLabel)
            .withDefault('title', this.globalConfig.createLabel)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmCreate();
            }
        });
    }

    private confirmCreate(): void {
        void this.entityService.create(this.entity).then(() => this.confirmNavigateBack());
    }

    /**
     * Tries to navigate back.
     */
    async navigateBack(): Promise<void> {
        if (!this.hasUnsavedChanges) {
            this.confirmNavigateBack();
            return;
        }

        const res: boolean = await this.openConfirmNavigationDialog();
        if (res) {
            this.confirmNavigateBack();
        }
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    async openConfirmNavigationDialog(): Promise<boolean> {
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: this.data.createData.confirmUnsavedChangesDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        return (await firstValueFrom(dialogRef.afterClosed())) ?? false;
    }

    private confirmNavigateBack(): void {
        this.inConfirmNavigation = true;
        this.location.back();
    }

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
            return metadata.isReadOnly(this.entity);
        });
    }
}