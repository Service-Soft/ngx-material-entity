import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../classes/entity.model';
import { DecoratorType, DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { UUIDUtilities } from '../../encapsulation/uuid.utilities';
import { EntityUtilities } from '../../utilities/entity.utilities';

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
 * - propertyValue: Just the typed version of the property, its the same as entity[key].
 * - metadata: The metadata of the property. (type-safe due to the Generic "CustomMetadataType")
 * - ngOnInit: Gets the metadata for the property, be aware of this when overriding this method.
 * - emitChange: Should be called when the input has changed. This is needed to trigger validation and dirty checks.
 */
// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'ngx-mat-entity-base-input',
    template: ''
})
export abstract class NgxMatEntityBaseInputComponent<
    EntityType extends BaseEntityType<EntityType>,
    Type extends DecoratorTypes,
    ValueType,
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

    /**
     * Emits when the property value has changed.
     */
    @Output()
    inputChangeEvent: EventEmitter<void> = new EventEmitter<void>();

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * The property value of entity[key] correctly typed.
     * Uses getters and setters so that inputs are always linked to the original value.
     */
    get propertyValue(): ValueType | undefined {
        return this.entity[this.key] as ValueType | undefined;
    }

    set propertyValue(value: ValueType | undefined) {
        (this.entity[this.key] as ValueType | undefined) = value;
        this.metadata.change?.(this.entity);
    }

    /**
     * The metadata of the property.
     */
    metadata!: DecoratorType<Type, CustomMetadataType>;

    /**
     * A unique name for inputs. Includes a uuid.
     */
    name!: string;

    ngOnInit(): void {

        const foundMetadata: DecoratorType<Type, CustomMetadataType> | undefined = EntityUtilities.getPropertyMetadata(this.entity, this.key);
        if (!foundMetadata) {
            throw new Error(`No metadata was found for the key "${String(this.key)}"`);
        }
        this.metadata = foundMetadata;
        this.name = this.key.toString() + UUIDUtilities.create();
    }

    /**
     * Should emit when the input has changed. This is needed to trigger validation and dirty checks.
     */
    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}