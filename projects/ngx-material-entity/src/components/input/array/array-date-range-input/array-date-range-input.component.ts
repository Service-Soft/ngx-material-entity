/* eslint-disable jsdoc/require-jsdoc */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DateRangeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { ArrayTableComponent } from '../array-table.class';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'array-date-range-input',
    templateUrl: './array-date-range-input.component.html',
    styleUrls: ['./array-date-range-input.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        MatButtonModule,
        CustomTableComponent
    ]
})
export class ArrayDateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<DateRange, EntityType, DecoratorTypes.ARRAY_DATE_RANGE> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;

    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    constructor(
        dialog: MatDialog,
        http: HttpClient,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super(dialog, http);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DateRangeArrayDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);
        this.input = {
            start: undefined as unknown as Date,
            end: undefined as unknown as Date,
            values: undefined as unknown as Date[]
        };
        this.setTableConfig();
    }

    /**
     * Adds a DateRange to the array.
     */
    override async add(): Promise<void> {
        if (!this.input || !this.dateRangeStart || !this.dateRangeEnd) {
            return;
        }
        this.input.start = new Date(this.dateRangeStart);
        this.input.end = new Date(this.dateRangeEnd);
        const values: Date[] = DateUtilities.getDatesBetween(
            this.input.start,
            this.input.end,
            this.metadata.filter
        );
        this.input.values = values.length ? values : undefined as unknown as Date[];
        await super.add();
    }

    protected override resetInput(): void {
        this.input = {
            start: undefined as unknown as Date,
            end: undefined as unknown as Date,
            values: undefined as unknown as Date[]
        };
        this.dateRangeStart = undefined;
        this.dateRangeEnd = undefined;
    }
}