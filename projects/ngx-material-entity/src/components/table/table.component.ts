import { SelectionModel } from '@angular/cdk/collections';
import { NgFor, NgIf } from '@angular/common';
import { Component, EnvironmentInjector, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { BaseEntityType, Entity } from '../../classes/entity.model';
import { EntityService } from '../../services/entity.service';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-dialog/create-entity-dialog-data.builder';
import { NgxMatEntityCreateDialogComponent } from './create-dialog/create-entity-dialog.component';
import { DisplayColumnValueComponent } from './display-column-value/display-column-value.component';
import { EditEntityData } from './edit-dialog/edit-entity-data';
import { NgxMatEntityEditDialogComponent } from './edit-dialog/edit-entity-dialog.component';
import { EditEntityDataBuilder, EditEntityDataInternal } from './edit-dialog/edit-entity.builder';
import { DisplayColumn, TableData } from './table-data';
import { BaseTableActionInternal, TableActionInternal, TableDataBuilder, TableDataInternal } from './table-data.builder';

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
        NgIf,
        NgFor,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        NgxMatEntityCreateDialogComponent,
        NgxMatEntityEditDialogComponent,
        DisplayColumnValueComponent
    ]
})
export class NgxMatEntityTableComponent<EntityType extends BaseEntityType<Entity>> implements OnInit, OnDestroy {

    /**
     * The configuration for the component.
     */
    @Input()
    tableData!: TableData<EntityType>;

    data!: TableDataInternal<EntityType>;

    isLoading: boolean = true;
    allowCreate!: boolean;

