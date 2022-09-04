/**
 * A bootstrap column value (a range from 1 - 12).
 */
export type Col = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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
    displayName!: string;
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
     * The first value sets the columns for the screen size lg, the second for md and the third for sm.
     *
     * @default [6, 6, 12]
     */
    defaultWidths?: [Col, Col, Col];
    /**
     * Specifies the how to position this property when using default create/edit dialogs.
     *
     * @default { row: -1,  order: -1} (Adds the property at the end)
     */
    position?: Position;
}

/**
 * The options for positioning a property when using default create/edit dialogs.
 */
export interface Position {
    /**
     * Specifies a tab in which this property is displayed.
     * If no property has the tab metadata specified no tabs are displayed.
     * Ordering is ascending.
     *
     * @default -1 (sets this property in the first tab)
     */
    tab?: number,
    /**
     * Specifies the name of the tab. Can only be set by one property in each tab.
     * Requires "tab" to be set.
     *
     * @default `Tab ${numberOfTheTab}`
     */
    tabName?: string,
    /**
     * Specifies the (bootstrap)-row in which this property is displayed.
     * Ordering is ascending.
     *
     * @default -1 (sets this property after the last row)
     */
    row?: number,
    /**
     * Specifies order of the input property inside the specified row.
     * Ordering is ascending.
     *
     * @default -1 (sets this property at the end of the row)
     */
    order?: number
}