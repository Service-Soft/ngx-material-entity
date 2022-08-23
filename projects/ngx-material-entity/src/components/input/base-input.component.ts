import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../classes/entity.model';
import { DecoratorType, DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../classes/entity.utilities';

/**
 * The abstract base class of any ngx-mat-entity input.
 */
@Component({
    selector: 'ngx-mat-entity-base-input',
    template: ''
})
// eslint-disable-next-line max-len
export abstract class NgxMatEntityBaseInputComponent<
    EntityType extends BaseEntityType<EntityType>,
    Type extends DecoratorTypes,
    CustomMetadataType extends BaseEntityType<CustomMetadataType> = {}
> implements OnInit {
    /**
     * The entity that the property to display as an input comes from.
     */
    @Input()
    entity!: EntityType;

    /**
     * The key of the property to build the input for.
     */
    @Input()
    key!: keyof EntityType;

    /**
     * The function that generates the error message when the input is invalid.
     */
    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DecoratorType<Type, CustomMetadataType>;

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key);
    }

    /**
     * Should emit when the input has changed. This is needed to trigger validation and dirty checks.
     */
    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}