import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, EventEmitter, Inject, OnInit, Output, runInInjectionContext } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { CreateEntityData } from './create-entity-data';
import { CreateEntityDataInternal, CreateEntityDialogDataBuilder } from './create-entity-data.builder';
import { BaseEntityType } from '../../../classes/entity.model';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { getValidationErrorsTooltipContent } from '../../../functions/get-validation-errors-tooltip-content.function.ts';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { EntityService } from '../../../services/entity.service';
import { EntityUtilities } from '../../../utilities/entity.utilities';
import { ValidationError, ValidationUtilities } from '../../../utilities/validation.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityFormComponent } from '../../form/form.component';
import { TooltipComponent } from '../../tooltip/tooltip.component';


/**
 * The default dialog used to create new entities based on the configuration passed in the MAT_DIALOG_DATA "inputData".
 * Used by the ngx-mat-entity-table.
 *
 * It offers a lot of customization options which can be found in "CreateEntityDialogData".
 */
@Component({
    selector: 'ngx-mat-entity-create-dialog',
    templateUrl: './create-entity-dialog.component.html',
    styleUrls: ['./create-entity-dialog.component.scss'],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        MatDialogModule,
        MatButtonModule,
        MatBadgeModule,
        TooltipComponent,
        NgxMatEntityFormComponent
    ]
})
export class NgxMatEntityCreateDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    /**
     * Emits when the form is dirty.
     */
    @Output()
    unsavedChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The services that handles the entity.
     */
    entityService!: EntityService<EntityType>;

    /**
     * The internal configuration data.
     */
    data!: CreateEntityDataInternal<EntityType>;

    private entityPriorChanges!: EntityType;

    /**
     * Whether or not the entity is dirty.
     */
    isEntityDirty: boolean = false;
    /**
     * Whether or not the entity is valid.
     */
    isEntityValid: boolean = false;
    /**
     * The validation errors of the entity.
     */
    validationErrors: ValidationError[] = [];
    /**
     * What to display inside the tooltip.
     */
    tooltipContent: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: CreateEntityData<EntityType>,
        readonly dialogRef: MatDialogRef<NgxMatEntityCreateDialogComponent<EntityType>>,
        private readonly injector: EnvironmentInjector,
        private readonly dialog: MatDialog,
        private readonly http: HttpClient,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {}

    ngOnInit(): void {
        this.data = new CreateEntityDialogDataBuilder(this.inputData, this.globalConfig).getResult();
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.data.entity);
        this.dialogRef.disableClose = true;
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
        setTimeout(() => void this.checkIsEntityValid(), 1);
    }

    /**
     * Checks if the entity is valid.
     */
    async checkIsEntityValid(): Promise<void> {
        this.validationErrors = await ValidationUtilities.getEntityValidationErrors(this.data.entity, this.injector, 'create');
        this.tooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.validationErrors));
        this.isEntityValid = this.validationErrors.length === 0;
        this.isEntityDirty = await EntityUtilities.isDirty(this.data.entity, this.entityPriorChanges, this.http);
        this.unsavedChanges.emit(this.isEntityDirty);
    }

    /**
     * Tries add the new entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    async create(): Promise<void> {
        if (!this.isEntityValid) {
            return;
        }
        if (!this.data.createData.createRequiresConfirmDialog) {
            await this.confirmCreate();
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
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.confirmCreate();
        }
    }
    private async confirmCreate(): Promise<void> {
        await this.entityService.create(this.data.entity);
        this.dialogRef.close();
    }

    /**
     * Closes the dialog.
     */
    async cancel(): Promise<void> {
        if (!this.isEntityDirty || !this.data.createData.unsavedChangesRequireConfirmDialog) {
            this.confirmCancel();
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.data.createData.confirmUnsavedChangesDialogData)
            .withDefault('text', this.globalConfig.confirmUnsavedChangesDialogText)
            .withDefault('confirmButtonLabel', this.globalConfig.confirmUnsavedChangesDialogLabel)
            .withDefault('title', this.globalConfig.confirmUnsavedChangesTitle)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            this.confirmCancel();
        }
    }
    private confirmCancel(): void {
        this.dialogRef.close();
    }
}