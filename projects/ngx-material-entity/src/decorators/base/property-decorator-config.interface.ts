export type cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * The base options for all propertyDecorators.
 */
export abstract class PropertyDecoratorConfig {
    /**
     * Whether or not the Property is displayed at all.
     *
     * @default true
     */
    display?: boolean;
    /**
     * The name of the property used as a label for form fields.
     */
    displayName: string;
    /**
     * Whether or not the Property is required.
     *
     * @default true
     */
    required?: boolean;
    /**
     * Whether or not the property gets omitted when creating new Entities.
     *
     * @default false
     */
    omitForCreate?: boolean;
    /**
     * Whether or not the property gets omitted when updating Entities.
     *
     * @default false
     */
    omitForUpdate?: boolean;
    /**
     * Defines the width of the input property when used inside the default create or edit dialog.
     * Has 3 bootstrap values for different breakpoints for simple responsive design.
     * The first value sets the columns for the screensize lg, the second for md and the third for sm.
     *
     * @default [6, 6, 12]
     */
    defaultWidths?: [cols, cols, cols];
    /**
     * Specifies order of the input property when used inside the default create or edit dialog.
     * Ordering is ascending.
     *
     * @default -1 (sets this property at the end)
     */
    order?: number;

    constructor(
        displayName: string,
        display: boolean = true,
        required: boolean = true,
        omitForCreate: boolean = false,
        omitForUpdate: boolean = false,
        defaultWidths: [cols, cols, cols] = [6, 6, 12],
        order?: number
    ) {
        this.displayName = displayName;
        this.display = display;
        this.required = required;
        this.omitForCreate = omitForCreate;
        this.omitForUpdate = omitForUpdate;
        this.defaultWidths = defaultWidths;

        if (order) {
            if (order < 0) {
                throw new Error('order must be at least 0');
            }
            this.order = order;
        }
        else {
            this.order = -1;
        }
    }
}