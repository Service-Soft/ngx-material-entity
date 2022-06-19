import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';
import { baseProperty } from './base/base-property.decorator';
import { DecoratorTypes } from './base/decorator-types.enum';

/**
 * Decorator for setting and getting string propery metadata
 * @param metadata The metadata of the string property
 */
export function boolean(metadata: CheckboxBooleanDecoratorConfig | ToggleBooleanDecoratorConfig | DropdownBooleanDecoratorConfig) {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(new DropdownBooleanDecoratorConfig(metadata), DecoratorTypes.BOOLEAN_DROPDOWN);
    }
    else if (metadata.displayStyle === 'checkbox') {
        return baseProperty(new CheckboxBooleanDecoratorConfig(metadata), DecoratorTypes.BOOLEAN_CHECKBOX);
    }
    else {
        return baseProperty(new ToggleBooleanDecoratorConfig(metadata), DecoratorTypes.BOOLEAN_TOGGLE);
    }
}

/**
 * Interface definition for the @boolean metadata
 */
abstract class BooleanDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the booleans as a checkbox, a toggle button or as a dropdown
     */
    displayStyle!: 'checkbox' | 'dropdown' | 'toggle';
}

export class DropdownBooleanDecoratorConfig extends BooleanDecoratorConfig {
    override displayStyle: 'dropdown';
    /**
     * The name of the true value if displayStyle dropdown is used.
     * Can also receive a function to determine the name.
     */
    dropdownTrue: string | { (args: unknown): string };
    /**
     * The name of the false value if displayStyle dropdown is used.
     * Can also receive a function to determine the name,
     */
    dropdownFalse: string | { (args: unknown): string };

    constructor(metadata: DropdownBooleanDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate);
        this.displayStyle = metadata.displayStyle;
        this.dropdownTrue = metadata.dropdownTrue;
        this.dropdownFalse = metadata.dropdownFalse;
    }
}

export class CheckboxBooleanDecoratorConfig extends BooleanDecoratorConfig {
    override displayStyle: 'checkbox';

    constructor(metadata: CheckboxBooleanDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate);
        this.displayStyle = metadata.displayStyle;
    }
}
export class ToggleBooleanDecoratorConfig extends BooleanDecoratorConfig {
    override displayStyle: 'toggle';

    constructor(metadata: ToggleBooleanDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate);
        this.displayStyle = metadata.displayStyle;
    }
}