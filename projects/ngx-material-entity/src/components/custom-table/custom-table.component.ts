import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, EventEmitter, Inject, Input, OnInit, Output, ViewChild, runInInjectionContext } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CustomTableConfiguration, InternalCustomTableConfiguration } from './custom-table-configuration.model';
import { BaseEntityType } from '../../classes/entity.model';
import { DynamicStyleClassDirective } from '../../directives/dynamic-style-class.directive';
import { tableColumnValueToSortValue } from '../../functions/table-column-value-to-sort-value.function';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../global-configuration-values';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { DisplayColumnValueComponent } from '../table/display-column-value/display-column-value.component';
import { DisplayColumn, TableColumnValue } from '../table/table-data';

/**
 * The event for clicking on a table cell.
 */
export type CellClickedEvent<T> = {
    /**
     * The column that was clicked.
     */
    displayColumn: DisplayColumn<T>,
    /**
     * The value of the row that was clicked.
     */
    value: T
};

/**
 * A custom table that has things like sorting and pagination already built in.
 */
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        DisplayColumnValueComponent,
        DynamicStyleClassDirective
    ]
})
export class CustomTableComponent<T, EntityType extends BaseEntityType<EntityType>> implements OnInit {

    // eslint-disable-next-line jsdoc/require-jsdoc
    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    /**
     * Updates the table entries.
     */
    @Input({ required: true })
    set data(value: T[]) {
        this.selection.clear();
        this.selectionChanged.emit(this.selection.selected);
        this.dataSource.data = value;
    }

    /**
     * Applies the given string as a filter to the table.
     */
    @Input()
    set searchString(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    @Input()
    set required(value: boolean) {
        this.shouldShowMissingError = value;
    }
    /**
     * Whether or not the table should show an error message when the table is empty.
     */
    shouldShowMissingError: boolean = false;

    /**
     * Whether or not the table data is currently loading.
     */
    @Input()
    isLoading: boolean = false;

    /**
     * The configuration of the table.
     */
    @Input({ required: true })
    configuration!: CustomTableConfiguration<T>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalConfiguration!: InternalCustomTableConfiguration<T>;

    /**
     * Emits when a cell is clicked that is neither disabled nor disallowed to be clicked.
     */
    @Output()
    readonly cellClicked: EventEmitter<CellClickedEvent<T>> = new EventEmitter<CellClickedEvent<T>>();

    /**
     * Emits when the selected values change.
     */
    @Output()
    readonly selectionChanged: EventEmitter<T[]> = new EventEmitter<T[]>();

    /**
     * The paginator from the html.
     */
    @ViewChild(MatPaginator, { static: true })
    private readonly paginator!: MatPaginator;
    /**
     * The sort from the html.
     */
    @ViewChild(MatSort, { static: true })
    private readonly sort!: MatSort;

    /**
     * The data source for the table.
     */
    dataSource: MatTableDataSource<T> = new MatTableDataSource();

    /**
     * The selection of the table.
     */
    selection: SelectionModel<T> = new SelectionModel<T>(true, []);

    /**
     * The columns of the table.
     */
    displayedColumns!: string[];

    constructor(
        private readonly injector: EnvironmentInjector,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) { }

    ngOnInit(): void {
        this.internalConfiguration = new InternalCustomTableConfiguration(this.globalConfig, this.configuration);
        const givenDisplayColumns: string[] = this.internalConfiguration.displayColumns.map((v) => v.displayName);
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.displayedColumns = this.internalConfiguration.withSelection ? ['select'].concat(givenDisplayColumns) : givenDisplayColumns;
        this.setupDataSource();
    }

    private setupDataSource(): void {
        this.dataSource.sortingDataAccessor = (value: T, header: string) => {
            return runInInjectionContext(this.injector, () => {
                // eslint-disable-next-line stylistic/max-len
                const displayColumn: DisplayColumn<T> = this.internalConfiguration.displayColumns.find(dp => dp.displayName === header) as DisplayColumn<T>;
                if (this.internalConfiguration.resolveToReferencedEntity) {
                    const resolvedEntity: T = this.internalConfiguration.resolveToReferencedEntity(value) as T;
                    return tableColumnValueToSortValue(displayColumn.value(resolvedEntity));
                }
                return tableColumnValueToSortValue(displayColumn.value(value));
            });
        };
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (value: T, filter: string) => {
            const searchStr: string = this.internalConfiguration.searchStringForRow(value);
            const formattedSearchString: string = searchStr.toLowerCase();
            const formattedFilterString: string = filter.toLowerCase();
            return formattedSearchString.includes(formattedFilterString);
        };
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Emits a cellClicked event when the clicked column is enabled and clicking is allowed by the configuration.
     * @param value - The value of the row that was clicked.
     * @param dCol - The display column of the row that was clicked.
     */
    clickCell(value: T, dCol: DisplayColumn<T>): void {
        if (dCol.disableClick == true || !this.internalConfiguration.allowClick(value)) {
            return;
        }
        this.cellClicked.emit({ displayColumn: dCol, value: value });
    }

    /**
     * Toggles a single table row.
     * @param value - The value of the row that was clicked.
     * @param event - The change event from the checkbox.
     */
    toggle(value: T, event?: MatCheckboxChange): void {
        if (!event) {
            return;
        }
        this.selection.toggle(value);
        this.selectionChanged.emit(this.selection.selected);
    }

    /**
     * Toggles all table rows.
     * @param event - The change event from the checkbox.
     */
    masterToggle(event?: MatCheckboxChange): void {
        if (!event) {
            return;
        }
        SelectionUtilities.masterToggle(this.selection, this.dataSource);
        this.selectionChanged.emit(this.selection.selected);
    }

    /**
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     * @param value - The column value to get the display string from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(value: T, displayColumn: DisplayColumn<T>): TableColumnValue {
        return runInInjectionContext(this.injector, () => {
            if (this.internalConfiguration.resolveToReferencedEntity) {
                return displayColumn.value(this.internalConfiguration.resolveToReferencedEntity(value) as T);
            }
            return displayColumn.value(value);
        });
    }
}