    private entityService!: EntityService<EntityType>;
    private readonly onDestroy: Subject<void> = new Subject<void>();
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild('filter', { static: true }) filter!: string;
    displayedColumns!: string[];
    dataSource: MatTableDataSource<EntityType> = new MatTableDataSource();
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);

    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    importAction!: BaseTableActionInternal;

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: EnvironmentInjector,
        private readonly router: Router
    ) {}

    /**
     * Sets up all the configuration for the table and the EntityService.
     */
    ngOnInit(): void {
        this.data = new TableDataBuilder(this.tableData).getResult();
        this.injector.runInContext(() => {
            this.allowCreate = this.data.baseData.allowCreate();
        });

        this.importAction = new BaseTableActionInternal({
            ...this.data.baseData.importActionData,
            action: () => this.startImportJson()
        });

        this.injector.runInContext(() => {
            this.entityService = inject<EntityService<EntityType>>(this.data.baseData.EntityServiceClass);
        });

        const givenDisplayColumns: string[] = this.data.baseData.displayColumns.map((v) => v.displayName);
        if (this.data.baseData.tableActions.filter(tA => tA.type === 'multi-select').length) {
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
        }
        else {
            this.displayedColumns = givenDisplayColumns;
        }

        this.dataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return this.injector.runInContext(() => {
                return this.data.baseData.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
            });
        };
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (entity: EntityType, filter: string) => {
            const searchStr: string = this.data.baseData.searchString(entity);
            const formattedSearchString: string = searchStr.toLowerCase();
            const formattedFilterString: string = filter.toLowerCase();
            return formattedSearchString.includes(formattedFilterString);
        };
        this.dataSource.filter = this.filter;
        this.dataSource.paginator = this.paginator;

        this.entityService.entitiesSubject.pipe(takeUntil(this.onDestroy)).subscribe((entities) => {
            this.dataSource.data = entities;
            this.selection.clear();
        });
        void this.entityService.read().then(() => {
            this.isLoading = false;
        });
    }

    /**
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     *
     * @param entity - The entity to get the value from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(entity: EntityType, displayColumn: DisplayColumn<EntityType>): unknown {
        return this.injector.runInContext(() => {
            return displayColumn.value(entity);
        });
    }

    private startImportJson(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async () => {
            if (input.files) {
                this.importJson(input.files[0]);
            }
        };
        input.click();
    }

    private importJson(file: File): void {
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.importAction.confirmDialogData)
            .withDefault('text', this.data.baseData.importActionData.confirmDialogData.text)
            .withDefault('title', this.importAction.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                void this.entityService.import(file);
            }
        });
    }

    /**
     * Edits an entity. This either calls the edit-Method provided by the user or uses a default edit-dialog.
     *
     * @param entity - The entity that should be updated.
     * @param dCol - The display column. Is needed if a custom component was used that handles the click event differently.
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    editEntity(entity: EntityType, dCol: DisplayColumn<EntityType>): void {
        if (dCol.disableClick == true) {
            return;
        }
        if (!(this.allowUpdate(entity) || this.allowRead(entity))) {
            return;
        }
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
     *
     * @param entity - The entity that the user wants to edit.
     * @returns True when the user can edit the provided entity and false otherwise.
     */
    allowUpdate(entity: EntityType): boolean {
        return this.injector.runInContext(() => {
            return this.data.baseData.allowUpdate(entity);
        });
    }

    /**
     * Whether viewing the provided entity is allowed.
     *
     * @param entity - The entity that the user wants to view.
     * @returns True when the user can view the provided entity and false otherwise.
     */
    allowRead(entity: EntityType): boolean {
        return this.injector.runInContext(() => {
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
        const dialogData: EditEntityDataInternal<EntityType> = new EditEntityDataBuilder(inputDialogData).getResult();
        const res: number = await firstValueFrom(
            this.dialog.open(NgxMatEntityEditDialogComponent, {
                data: dialogData,
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }).afterClosed()
        ) as number;
        if (res === 0) {
            const data: EntityType[] = this.dataSource.data;
            data[this.dataSource.data.findIndex((e) => e[this.entityService.idKey] === entity[this.entityService.idKey])] = entity;
            this.dataSource.data = data;
            this.selection.clear();
        }
    }

    /**
     * Creates a new Entity. This either calls the create-Method provided by the user or uses a default create-dialog.
     *
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    createEntity(): void {
        this.injector.runInContext(() => {
            if (this.data.baseData.allowCreate()) {
                if (!this.data.baseData.EntityClass) {
                    throw new Error('No "EntityClass" specified for this table');
                }
                if (this.data.baseData.create) {
                    this.data.baseData.create(new this.data.baseData.EntityClass());
                }
                else {
                    this.createDefault(new this.data.baseData.EntityClass());
                }
            }
        });
    }

    private createDefault(entity: EntityType): void {
        const dialogData: CreateEntityDialogDataInternal<EntityType> = new CreateEntityDialogDataBuilder(
            {
                entity: entity,
                EntityServiceClass: this.data.baseData.EntityServiceClass,
                createDialogData: this.data.createDialogData
            }
        ).getResult();
        this.dialog.open(NgxMatEntityCreateDialogComponent, {
            data: dialogData,
            minWidth: '60%',
            autoFocus: false,
            restoreFocus: false
        });
    }

    /**
     * Runs the TableAction for all selected entries.
     * Also handles confirmation with an additional dialog if configured.
     *
     * @param action - The TableAction to run.
     */
    runTableAction(action: TableActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = this.injector.runInContext(() => {
            return action.requireConfirmDialog(this.selection.selected);
        });

        if (!requireConfirmDialog) {
            this.confirmRunTableAction(action);
            return;
        }
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: action.confirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmRunTableAction(action);
            }
        });
    }

    private confirmRunTableAction(action: TableActionInternal<EntityType>): void {
        void this.injector.runInContext(async () => {
            await action.action(this.selection.selected);
        });
    }

    /**
     * Checks if an TableAction is disabled (e.g. Because no entries have been selected).
     *
     * @param action - The TableAction to check.
     * @returns Whether or not the Action can be used.
     */
    tableActionDisabled(action: TableActionInternal<EntityType>): boolean {
        return this.injector.runInContext(() => {
            return !action.enabled(this.selection.selected);
        });
    }

    ngOnDestroy(): void {
        this.onDestroy.next(undefined);
        this.onDestroy.complete();
    }

    /**
     * Applies the search input to filter the table entries.
     *
     * @param event - The keyup-event which contains the search-string of the user.
     */
    applyFilter(event: Event): void {
        const filterValue: string = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


}