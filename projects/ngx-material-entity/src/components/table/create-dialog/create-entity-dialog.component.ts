import { NgFor, NgIf } from '@angular/common';
import { Component, EnvironmentInjector, Inject, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseEntityType } from '../../../classes/entity.model';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../default-global-configuration-values';
import { getValidationErrorsTooltipContent } from '../../../functions/get-validation-errors-tooltip-content.function.ts';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { EntityService } from '../../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../../utilities/entity.utilities';
import { ValidationError, ValidationUtilities } from '../../../utilities/validation.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityInputModule } from '../../input/input.module';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { CreateEntityData } from './create-entity-dialog-data';
import { CreateEntityDataInternal, CreateEntityDialogDataBuilder } from './create-entity-dialog-data.builder';

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
        NgxMatEntityInputModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatTabsModule,
        MatBadgeModule,
        TooltipComponent
    ]
})
export class NgxMatEntityCreateDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The tabs of the entity.
     */
    entityTabs!: EntityTab<EntityType>[];

    /**
     * The services that handles the entity.
     */
    entityService!: EntityService<EntityType>;

    /**
     * The internal configuration data.
     */
    data!: CreateEntityDataInternal<EntityType>;

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
        public dialogRef: MatDialogRef<NgxMatEntityCreateDialogComponent<EntityType>>,
        private readonly injector: EnvironmentInjector,
        private readonly dialog: MatDialog,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        protected readonly globalConfig: NgxGlobalDefaultValues
    ) {}

    ngOnInit(): void {
        this.data = new CreateEntityDialogDataBuilder(this.inputData, this.globalConfig).getResult();
        this.dialogRef.disableClose = true;
        this.entityTabs = EntityUtilities.getEntityTabs(this.data.entity, this.injector, true);
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
    }

    /**
     * Tries add the new entity and close the dialog afterwards.
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
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(
            this.globalConfig,
            this.data.createData.confirmCreateDialogData
        )
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
        void this.entityService.create(this.data.entity).then(() => this.dialogRef.close());
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}