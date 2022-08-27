import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../classes/entity.model';
import { DecoratorType, DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../classes/entity.utilities';

/**
 * The abstract base class of any ngx-mat-entity input.
 * Extend from this when implementing your own custom decorator.
 *
 * It already provides:
 *
 * - entity: The entity which the property is on. (type-safe due to the Generic "EntityType")
 * - key: The key of the property. (type-safe due to the Generic "EntityType")
 * - getValidationErrorMessage: The function that generates the error message when the input is invalid.
 * - isReadOnly: Whether or not the input is read only. Can be used to disable elements.
 * - metadata: The metadata of the property. (type-safe due to the Generic "CustomMetadataType")
 * - ngOnInit: Gets the metadata for the property, be aware of this when overriding this method.
 * - emitChange: Should be called when the input has changed. This is needed to trigger validation and dirty checks.
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

    /**
     * Whether or not the input should be readonly.
     * In that case it is disabled, but most of the disabled-styling is overridden.
     */
    @Input()
    isReadOnly!: boolean;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    /**
     * The metadata of the property.
     */
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