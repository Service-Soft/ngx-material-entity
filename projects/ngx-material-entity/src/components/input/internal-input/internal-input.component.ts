import { Component, Input, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { Entity } from '../../../classes/entity-model.class';
import { EntityRow, EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgModel } from '@angular/forms';
import { DropdownBooleanDecoratorConfigInternal } from '../../../decorators/boolean/boolean-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal } from '../../../decorators/number/number-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../../decorators/object/object-decorator-internal.data';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../../../decorators/string/string-decorator-internal.data';
import { PropertyDecoratorConfigInternal } from '../../../decorators/base/property-decorator-internal.data';

@Component({
    selector: 'ngx-mat-entity-internal-input',
    templateUrl: './internal-input.component.html',
    styleUrls: ['./internal-input.component.scss']
})
export class NgxMatEntityInternalInputComponent<EntityType extends Entity> implements OnInit {
    /**
     * The entity on which the property exists. Used in conjuction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input()
    entity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjuction with the "entity".
     */
    @Input()
    propertyKey!: keyof EntityType;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForEdit?: boolean;

    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    type!: DecoratorTypes;

    metadata!: PropertyDecoratorConfigInternal;

    metadataDefaultString!: DefaultStringDecoratorConfigInternal;
    metadataTextboxString!: TextboxStringDecoratorConfigInternal;
    metadataAutocompleteString!: AutocompleteStringDecoratorConfigInternal;
    metadataDropdownString!: DropdownStringDecoratorConfigInternal;

    metadataDropdownBoolean!: DropdownBooleanDecoratorConfigInternal;

    metadataDefaultNumber!: DefaultNumberDecoratorConfigInternal;
    metadataDropdownNumber!: DropdownNumberDecoratorConfigInternal;

    metadataDefaultObject!: DefaultObjectDecoratorConfigInternal<EntityType>;
    objectProperty!: Entity;
    objectPropertyRows!: EntityRow<Entity>[];

    readonly DecoratorTypes = DecoratorTypes;

    getWidth = EntityUtilities.getWidth;

    /**
     * This is needed for the inputs to work inside an ngfor.
     *
     * @param index - The index of the element in the ngfor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    ngOnInit(): void {
        if (!this.entity) {
            throw new Error('Missing required Input data "entity"');
        }
        if (!this.propertyKey) {
            throw new Error('Missing required Input data "propertyKey"');
        }
        this.type = EntityUtilities.getPropertyType(this.entity, this.propertyKey);
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.propertyKey, this.type);

        this.metadataDefaultString = this.metadata as DefaultStringDecoratorConfigInternal;
        this.metadataTextboxString = this.metadata as TextboxStringDecoratorConfigInternal;
        this.metadataAutocompleteString = this.metadata as AutocompleteStringDecoratorConfigInternal;
        this.metadataDropdownString = this.metadata as DropdownStringDecoratorConfigInternal;

        this.metadataDropdownBoolean = this.metadata as DropdownBooleanDecoratorConfigInternal;

        this.metadataDefaultNumber = this.metadata as DefaultNumberDecoratorConfigInternal;
        this.metadataDropdownNumber = this.metadata as DropdownNumberDecoratorConfigInternal;

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.entity[this.propertyKey] as unknown as Entity;
        if (this.metadataDefaultObject.type) {
            this.objectPropertyRows = EntityUtilities.getEntityRows(this.objectProperty, this.hideOmitForCreate, this.hideOmitForEdit);
        }
    }
}