/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { NgModel } from '@angular/forms';
import { DateUtilities } from '../../../../classes/date.utilities';
import { MatDialog } from '@angular/material/dialog';
import { ArrayTable } from '../array-table.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-input',
    templateUrl: './array-date-input.component.html',
    styleUrls: ['./array-date-input.component.scss']
})
export class ArrayDateInputComponent<EntityType extends object> extends ArrayTable<Date, EntityType> implements OnInit {

    DateUtilities = DateUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DateArrayDecoratorConfigInternal;

    constructor(private readonly dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.init();
    }

    protected emitChange(): void {
        this.inputChangeEvent.emit();
    }
}