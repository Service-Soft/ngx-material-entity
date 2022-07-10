import { cols, PropertyDecoratorConfig } from './property-decorator.data';

export abstract class PropertyDecoratorConfigInternal implements PropertyDecoratorConfig {
    display: boolean;
    displayName: string;
    required: boolean;
    omitForCreate: boolean;
    omitForUpdate: boolean;
    defaultWidths: [cols, cols, cols];
    order: number;

    constructor(data: PropertyDecoratorConfig) {
        if (data.order && (data.order < 0)) {
            throw new Error('order must be at least 0');
        }
        this.display = data.display != undefined ? data.display : true;
        this.displayName = data.displayName;
        this.required = data.required != undefined ? data.required : true;
        this.omitForCreate = data.omitForCreate != undefined ? data.omitForCreate : false;
        this.omitForUpdate = data.omitForUpdate != undefined ? data.omitForUpdate : false;
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [6, 6, 12];
        this.order = data.order ? data.order : -1;
    }
}