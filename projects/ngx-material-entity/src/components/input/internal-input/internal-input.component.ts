import { Component, Input, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfig } from '../../../decorators/base/property-decorator-config.interface';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from '../../../decorators/number.decorator';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, TextboxStringDecoratorConfig } from '../../../decorators/string.decorator';
import { DropdownBooleanDecoratorConfig } from '../../../decorators/boolean.decorator';
import { Entity } from '../../../classes/entity-model.class';
import { DefaultObjectDecoratorConfig } from '../../../decorators/object.decorator';
import { EntityUtilities } from '../../../classes/entity-utilities.class';
import { NgModel } from '@angular/forms';

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

    metadata!: PropertyDecoratorConfig;

    metadataDefaultString!: DefaultStringDecoratorConfig;
    metadataTextboxString!: TextboxStringDecoratorConfig;
    metadataAutocompleteString!: AutocompleteStringDecoratorConfig;
    metadataDropdownString!: DropdownStringDecoratorConfig;

    metadataDropdownBoolean!: DropdownBooleanDecoratorConfig;

    metadataDefaultNumber!: DefaultNumberDecoratorConfig;
    metadataDropdownNumber!: DropdownNumberDecoratorConfig;

    metadataDefaultObject!: DefaultObjectDecoratorConfig;
    objectProperty!: Entity;

    readonly DecoratorTypes = DecoratorTypes;

    getWidth = EntityUtilities.getWidth;

    /**
     * Helper method needed to recursively generate property input components (used eg. with the object)
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

        this.metadataDefaultString = this.metadata as DefaultStringDecoratorConfig;
        this.metadataTextboxString = this.metadata as TextboxStringDecoratorConfig;
        this.metadataAutocompleteString = this.metadata as AutocompleteStringDecoratorConfig;
        this.metadataDropdownString = this.metadata as DropdownStringDecoratorConfig;

        this.metadataDropdownBoolean = this.metadata as DropdownBooleanDecoratorConfig;

        this.metadataDefaultNumber = this.metadata as DefaultNumberDecoratorConfig;
        this.metadataDropdownNumber = this.metadata as DropdownNumberDecoratorConfig;

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfig;
        this.objectProperty = this.entity[this.propertyKey] as unknown as Entity;
    }

    getObjectProperties(): (keyof Entity)[] {
        const res: (keyof Entity)[] = [];
        for (const property in this.objectProperty) {
            const metadata = EntityUtilities.getPropertyMetadata(
                this.objectProperty,
                 property as keyof Entity,
                 EntityUtilities.getPropertyType(this.objectProperty, property as keyof Entity)
            );
            if (
                !(this.hideOmitForCreate && metadata.omitForCreate)
                 && !(this.hideOmitForEdit && metadata.omitForUpdate)
            ) {
                res.push(property as keyof Entity);
            }
        }
        return res.sort((a, b) => EntityUtilities.compareOrder(a, b, this.objectProperty));
    }
}