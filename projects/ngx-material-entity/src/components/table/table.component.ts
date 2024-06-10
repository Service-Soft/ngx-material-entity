import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, EventEmitter, Inject, Input, OnInit, Output, inject, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CreateEntityDataInternal, CreateEntityDialogDataBuilder } from './create-dialog/create-entity-data.builder';
import { NgxMatEntityCreateDialogComponent } from './create-dialog/create-entity-dialog.component';
import { DisplayColumnValueComponent } from './display-column-value/display-column-value.component';
import { EditEntityData } from './edit-dialog/edit-entity-data';
import { NgxMatEntityEditDialogComponent } from './edit-dialog/edit-entity-dialog.component';
import { EditEntityDataBuilder, EditEntityDataInternal } from './edit-dialog/edit-entity.builder';
import { DisplayColumn, TableData } from './table-data';
import { BaseTableActionInternal, TableActionInternal, TableDataBuilder, TableDataInternal } from './table-data.builder';
import { BaseEntityType, Entity } from '../../classes/entity.model';
import { DynamicStyleClassDirective } from '../../directives/dynamic-style-class.directive';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CustomTableConfiguration } from '../custom-table/custom-table-configuration.model';
import { CustomTableComponent } from '../custom-table/custom-table.component';

/**
 * Generates a fully functional table for displaying, creating, updating and deleting entities
 * based on the configuration passed in the @Input "tableData".
 *
 * It offers a lot of customization options which can be found in "TableData".
 */
@Component({
    selector: 'ngx-mat-entity-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatSortModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        NgxMatEntityCreateDialogComponent,
        NgxMatEntityEditDialogComponent,
        DisplayColumnValueComponent,
        DynamicStyleClassDirective,
        CustomTableComponent
    ]
})
export class NgxMatEntityTableComponent<EntityType extends BaseEntityType<Entity>> implements OnInit {

    /**
     * The configuration for the component.
     */
    @Input({ required: true })
    tableData!: TableData<EntityType>;

    /**
     * Emits when there are unsaved changes on either the create or update dialog.
     */
    @Output()
    readonly unsavedDialogChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * The internal TableData.
     */
    data!: TableDataInternal<EntityType>;

    /**
     * Configuration for the table.
     */
    tableConfig!: CustomTableConfiguration<EntityType>;

    /**
     * The entities to display inside the table.
     */
    entities!: EntityType[];

    /**
     * A search string for filtering table results.
     */
    searchString: string = '';

    /**
     * The currently selected entities.
     */
    selected: EntityType[] = [];

    /**
     * Whether or not the table content is currently loading.
     */
    isLoading: boolean = true;
    /**
     * Whether or not the current user is allowed to create entries for the table.
     */
    allowCreate!: boolean;

    private entityService!: EntityService<EntityType>;

    /**
     * The internal BaseTableAction. Sets default values.
     */
    importAction!: BaseTableActionInternal;

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: EnvironmentInjector,
        private readonly router: Router,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {}

    /**
     * Sets up all the configuration for the table and the EntityService.
     */
    ngOnInit(): void {
        this.data = new TableDataBuilder(this.globalConfig, this.tableData).getResult();
        runInInjectionContext(this.injector, () => {
            this.allowCreate = this.data.baseData.allowCreate();
            this.entityService = inject<EntityService<EntityType>>(this.data.baseData.EntityServiceClass);
        });

        this.importAction = new BaseTableActionInternal({
            ...this.data.baseData.importActionData,
            action: () => this.startImportJson()
        }, this.globalConfig);

        this.tableConfig = {
            displayColumns: this.tableData.baseData.displayColumns,
            withSelection: !!this.data.baseData.tableActions.filter(tA => tA.type === 'multi-select').length,
            allowClick: (value) => this.allowRead(value) || this.allowUpdate(value),
            dynamicRowStyleClasses: this.data.baseData.dynamicRowStyleClasses,
            searchStringForRow: this.data.baseData.searchString
        };

        this.entityService.entitiesSubject.subscribe((entities) => {
            this.entities = [...entities];
        });
        // eslint-disable-next-line promise/prefer-await-to-then
        void this.entityService.read().then(() => {
            this.isLoading = false;
        });
    }

