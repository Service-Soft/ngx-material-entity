import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EntityService } from '../../classes/entity-service.class';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Entity } from '../../classes/entity-model.class';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NgxMatEntityCreateDialogComponent } from './create-dialog/create-entity-dialog.component';
import { NgxMatEntityEditDialogComponent } from './edit-dialog/edit-entity-dialog.component';
import { EditEntityDialogData } from './edit-dialog/edit-entity-dialog-data';
import { MultiSelectAction, TableData } from './table-data';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { CreateEntityDialogDataBuilder, CreateEntityDialogDataInternal } from './create-dialog/create-entity-dialog-data.builder';
import { TableDataBuilder, TableDataInternal } from './table-data.builder';
import { EditEntityDialogDataBuilder, EditEntityDialogDataInternal } from '../table/edit-dialog/edit-entity-dialog.builder';

@Component({
    selector: 'ngx-mat-entity-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class NgxMatEntityTableComponent<EntityType extends Entity> implements OnInit, OnDestroy {

    /**
     * The configuration for the component.
     */
    @Input()
    tableData!: TableData<EntityType>;

    data!: TableDataInternal<EntityType>;

    private entityService!: EntityService<EntityType>;
    private readonly onDestroy = new Subject<void>();
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild('filter', { static: true }) filter!: string;
    displayedColumns!: string[];
    dataSource: MatTableDataSource<EntityType> = new MatTableDataSource();
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);

    constructor(private readonly dialog: MatDialog, private readonly injector: Injector) {}

    ngOnInit(): void {
        this.data = new TableDataBuilder(this.tableData).tableData;

        this.entityService = this.injector.get(this.data.baseData.EntityServiceClass) as EntityService<EntityType>;

        const givenDisplayColumns = this.data.baseData.displayColumns.map((v) => v.displayName);
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
        if (this.data.baseData.searchString) {
            this.dataSource.filterPredicate = (entity: EntityType, filter: string) => {
                const searchStr = this.data.baseData.searchString(entity) ;
                const formattedSearchString = searchStr.toLowerCase();
                const formattedFilterString = filter.toLowerCase();
                return formattedSearchString.includes(formattedFilterString);
            };
        }
        this.dataSource.filter = this.filter;
        this.dataSource.paginator = this.paginator;

        this.entityService.entitiesSubject.pipe(takeUntil(this.onDestroy)).subscribe((entities) => {
            this.dataSource.data = entities;
            this.selection.clear();
        });
        this.entityService.read();
    }

    editEntity(entity: EntityType): void {
        if (this.data.baseData.allowEdit(entity)) {
            if (!this.data.baseData.EntityClass) {
                throw new Error('No "EntityClass" specified for this table');
            }
            if (this.data.baseData.edit) {
                this.data.baseData.edit(new this.data.baseData.EntityClass(entity));
            }
            else {
                this.editDefault(new this.data.baseData.EntityClass(entity));
            }
        }
    }
    private editDefault(entity: EntityType): void {
        const inputDialogData: EditEntityDialogData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.data.baseData.EntityServiceClass,
            allowDelete: this.data.baseData.allowDelete,
            editDialogData: this.data.editDialogData
        }
        const dialogData: EditEntityDialogDataInternal<EntityType> = new EditEntityDialogDataBuilder(inputDialogData).editDialogData;
        firstValueFrom(
            this.dialog.open(NgxMatEntityEditDialogComponent, {
                data: dialogData,
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }).afterClosed()
        ).then((res: number) => {
            if (res === 0) {
                const data = this.dataSource.data;
                data[this.dataSource.data.findIndex((e) => e.id === entity.id)] = entity;
                this.dataSource.data = data;
                this.selection.clear();
            }
        });
    }

    createEntity(): void {
        if (this.data.baseData.allowCreate) {
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
        ).createDialogData;
        this.dialog.open(NgxMatEntityCreateDialogComponent, {
            data: dialogData,
            minWidth: '60%',
            autoFocus: false,
            restoreFocus: false
        });
    }

    runMultiAction(action: MultiSelectAction<EntityType>): void {
        if (!action.requireConfirmDialog || !action.requireConfirmDialog(this.selection.selected)) {
            return this.confirmRunMultiAction(action);
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(action.confirmDialogData)
            .withDefaultText([`Do you really want to run this action on ${this.selection.selected.length} entries?`])
            .withDefaultTitle(action.displayName).confirmDialogData;
        const dialogref = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogref.afterClosed().subscribe((res: number) => {
            if (res === 1) {
                this.confirmRunMultiAction(action);
            }
        });
    }
    private confirmRunMultiAction(action: MultiSelectAction<EntityType>): void {
        action.action(this.selection.selected);
    }

    multiActionDisabled(action: MultiSelectAction<EntityType>): boolean {
        if (!this.selection.selected.length) {
            return true;
        }
        if (action.enabled?.(this.selection.selected) === false) {
            return true;
        }
        return false;
    }

    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.dataSource.data.forEach((row) => this.selection.select(row));
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    ngOnDestroy(): void {
        this.onDestroy.next(undefined);
        this.onDestroy.complete();
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}