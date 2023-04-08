import { defaultFalse, defaultTrue } from '../../classes/base.builder';
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
            if (data.order < 1) {
                throw new Error('order must be at least 1');
            }
            if (data.order > 12) {
                throw new Error('order cannot be bigger than 12 (the minimum value for a bootstrap column)');
            }
        }
        if (data?.row != null && data.row < 1) {
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
    // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any
    isReadOnly: (entity: any) => boolean;

    constructor(data: PropertyDecoratorConfig) {
        this.display = data.display ?? true;
        this.displayName = data.displayName;
        this.required = data.required ?? true;
        this.omitForCreate = data.omitForCreate ?? false;
        this.omitForUpdate = data.omitForUpdate ?? false;
        this.defaultWidths = data.defaultWidths ?? [6, 6, 12];
        this.position = new PositionInternal(data.position);
        this.isReadOnly = this.isReadOnlyToFunction(data.isReadOnly);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private isReadOnlyToFunction(value?: boolean | ((entity: any) => boolean)): (entity: any) => boolean {
        if (value == null) {
            return defaultFalse;
        }
        if (typeof value == 'boolean') {
            if (value) {
                return defaultTrue;
            }
            return defaultFalse;
        }
        return value;
    }
}