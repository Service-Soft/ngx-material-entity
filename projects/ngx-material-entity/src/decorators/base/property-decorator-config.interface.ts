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

    constructor(displayName: string, display: boolean = true, required: boolean = true, omitForCreate: boolean = false, omitForUpdate: boolean = false) {
        this.displayName = displayName;
        this.display = display;
        this.required = required;
        this.omitForCreate = omitForCreate;
        this.omitForUpdate = omitForUpdate;
    }
}