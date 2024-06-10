import { defaultDynamicStyleClasses } from '../../functions/default-style-classes.function';
import { defaultTrue } from '../../functions/default-true.function';
import { getConfigValue } from '../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { DisplayColumn, DynamicStyleClasses } from '../table/table-data';
import { defaultSearchFunction } from '../table/table-data.builder';

/**
 * Configuration for the custom table.
 */
export interface CustomTableConfiguration<T = unknown> {
    /**
     * Configuration for css classes that should be applied to table rows based on a condition.
     * This could be used to eg. Set the background color to green when an item has the status completed etc.
     * INFO: You need to use ng-deep or apply the styling in the styles.scss.
     * @default () => []
     */
    dynamicRowStyleClasses?: DynamicStyleClasses<T>,
    /**
     * The columns to display inside the custom table.
     */
    displayColumns: DisplayColumn<T>[],
    /**
     * Whether or not a loading spinner should be shown.
     * Only works when you provide the "loading" input to the custom table.
     * @default true
     */
    displayLoadingSpinner?: boolean,
    /**
     * Whether or not the select column should be enabled.
     * @default true
     */
    withSelection: boolean,
    /**
     * A function that resolves a row value to a string that can be searched for.
     * By default this uses a built in search filter.
     */
    searchStringForRow?: (value: T) => string,
    /**
     * Whether or not the user is allowed to click on entries in the custom table.
     * @default () => true
     */
    allowClick?: (value: T) => boolean,
    /**
     * An error message to show when the table contains no entries.
     * Also applies styling to the table.
     */
    emptyErrorMessage?: string,
    /**
     * Resolves the given id for an entity.
     * This is used for the referencesMany input,
     * where you want to show values of the entity in the table rows and not the id.
     */
    resolveToReferencedEntity?: (id: unknown) => unknown
}

/**
 * Internal configuration for the custom table.
 * Provides default values.
 */
export class InternalCustomTableConfiguration<
    T = unknown
>implements CustomTableConfiguration<T> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    dynamicRowStyleClasses: DynamicStyleClasses<T>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<T>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayLoadingSpinner: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    withSelection: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    searchStringForRow: (value: T) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowClick: (value: T) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    emptyErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    resolveToReferencedEntity?: (id: unknown) => unknown;

    constructor(globalConfig: NgxGlobalDefaultValues, configuration: CustomTableConfiguration<T>) {
        this.dynamicRowStyleClasses = configuration.dynamicRowStyleClasses ?? defaultDynamicStyleClasses;
        this.displayColumns = configuration.displayColumns;
        this.displayLoadingSpinner = configuration.displayLoadingSpinner ?? true;
        this.withSelection = configuration.withSelection;
        this.searchStringForRow = configuration.searchStringForRow ?? defaultSearchFunction;
        this.allowClick = configuration.allowClick ?? defaultTrue;
        this.emptyErrorMessage = getConfigValue(globalConfig.emptyArrayErrorMessage, configuration.emptyErrorMessage);
        this.resolveToReferencedEntity = configuration.resolveToReferencedEntity;
    }
}