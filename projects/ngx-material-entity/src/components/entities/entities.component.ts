import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EntityService } from '../../classes/entity-service.class';
import { Subject, takeUntil } from 'rxjs';
import { Entity } from '../../classes/entity-model.class';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CreateEntityDialogComponent } from './create-entity-dialog/create-entity-dialog.component';
import { CreateEntityDialogData } from './create-entity-dialog/create-entity-dialog-data';
import { EditEntityDialogComponent } from './edit-entity-dialog/edit-entity-dialog.component';
import { EditEntityDialogData } from './edit-entity-dialog/edit-entity-dialog-data';
import { MultiSelectAction, EntitiesData, CreateDialogData, EditDialogData } from './entities-data';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data';

@Component({
    selector: 'ngx-material-entities',
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent<EntityType extends Entity> implements OnInit, OnDestroy {

    /**
     * The configuration for the entities-component
     */
    @Input()
    entitiesData!: EntitiesData<EntityType>;

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
        this.validateInput();

        this.entityService = this.injector.get(this.entitiesData.baseData.EntityServiceClass) as EntityService<EntityType>;

        const givenDisplayColumns = this.entitiesData.baseData.displayColumns.map((v) => v.displayName);
        if (this.entitiesData.baseData.multiSelectActions?.length) {
            if (givenDisplayColumns.find((s) => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved for the multi-select action functionality.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
        }
        else {
            this.displayedColumns = givenDisplayColumns;
        }

        this.dataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return this.entitiesData.baseData.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
        };
        this.dataSource.sort = this.sort;
        if (this.entitiesData.baseData.searchString) {
            this.dataSource.filterPredicate = (entity: EntityType, filter: string) => {
                const searchStr = this.entitiesData.baseData.searchString?.(entity) as string;
                const formattedSearchString = searchStr.toLowerCase();
                const formattedFilterString = filter.toLowerCase();
                return formattedSearchString.includes(formattedFilterString);
            };
        }
        this.dataSource.filter = this.filter;
        this.dataSource.paginator = this.paginator;

        this.entityService.entitiesSubject.pipe(takeUntil(this.onDestroy)).subscribe((entities) => {
            this.dataSource.data = entities;
        });
        this.entityService.read();
    }

    private validateInput(): void {
        if (!this.entitiesData.baseData.displayColumns) {
            throw new Error('Missing required Input data "displayColumns"');
        }
        if (!this.entitiesData.baseData.title) {
            throw new Error('Missing required Input data "title"');
        }
        if (!this.entitiesData.baseData.EntityServiceClass) {
            throw new Error('Missing required Input data "EntityServiceClass"');
        }
        if (this.entitiesData.baseData.allowCreate === undefined) {
            this.entitiesData.baseData.allowCreate = true;
        }
        if (this.entitiesData.baseData.allowEdit === undefined) {
            this.entitiesData.baseData.allowEdit = () => true;
        }
        if (this.entitiesData.baseData.allowDelete === undefined) {
            this.entitiesData.baseData.allowDelete = () => true;
        }
        if (
            (
                this.entitiesData.baseData.allowEdit !== (() => false)
                || this.entitiesData.baseData.allowDelete !== (() => false)
                || this.entitiesData.baseData.allowCreate
            )
            && !this.entitiesData.baseData.EntityClass
        ) {
            throw new Error(`
                Missing required Input data "EntityClass".
                You can only omit this value if you can neither create or update entities.`
            );
        }
        if (this.entitiesData.baseData.allowCreate && !this.entitiesData.baseData.create && !this.entitiesData.createDialogData) {
            throw new Error(
                `Missing required Input data "createDialogData".
                You can only omit this value when creation is disallowed or done with a custom create method.`
            );
        }
        if (
            (
                this.entitiesData.baseData.allowEdit !== (() => false)
                || this.entitiesData.baseData.allowDelete !== (() => false)
            )
            && !this.entitiesData.baseData.edit
            && !this.entitiesData.editDialogData
        ) {
            throw new Error(
                `Missing required Input data "editDialogData".
                You can only omit this value when editing and deleting is disallowed or done with a custom edit method.`
            );
        }
    }

    editEntity(entity: EntityType): void {
        if (this.entitiesData.baseData.allowEdit?.(entity)) {
            if (this.entitiesData.baseData.edit) {
                this.entitiesData.baseData.edit(new this.entitiesData.baseData.EntityClass(entity));
            }
            else {
                this.editDefault(new this.entitiesData.baseData.EntityClass(entity));
            }
        }
    }
    private editDefault(entity: EntityType): void {
        const dialogData: EditEntityDialogData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.entitiesData.baseData.EntityServiceClass,
            allowDelete: this.entitiesData.baseData.allowDelete as (entity: EntityType) => boolean,
            editDialogData: this.entitiesData.editDialogData as EditDialogData<EntityType>
        };
        this.dialog.open(EditEntityDialogComponent, {
            data: dialogData,
            minWidth: '60%',
            autoFocus: false,
            restoreFocus: false
        });
    }

    createEntity(): void {
        if (this.entitiesData.baseData.allowCreate) {
            if (this.entitiesData.baseData.create) {
                this.entitiesData.baseData.create(new this.entitiesData.baseData.EntityClass());
            }
            else {
                this.createDefault(new this.entitiesData.baseData.EntityClass());
            }
        }
    }
    private createDefault(entity: EntityType): void {
        const dialogData: CreateEntityDialogData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.entitiesData.baseData.EntityServiceClass,
            createDialogData: this.entitiesData.createDialogData as CreateDialogData
        };
        this.dialog.open(CreateEntityDialogComponent, {
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
        const dialogData: ConfirmDialogData = {
            // eslint-disable-next-line max-len
            text: action.confirmDialogData?.text ? action.confirmDialogData?.text : [`Do you really want to run this action on ${this.selection.selected.length} entries?`],
            type: 'default',
            confirmButtonLabel: action.confirmDialogData?.confirmButtonLabel ? action.confirmDialogData?.confirmButtonLabel : 'Confirm',
            cancelButtonLabel: action.confirmDialogData?.cancelButtonLabel ? action.confirmDialogData?.cancelButtonLabel : 'Cancel',
            title: action.confirmDialogData?.title ? action.confirmDialogData?.title : action.displayName,
            requireConfirmation: action.confirmDialogData?.requireConfirmation ? action.confirmDialogData?.requireConfirmation : false,
            confirmationText: action.confirmDialogData?.confirmationText ? action.confirmDialogData?.confirmationText : undefined
        };
        const dialogref = this.dialog.open(ConfirmDialogComponent, {
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