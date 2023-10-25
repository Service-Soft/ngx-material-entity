/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DateRangeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../../default-global-configuration-values';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { ArrayTableComponent } from '../array-table.class';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'array-date-range-input',
    templateUrl: './array-date-range-input.component.html',
    styleUrls: ['./array-date-range-input.component.scss']
})
export class ArrayDateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<DateRange, EntityType, DecoratorTypes.ARRAY_DATE_RANGE> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;

    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    constructor(
        matDialog: MatDialog,
        injector: EnvironmentInjector,
        http: HttpClient,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super(matDialog, injector, http);
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
    }

    /**
     * Adds a DateRange to the array.
     */
    addDateRange(): void {
        if (this.input && this.dateRangeStart && this.dateRangeEnd) {
            this.input.start = new Date(this.dateRangeStart);
            this.input.end = new Date(this.dateRangeEnd);
            const values: Date[] = DateUtilities.getDatesBetween(
                this.input.start,
                this.input.end,
                this.metadata.filter
            );
            this.input.values = values.length ? values : undefined as unknown as Date[];
            this.add();
        }
    }

    protected override resetInput(): void {
        this.input = undefined;
        this.dateRangeStart = undefined;
        this.dateRangeEnd = undefined;
    }
}