import { defaultFalse } from '../../functions/default-false.function';
import { defaultTrue } from '../../functions/default-true.function';
import { Col, Position, PropertyDecoratorConfig } from './property-decorator.data';

/**
 * The internal Position. Sets default values and validates user input.
 */
class PositionInternal implements Position {
    // eslint-disable-next-line jsdoc/require-jsdoc
    row: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    order: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    tab: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    tabName?: string;

    constructor(data?: Position) {
        this.validateInput(data);
        this.row = data?.row ?? -1;
        this.order = data?.order ?? -1;
        this.tab = data?.tab ?? -1;
        this.tabName = data?.tabName;
    }

    private validateInput(data?: Position): void {
        if (data?.order != null) {
            if (data.order < 1 && data.order != -1) {
                throw new Error('order must be at least 1');
            }
            if (data.order > 12) {
                throw new Error('order cannot be bigger than 12 (the maximum value for a bootstrap column)');
            }
        }
        if (data?.row != null && data.row != -1 && data.row < 1) {
            throw new Error('row must be at least 1');
        }
        if (data?.tab != null && data.tab != -1 && data.tab < 2) {
            throw new Error('tab must be either -1 for the first tab or at least 2');
        }
    }
}

/**
 * The internal PropertyDecoratorConfig. Sets default values.
 */
export abstract class PropertyDecoratorConfigInternal<ValueType> implements PropertyDecoratorConfig<ValueType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    display: (entity: unknown) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    required: ((entity: unknown) => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    omitForCreate: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omitForUpdate: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    defaultWidths: [Col, Col, Col];
    // eslint-disable-next-line jsdoc/require-jsdoc
    position: PositionInternal;
    // eslint-disable-next-line jsdoc/require-jsdoc
    isReadOnly: (entity: unknown) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    default?: () => ValueType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    change?: (entity: unknown) => void;

    constructor(data: PropertyDecoratorConfig<ValueType>) {
        this.display = this.booleanToFunction(data.display ?? true);
        this.displayName = data.displayName;
        this.required = this.booleanToFunction(data.required ?? true);
        this.omitForCreate = data.omitForCreate ?? false;
        this.omitForUpdate = data.omitForUpdate ?? false;
        this.defaultWidths = data.defaultWidths ?? [6, 6, 12];
        this.position = new PositionInternal(data.position);
        this.isReadOnly = this.booleanToFunction(data.isReadOnly ?? false);
        this.default = this.defaultToFunction(data.default);
        this.change = data.change;
    }

    /**
     * Converts the default value to a function or undefined.
     *
     * @param value - The default value provided by the metadata.
     * @returns A function that returns a default value or undefined.
     */
    protected defaultToFunction(value?: ValueType | (() => ValueType)): (() => ValueType) | undefined {
        if (value == null) {
            return undefined;
        }
        if (typeof value == 'function') {
            return value as (() => ValueType);
        }
        return (() => value);
    }

    /**
     * Converts the given boolean or boolean function to a boolean function.
     *
     * @param value - The value to convert.
     * @returns A function that resolves to a boolean.
     */
    protected booleanToFunction(value: boolean | ((entity: unknown) => boolean)): (entity: unknown) => boolean {
        if (typeof value !== 'boolean') {
            return value;
        }
        return value ? defaultTrue : defaultFalse;
    }
}