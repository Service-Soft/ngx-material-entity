import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseEntityType } from '../../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../../decorators/base/property-decorator-internal.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../default-global-configuration-values';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { getValidationErrorsTooltipContent } from '../../../functions/get-validation-errors-tooltip-content.function.ts';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { EntityService } from '../../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../../utilities/entity.utilities';
import { ValidationError, ValidationUtilities } from '../../../utilities/validation.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityInputModule } from '../../input/input.module';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { EditActionInternal } from './edit-data.builder';
import { EditEntityData } from './edit-entity-data';
import { EditEntityDataBuilder, EditEntityDataInternal } from './edit-entity.builder';

/**
 * The default dialog used to edit an existing entity based on the configuration passed in the MAT_DIALOG_DATA "inputData".
 * Used by the ngx-mat-entity-table.
 *
 * It offers a lot of customization options which can be found in "EditEntityDialogData".
 */
@Component({
    selector: 'ngx-mat-entity-edit-dialog',
    templateUrl: './edit-entity-dialog.component.html',
    styleUrls: ['./edit-entity-dialog.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgxMatEntityInputModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatTabsModule,
        NgxMatEntityConfirmDialogComponent,
        MatMenuModule,
        MatBadgeModule,
        TooltipComponent
    ]
})
export class NgxMatEntityEditDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The tabs of the dialog.
     */
    entityTabs!: EntityTab<EntityType>[];

    /**
     * The service of the provided entity.
     */
    entityService!: EntityService<EntityType>;

    /**
     * The entity before any changes have been applied.
     */
    entityPriorChanges!: EntityType;

    /**
     * The internal configuration data.
     */
    data!: EditEntityDataInternal<EntityType>;

    /**
     * Whether or not the entity is valid.
     */
    isEntityValid: boolean = true;
    /**
     * Whether or not the entity is dirty.
     */
    isEntityDirty: boolean = false;
    /**
     * The validation errors of the entity.
     */
    validationErrors: ValidationError[] = [];
    /**
     * What to display inside the tooltip.
     */
    tooltipContent: string = '';

    /**
     * Whether or not the entity is readonly.
     */
    isEntityReadOnly!: boolean;
    /**
     * Whether or not deleting the entity is allowed for the current user.
     */
    allowDelete!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: EditEntityData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<EntityType>>,
        private readonly injector: EnvironmentInjector,
        private readonly dialog: MatDialog,
        private readonly http: HttpClient,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {}

    ngOnInit(): void {
        this.data = new EditEntityDataBuilder(this.inputData, this.globalConfig).getResult();
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.data.entity);
        runInInjectionContext(this.injector, () => {
            this.isEntityReadOnly = !this.data.allowUpdate(this.entityPriorChanges);
            this.allowDelete = this.data.allowDelete(this.entityPriorChanges);
        });
        this.dialogRef.disableClose = true;
        this.entityTabs = EntityUtilities.getEntityTabs(this.data.entity, this.injector, false, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
        setTimeout(() => void this.checkIsEntityValid(), 1);
    }

    /**
     * Checks if the input with the given key is readonly.
     * @param key - The key for the input to check.
     * @returns Whether or not the input for the key is read only.
     */
    isReadOnly(key: keyof EntityType): boolean {
        return runInInjectionContext(this.injector, () => {

            const metadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(this.data.entity, key);
            if (!metadata) {
                throw new Error(`No metadata was found for the key "${String(key)}"`);
            }
            return this.isEntityReadOnly || metadata.isReadOnly(this.data.entity);
        });
    }

    /**
     * Checks if the entity has become invalid or dirty.
     */
    async checkEntity(): Promise<void> {
        await this.checkIsEntityValid();
        this.isEntityDirty = await EntityUtilities.isDirty(this.data.entity, this.entityPriorChanges, this.http);
    }

    private async checkIsEntityValid(): Promise<void> {
        this.validationErrors = await ValidationUtilities.getEntityValidationErrors(this.data.entity, this.injector, 'update');
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
        void this.entityService.update(this.data.entity, this.entityPriorChanges).then(() => this.dialogRef.close(1));
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
        void this.entityService.delete(this.entityPriorChanges).then(() => this.dialogRef.close(2));
    }

    /**
     * Reverts all changes made and closes the dialog.
     */
    cancel(): void {
        EntityUtilities.resetChangesOnEntity(this.data.entity, this.entityPriorChanges);
        this.dialogRef.close(0);
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
            await action.action(this.data.entity, this.entityPriorChanges);
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