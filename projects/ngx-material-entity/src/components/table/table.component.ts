import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { BaseEntityType, Entity } from '../../classes/entity.model';
import { EntityService } from '../../services/entity.service';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-dialog/create-entity-dialog-data.builder';
import { NgxMatEntityCreateDialogComponent } from './create-dialog/create-entity-dialog.component';
import { EditEntityData } from './edit-dialog/edit-entity-data';
import { NgxMatEntityEditDialogComponent } from './edit-dialog/edit-entity-dialog.component';
import { EditEntityDataBuilder, EditEntityDataInternal } from './edit-dialog/edit-entity.builder';
import { MultiSelectAction, TableData } from './table-data';
import { TableDataBuilder, TableDataInternal } from './table-data.builder';

/**
 * Generates a fully functional table for displaying, creating, updating and deleting entities
 * based on the configuration passed in the @Input "tableData".
 *
 * It offers a lot of customization options which can be found in "TableData".
 */
@Component({
    selector: 'ngx-mat-entity-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class NgxMatEntityTableComponent<EntityType extends BaseEntityType<Entity>> implements OnInit, OnDestroy {

    /**
     * The configuration for the component.
     */
    @Input()
    tableData!: TableData<EntityType>;

    data!: TableDataInternal<EntityType>;

    isLoading: boolean = true;

    private entityService!: EntityService<EntityType>;
    private readonly onDestroy: Subject<void> = new Subject<void>();
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild('filter', { static: true }) filter!: string;
    displayedColumns!: string[];
    dataSource: MatTableDataSource<EntityType> = new MatTableDataSource();
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);

    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    importAction!: Omit<MultiSelectAction<EntityType>, 'confirmationDialog'>;

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: Injector,
        private readonly router: Router
    ) {}

    /**
     * Sets up all the configuration for the table and the EntityService.
     */
    ngOnInit(): void {
        this.data = new TableDataBuilder(this.tableData).getResult();

        this.importAction = {
            ...this.data.baseData.importActionData,
            action: () => this.startImportJson()
        };

        this.entityService = this.injector.get(this.data.baseData.EntityServiceClass) as EntityService<EntityType>;

        const givenDisplayColumns: string[] = this.data.baseData.displayColumns.map((v) => v.displayName);
        if (this.data.baseData.multiSelectActions.length) {
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
        }
        else {
            this.displayedColumns = givenDisplayColumns;
        }

        this.dataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return this.data.baseData.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
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
            .withDefault('text', this.data.baseData.importActionData.confirmDialogData?.text as string[])
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
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    editEntity(entity: EntityType): void {
        if (!(this.data.baseData.allowUpdate(entity) || this.data.baseData.allowRead(entity))) {
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
     * Runs the MultiAction for all selected entries.
     * Also handles confirmation with an additional dialog if configured.
     *
     * @param action - The MultiAction to run.
     */
    runMultiAction(action: MultiSelectAction<EntityType>): void {
        if (!action.requireConfirmDialog || !action.requireConfirmDialog(this.selection.selected)) {
            this.confirmRunMultiAction(action);
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(action.confirmDialogData)
            .withDefault('text', [`Do you really want to run this action on ${this.selection.selected.length} entries?`])
            .withDefault('title', action.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmRunMultiAction(action);
            }
        });
    }

    private confirmRunMultiAction(action: MultiSelectAction<EntityType>): void {
        action.action(this.selection.selected);
    }

    /**
     * Checks if an MultiAction is disabled (e.g. Because no entries have been selected).
     *
     * @param action - The MultiAction to check.
     * @returns Whether or not the Action can be used.
     */
    multiActionDisabled(action: MultiSelectAction<EntityType>): boolean {
        if (!this.selection.selected.length) {
            return true;
        }
        if (action.enabled?.(this.selection.selected) === false) {
            return true;
        }
        return false;
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