    /**
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     * @param entity - The entity to get the value from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(entity: EntityType, displayColumn: DisplayColumn<EntityType>): unknown {
        return runInInjectionContext(this.injector, () => {
            return displayColumn.value(entity);
        });
    }

    private startImportJson(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async () => {
            if (input.files) {
                await this.importJson(input.files[0]);
            }
        };
        input.click();
    }

    private async importJson(file: File): Promise<void> {
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.importAction.confirmDialogData)
            .withDefault('text', this.data.baseData.importActionData.confirmDialogData.text)
            .withDefault('title', this.importAction.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.entityService.import(file);
        }
    }

    /**
     * Edits an entity. This either calls the edit-Method provided by the user or uses a default edit-dialog.
     * @param entity - The entity that should be updated.
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    editEntity(entity: EntityType): void {
        if (!this.data.baseData.EntityClass) {
            throw new Error('No "EntityClass" specified for this table');
        }
        if (this.data.baseData.edit) {
            this.data.baseData.edit(new this.data.baseData.EntityClass(entity));
            return;
        }
        if (this.data.baseData.defaultEdit == 'page') {
            this.editDefaultPage(new this.data.baseData.EntityClass(entity));
            return;
        }
        void this.editDefaultDialog(new this.data.baseData.EntityClass(entity));
    }

    /**
     * Whether updating the provided entity is allowed.
     * @param entity - The entity that the user wants to edit.
     * @returns True when the user can edit the provided entity and false otherwise.
     */
    allowUpdate(entity: EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            return this.data.baseData.allowUpdate(entity);
        });
    }

    /**
     * Whether viewing the provided entity is allowed.
     * @param entity - The entity that the user wants to view.
     * @returns True when the user can view the provided entity and false otherwise.
     */
    allowRead(entity: EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            return this.data.baseData.allowRead(entity);
        });
    }

    private editDefaultPage(entity: EntityType): void {
        void this.router.navigate(['', this.entityService.editBaseRoute, entity.id]);
    }

    private async editDefaultDialog(entity: EntityType): Promise<void> {
        const inputDialogData: EditEntityData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.data.baseData.EntityServiceClass,
            allowUpdate: this.data.baseData.allowUpdate,
            allowDelete: this.data.baseData.allowDelete,
            editData: this.data.editData
        };
        const dialogData: EditEntityDataInternal<EntityType> = new EditEntityDataBuilder(inputDialogData, this.globalConfig).getResult();
        const dialogRef: MatDialogRef<NgxMatEntityEditDialogComponent<BaseEntityType<unknown>>, number> = this.dialog.open(
            NgxMatEntityEditDialogComponent, {
                data: dialogData,
                autoFocus: false,
                restoreFocus: false
            }
        );
        dialogRef.componentInstance.unsavedChanges.subscribe(res => this.unsavedDialogChanges.emit(res));
        const res: number | undefined = await firstValueFrom(dialogRef.afterClosed());
        this.unsavedDialogChanges.emit(false);
        if (res === 0) {
            this.entities[this.entities.findIndex((e) => e[this.entityService.idKey] === entity[this.entityService.idKey])] = entity;
            this.entities = this.entities;
        }
    }

    /**
     * Creates a new Entity. This either calls the create-Method provided by the user or uses a default create-dialog.
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    createEntity(): void {
        if (this.allowCreate) {
            if (!this.data.baseData.EntityClass) {
                throw new Error('No "EntityClass" specified for this table');
            }
            const entity: EntityType = new this.data.baseData.EntityClass();
            EntityUtilities.setDefaultValues(entity);
            if (this.data.baseData.create) {
                this.data.baseData.create(entity);
                return;
            }
            if (this.data.baseData.defaultCreate == 'page') {
                this.createDefaultPage();
                return;
            }
            void this.createDefaultDialog(entity);
        }
    }

    private createDefaultPage(): void {
        void this.router.navigateByUrl(this.entityService.createBaseRoute);
    }

    private async createDefaultDialog(entity: EntityType): Promise<void> {
        const dialogData: CreateEntityDataInternal<EntityType> = new CreateEntityDialogDataBuilder(
            {
                entity: entity,
                EntityServiceClass: this.data.baseData.EntityServiceClass,
                createData: this.data.createData
            },
            this.globalConfig
        ).getResult();
        const dialogRef: MatDialogRef<NgxMatEntityCreateDialogComponent<BaseEntityType<unknown>>> = this.dialog.open(
            NgxMatEntityCreateDialogComponent, {
                data: dialogData,
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }
        );
        dialogRef.componentInstance.unsavedChanges.subscribe(res => this.unsavedDialogChanges.emit(res));
        await firstValueFrom(dialogRef.afterClosed());
        this.unsavedDialogChanges.emit(false);
    }

    /**
     * Runs the TableAction for all selected entries.
     * Also handles confirmation with an additional dialog if configured.
     * @param action - The TableAction to run.
     */
    async runTableAction(action: TableActionInternal<EntityType>): Promise<void> {
        const requireConfirmDialog: boolean = runInInjectionContext(this.injector, () => {
            return action.requireConfirmDialog(this.selected);
        });

        if (!requireConfirmDialog) {
            await this.confirmRunTableAction(action);
            return;
        }
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: action.confirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.confirmRunTableAction(action);
        }
    }

    private async confirmRunTableAction(action: TableActionInternal<EntityType>): Promise<void> {
        await runInInjectionContext(this.injector, async () => {
            await action.action(this.selected);
        });
    }

    /**
     * Checks if an TableAction is disabled (e.g. Because no entries have been selected).
     * @param action - The TableAction to check.
     * @returns Whether or not the Action can be used.
     */
    tableActionDisabled(action: TableActionInternal<EntityType>): boolean {
        return runInInjectionContext(this.injector, () => {
            return !action.enabled(this.selected);
        });
    }
}