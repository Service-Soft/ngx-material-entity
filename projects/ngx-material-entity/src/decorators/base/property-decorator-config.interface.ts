type cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * The base options for all propertyDecorators
 */
export abstract class PropertyDecoratorConfig {
    /**
     * Whether or not the Property is displayed at all.
     * @default true
     */
    display?: boolean;
    /**
     * The name of the property used as a label for form fields.
     */
    displayName: string;
    /**
     * Whether or not the Property is required.
     * @default true
     */
    required?: boolean;
    /**
     * Whether or not the property gets omitted when creating new Entities.
     * @default false
     */
    omitForCreate?: boolean;
    /**
     * Whether or not the property gets omitted when updating Entities.
     * @default false
     */
    omitForUpdate?: boolean;
    /**
     * Defines the width of the input property when used inside the default create or edit dialog.
     * Has 3 bootstrap values for different breakpoints for simple responsive design.
     * @var firstValue: col-lg-{{firstValue}}
     * @var secondValue: col-md-{{secondValue}}
     * @var thirdValue: col-sm-{{thirdValue}}
     */
    defaultWidths?: [cols, cols, cols];

    /**
     * Defines, Whether or not there should be a line break after this input.
     * Is used inside the default create and edit dialogs.
     */
    // lineBreakAfter?: boolean;

    constructor(
        displayName: string,
        display: boolean = true,
        required: boolean = true,
        omitForCreate: boolean = false,
        omitForUpdate: boolean = false,
        defaultWidths: [cols, cols, cols] = [6, 6, 12]
        // lineBreakAfter: boolean = false
    ) {
        this.displayName = displayName;
        this.display = display;
        this.required = required;
        this.omitForCreate = omitForCreate;
        this.omitForUpdate = omitForUpdate;
        this.defaultWidths = defaultWidths;
        // this.lineBreakAfter = lineBreakAfter;
    }
}