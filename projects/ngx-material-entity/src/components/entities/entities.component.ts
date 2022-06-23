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
import { HttpClient } from '@angular/common/http';
import { CreateEntityDialogData } from './create-entity-dialog/create-entity-dialog-data';
import { EditEntityDialogComponent } from './edit-entity-dialog/edit-entity-dialog.component';
import { EditEntityDialogData } from './edit-entity-dialog/edit-entity-dialog-data';

/**
 * The Definition of a Column inside the table.
 */
export interface DisplayColumn<EntityType extends Entity> {
    /**
     * The name inside the header.
     */
    displayName: string,
    /**
     * A method to get the value inside an entry
     */
    value: (entity: EntityType) => string
}

/**
 * The Definition of an Action that can be run on multiple selected entities
 */
export interface MultiSelectAction<EntityType extends Entity> {
    /**
     * The name of the action
     */
    displayName: string,
    /**
     * The action itself
     */
    action: (entity: EntityType[]) => unknown,
    /**
     * A method that defines whether or not the action can be used.
     * Defaults to true.
     */
    enabled?: (entity: EntityType[]) => boolean
}

@Component({
    selector: 'ngx-material-entities',
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent<EntityType extends Entity> implements OnInit, OnDestroy {
    /**
     * The title of the table
     */
    @Input()
    title!: string;
    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column
     */
    @Input()
    displayColumns!: DisplayColumn<EntityType>[];
    /**
     * The label on the search bar. Defaults to "Search".
     */
    @Input()
    searchLabel?: string;
    /**
     * The label on the button for adding new entities. Defaults to "Create".
     */
    @Input()
    createButtonLabel?: string;
    /**
     * The Class of the entities to manage
     */
    @Input()
    EntityClass!: new (entity?: EntityType) => EntityType;
    /**
     * The Class of the service that handles the entities.
     * Needs to be injectable and an extension of the "EntityService"-Class
     */
    @Input()
    EntityServiceClass!: new (httpClient: HttpClient) => EntityService<EntityType>;
    /**
     * Takes a custom edit method which runs when you click on a entity.
     * If you don't need any special editing of entries you can also omit this.
     * In that case a default edit dialog is generated.
     */
    @Input()
    edit?: (entity: EntityType) => unknown;
    /**
     * Takes a method to run when you click on the new button.
     * If you don't need anything special you can also omit this.
     * In that case a default create dialog is generated.
     */
    @Input()
    create?: (entity: EntityType) => unknown;
    /**
     * Defines how the search string of entities is generated.
     */
    @Input()
    searchString?: (enity: EntityType) => string;
    /**
     * Defines whether or not the user can add new entities.
     */
    @Input()
    allowCreate!: boolean;
    /**
     * Defines whether or not the user can edit entities.
     */
    @Input()
    allowEdit!: boolean;
    /**
     * Defines whether or not the user can delete entities.
     */
    @Input()
    allowDelete!: boolean;
    /**
     * All Actions that you want to run on multiple entities can be defined here.
     * (e.g. download as zip-file or mass delete)
     */
    @Input()
    multiSelectActions?: MultiSelectAction<EntityType>[];
    /**
     * The Label for the button that opens all multi-actions.
     */
    @Input()
    multiSelectLabel?: string;



    /**
     * The title of the default create-dialog.
     */
    @Input()
    createDialogTitle?: string;
    /**
     * The label on the create-button of the default create-dialog. Defaults to "Create".
     */
    @Input()
    createDialogCreateButtonLabel?: string;
    /**
     * The label on the cancel-button for the default create-dialog. Defaults to "Cancel".
     */
    @Input()
    createDialogCancelButtonLabel?: string;



    /**
     * The title of the default edit-dialog.
     */
    @Input()
    editDialogTitle?: string;
    /**
     * The label on the confirm-button of the default edit-dialog. Defaults to "Save".
     */
    @Input()
    editDialogCreateButtonLabel?: string;
    /**
     * The label on the cancel-button for the default edit-dialog. Defaults to "Cancel".
     */
    @Input()
    editDialogCancelButtonLabel?: string;



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

        this.entityService = this.injector.get(this.EntityServiceClass) as EntityService<EntityType>;

        const givenDisplayColumns = this.displayColumns.map((v) => v.displayName);
        if (this.multiSelectActions?.length) {
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
            return this.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
        };
        this.dataSource.sort = this.sort;
        if (this.searchString) {
            this.dataSource.filterPredicate = (entity: EntityType, filter: string) => {
                const searchStr = this.searchString?.(entity) as string;
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
        if (!this.displayColumns) {
            throw new Error('Missing required Input data "displayColumns"');
        }
        if (!this.title) {
            throw new Error('Missing required Input data "title"');
        }
        if (!this.EntityServiceClass) {
            throw new Error('Missing required Input data "EntityServiceClass"');
        }
        if (this.allowCreate && !this.allowCreate) {
            this.allowCreate = true;
        }
        if (!this.allowEdit && !this.allowEdit) {
            this.allowEdit = true;
        }
        if (!this.allowDelete && !this.allowDelete) {
            this.allowDelete = true;
        }
        if ((this.allowEdit || this.allowCreate) && !this.EntityClass) {
            throw new Error(`
                Missing required Input data "EntityClass".
                You can only omit this value if you can neither create or update entities.`
            );
        }
        if (this.allowCreate && !this.create && !this.createDialogTitle) {
            throw new Error(
                `Missing required Input data "createDialogTitle".
                You can only omit this value when creation is disallowed or done with a custom create method.`
            );
        }
    }

    editEntity(entity: EntityType): void {
        if (this.allowEdit) {
            if (this.edit) {
                this.edit(new this.EntityClass(entity));
            }
            else {
                this.editDefault(new this.EntityClass(entity));
            }
        }
    }
    private editDefault(entity: EntityType): void {
        const dialogData: EditEntityDialogData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.EntityServiceClass,
            title: 'Editieren',
            editButtonLabel: 'Speichern',
            cancelButtonLabel: 'Abbrechen',
            allowDelete: this.allowDelete,
            deleteButtonLabel: 'Löschen'
        };
        this.dialog.open(EditEntityDialogComponent, {
            data: dialogData,
            minWidth: '60%'
        });
    }

    createEntity(): void {
        if (this.allowCreate) {
            if (this.create) {
                this.create(new this.EntityClass());
            }
            else {
                this.createDefault(new this.EntityClass());
            }
        }
    }
    private createDefault(entity: EntityType): void {
        const dialogData: CreateEntityDialogData<EntityType> = {
            entity: entity,
            EntityServiceClass: this.EntityServiceClass,
            title: this.createDialogTitle as string,
            createButtonLabel: this.createDialogCreateButtonLabel,
            cancelButtonLabel: this.createDialogCancelButtonLabel
        };
        this.dialog.open(CreateEntityDialogComponent, {
            data: dialogData,
            minWidth: '60%'
        });
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