import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseEntityType } from '../../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../../decorators/base/property-decorator-internal.data';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { EntityService } from '../../../services/entity.service';
import { EntityTab, EntityUtilities } from '../../../utilities/entity.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NgxMatEntityInputModule } from '../../input/input.module';
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
        MatMenuModule
    ]
})
export class NgxMatEntityEditDialogComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    entityTabs!: EntityTab<EntityType>[];

    entityService!: EntityService<EntityType>;

    entityPriorChanges!: EntityType;

    data!: EditEntityDataInternal<EntityType>;

    isEntityValid: boolean = true;
    isEntityDirty: boolean = false;

    isEntityReadOnly!: boolean;
    allowDelete!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: EditEntityData<EntityType>,
        public dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<EntityType>>,
        private readonly injector: EnvironmentInjector,
        private readonly dialog: MatDialog,
        private readonly http: HttpClient
    ) {}

    ngOnInit(): void {
        this.data = new EditEntityDataBuilder(this.inputData).getResult();
        this.entityPriorChanges = LodashUtilities.cloneDeep(this.data.entity);
        this.injector.runInContext(() => {
            this.isEntityReadOnly = !this.data.allowUpdate(this.entityPriorChanges);
            this.allowDelete = this.data.allowDelete(this.entityPriorChanges);
        });
        this.dialogRef.disableClose = true;
        this.entityTabs = EntityUtilities.getEntityTabs(this.data.entity, false, true);
        this.entityService = this.injector.get(this.data.EntityServiceClass) as EntityService<EntityType>;
    }

    /**
     * Checks if the input with the given key is readonly.
     *
     * @param key - The key for the input to check.
     * @returns Whether or not the input for the key is read only.
     */
    isReadOnly(key: keyof EntityType): boolean {
        return this.injector.runInContext(() => {
            const metadata: PropertyDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(this.data.entity, key);
            return this.isEntityReadOnly || metadata.isReadOnly(this.data.entity);
        });
    }

    /**
     * Checks if the entity has become invalid or dirty.
     */
    async checkEntity(): Promise<void> {
        this.isEntityValid = EntityUtilities.isEntityValid(this.data.entity, 'update');
        this.isEntityDirty = await EntityUtilities.isDirty(this.data.entity, this.entityPriorChanges, this.http);
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
        void this.injector.runInContext(async () => {
            await action.action(this.data.entity, this.entityPriorChanges);
            await this.checkEntity();
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