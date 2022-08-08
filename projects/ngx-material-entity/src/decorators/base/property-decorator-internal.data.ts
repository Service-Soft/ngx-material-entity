import { Col, Position, PropertyDecoratorConfig } from './property-decorator.data';

/**
 * The internal Position. Sets default values and validates user input.
 */
class PositionInternal implements Position {
    // eslint-disable-next-line jsdoc/require-jsdoc
    row: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    order: number;

    constructor(data?: Position) {
        this.validateInput(data);
        this.row = data?.row ?? -1;
        this.order = data?.order ?? -1;
    }

    private validateInput(data?: Position): void {
        if (data?.order) {
            if (data.order < 1) {
                throw new Error('order must be at least 1');
            }
            if (data.order > 12) {
                throw new Error('order cannot be bigger than 12 (the minimum value for a bootstrap column)');
            }
        }
        if (data?.row && (data.row < 1)) {
            throw new Error('row must be at least 1');
        }
    }
}

/**
 * The internal PropertyDecoratorConfig. Sets default values.
 */
export abstract class PropertyDecoratorConfigInternal implements PropertyDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    display: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    required: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omitForCreate: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omitForUpdate: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    defaultWidths: [Col, Col, Col];
    // eslint-disable-next-line jsdoc/require-jsdoc
    position: PositionInternal;

    constructor(data: PropertyDecoratorConfig) {
        this.display = data.display != undefined ? data.display : true;
        this.displayName = data.displayName;
        this.required = data.required != undefined ? data.required : true;
        this.omitForCreate = data.omitForCreate != undefined ? data.omitForCreate : false;
        this.omitForUpdate = data.omitForUpdate != undefined ? data.omitForUpdate : false;
        this.defaultWidths = data.defaultWidths ?? [6, 6, 12];
        this.position = new PositionInternal(data.position);
    }
}