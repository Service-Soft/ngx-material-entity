# NgxMaterialEntity
With NgxMaterialEntity you can define how to display entities directly on their properties by using a multitude of decorators for them. You can then use the input component to display the value solely based on the entity and the propertyKey.

It also offers a table component which generates complete CRUD-functionality right out of the box.

NgxMaterialEntity aims to have a fast way to get started with a lot of default options which can be overriden to allow high customization aswell.

[![CI/CD](https://github.com/tim-fabian/ngx-material-entity/actions/workflows/main.yml/badge.svg?branch=release)](https://github.com/tim-fabian/ngx-material-entity/actions/workflows/main.yml)
[![npm version](https://badge.fury.io/js/ngx-material-entity.svg)](https://badge.fury.io/js/ngx-material-entity)
[![Known Vulnerabilities](https://snyk.io/test/npm/ngx-material-entity/badge.svg)](https://snyk.io/test/npm/ngx-material-entity)
[![codecov](https://codecov.io/gh/tim-fabian/ngx-material-entity/branch/dev/graph/badge.svg?token=8Y45KLA74K)](https://codecov.io/gh/tim-fabian/ngx-material-entity)

# Table of Contents
- [NgxMaterialEntity](#ngxmaterialentity)
- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
- [Basic Usage](#basic-usage)
  - [Create your entity](#create-your-entity)
  - [Use the input for your entity property](#use-the-input-for-your-entity-property)
  - [Generate a complete CRUD Table for your entity](#generate-a-complete-crud-table-for-your-entity)
    - [Create a Service for your entity](#create-a-service-for-your-entity)
    - [Define the CRUD-Element](#define-the-crud-element)
- [PropertyDecorators](#propertydecorators)
  - [base](#base)
  - [@string default](#string-default)
  - [@string dropdown](#string-dropdown)
  - [@string textbox](#string-textbox)
  - [@string autocomplete](#string-autocomplete)
  - [@number default](#number-default)
  - [@number dropdown](#number-dropdown)
  - [@boolean toggle](#boolean-toggle)
  - [@boolean checkbox](#boolean-checkbox)
  - [@boolean dropdown](#boolean-dropdown)
  - [@date default](#date-default)
  - [@date dateRange](#date-daterange)
  - [@date datetime](#date-datetime)
  - [@object default](#object-default)
  - [@array](#array)
  - [@array entity](#array-entity)
  - [@array string chips](#array-string-chips)
  - [@array string chips autocomplete](#array-string-chips-autocomplete)
- [NgxMatEntityInput Configuration](#ngxmatentityinput-configuration)
- [NgxMatEntityTable Configuration](#ngxmatentitytable-configuration)
  - [Display Columns](#display-columns)
  - [Multiselect Actions](#multiselect-actions)

# Requirements
This package relies on the [angular material library](https://material.angular.io/guide/getting-started) to render its components.
<br>
It also uses [bootstrap](https://getbootstrap.com/) for responsive design.

# Basic Usage
## Create your entity
Create your entity and define Metadata directly on the properties:
> :warning: IMPORTANT:
> <br>
> You need to always create an entity with the "new" keyword.
> Otherwise the metadata on the properties won't get generated.

```typescript
import { Entity, EntityUtilities, string } from 'ngx-material-entity';

// The "extends Entity" can be left out.
// The abstract Entity-Class provides an id out of the box.
export class MyEntity extends Entity {

    /**
     * ↓ myString is a string
     * ↓ which should be displayed inline
     * ↓ and has the label 'My String'
    */ 
    @string({
        displayName: 'My String',
        displayStyle: 'line'
    })
    myString: string;

    constructor(entity?: MyEntity) {
        super();
        // this helper-method sets all values from the provided entity.
        // It can be used universally.
        EntityUtilities.new(this, entity);
    }

}
```
For a list of all property decorators and their configuration options see [PropertyDecorators](#propertydecorators).

## Use the input for your entity property
You can import the ```NgxMatEntityInputModule``` anywhere in your code:

```typescript
import { NgxMatEntityInputModule } from 'ngx-material-entity';

...
    imports: [
        NgxMatEntityInputModule
    ]
...
```

In the html you can then define:

```html
<ngx-mat-entity-input [entity]="myEntity" [propertyKey]="myString">
</ngx-mat-entity-input>
```

That's it!

This snippet automatically generates an material input for "myString" based on the metadata you defined earlier.
<br>
For a list of further configuration options for the input see [PropertyInput Configuration](#propertyinput-configuration).

## Generate a complete CRUD Table for your entity
It is pretty easy to use the input component inside a for-loop that iterates over every key of an entity to build a complete form for that entity.
<br>
We thought this approach a bit further and build a complete CRUD table component with support for:
- omitting values for creation or updating
- layouting
- responsive design
- multi select actions

As always is the component ready to use out of the box but offers a lot of customization aswell.

### Create a Service for your entity
In order to use the table component you have to define a service that handles http-Requests for the entity and extends from the abstract EntityService-Class:

```typescript
// ↓ It's required that the service can be injected
@Injectable({
    providedIn: 'root'
})
export class MyEntityService extends EntityService<MyEntity> {
    baseUrl: string = `${environment.apiUrl}/my-entity`;
    idKey: keyof MyEntity;

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }
}
```

### Define the CRUD-Element
Import the `NgxMatEntityTableModule` anywhere in your code:

```typescript
import { NgxMatEntityTableModule } from 'ngx-material-entity';

...
    imports: [
        NgxMatEntityTableModule
    ]
...
```

In the html you can then define:

```html
<ngx-mat-entity-table
    [displayColumns]="displayColumns"
    [title]="title"
    [EntityServiceClass]="MyEntityService"
    [EntityClass]="MyEntity"
    [multiSelectActions]="multiSelectActions"
    [createDialogTitle]="'Custom Create Dialog Title'">
</ngx-mat-entity-table>
```
For a list of all configuration options see [NgxMatEntityTable Configuration](#ngxmatentitytable-configuration).

# PropertyDecorators
The property decorators contain all the metadata of an entity property.

## base
Contains information that is universally defined on every property.

```typescript
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
    position?: Position
}
```
For more information regarding the defaultWidths see the bootstrap guide about the [Grid system](https://getbootstrap.com/docs/5.0/layout/grid/).

## @string default
The "default" display of a string value. Inside a single line mat-input.

```typescript
export interface DefaultStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'line',
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}
```

## @string dropdown
Displays a string as a dropdown where the user can input one of the defined dropdownValues.

```typescript
export interface DropdownStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value
     * Can also receive a function to determine the values.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownValues: DropdownValue<string>[]
}
```

## @string textbox
Displays a string as a textbox.

```typescript
export interface TextboxStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'textbox',
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number
}
```

## @string autocomplete
Just like the default @string, but the user has additional autocomplete values to quickly input data.

```typescript
export interface AutocompleteStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'autocomplete',
    /**
     * The autocomplete values.
     */
    autocompleteValues: string[],
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}
```

## @number default
The "default" display of a number value. Inside a single line mat-input.

```typescript
export interface DefaultNumberDecoratorConfig extends NumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'line',
    /**
     * The minimum value of the number.
     */
    min?: number,
    /**
     * The maximum value of the number.
     */
    max?: number
}
```

## @number dropdown
Displays the numbers in a dropdown

```typescript
export interface DropdownNumberDecoratorConfig extends NumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownValues: DropdownValue<number>[]
}
```

## @boolean toggle
Displays the boolean value as a MatSlideToggle

```typescript
export interface ToggleBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'toggle'
}
```

## @boolean checkbox
Displays the boolean value as a MatCheckbox

```typescript
export interface CheckboxBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'checkbox'
}
```

## @boolean dropdown
Displays the boolean value as a MatCheckbox

```typescript
export interface DropdownBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The name of the true value if displayStyle dropdown is used.
     */
    dropdownTrue: string,
    /**
     * The name of the false value if displayStyle dropdown is used.
     */
    dropdownFalse: string
}
```

## @date default
Displays a date value as an mat-datepicker.
```typescript
export interface DefaultDateDecoratorConfig extends DateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'date',
    /**
     * A function to get the minimum value of the date.
     */
    min?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the date.
     */
    max?: (date?: Date) => Date,
    /**
     * A filter function to do more specific filtering. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date | null | undefined>
}
```

## @date dateRange
Displays the selection of a time period as the daterange-picker.

```typescript
export interface DateRangeDateDecoratorConfig extends DateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'daterange',
    /**
     * A function to get the minimum value of the start date.
     */
    minStart?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the start date.
     */
    maxStart?: (date?: Date) => Date,
    /**
     * A function to get the minimum value of the end date.
     */
    minEnd?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the end date.
     */
    maxEnd?: (date?: Date) => Date,
    /**
     * A filter function to do more specific filtering on the disallowed end date values. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date>,
    /**
     * The placeholder for the start date of the date range picker.
     *
     * @default "Start"
     */
    placeholderStart?: string,
    /**
     * The placeholder for the end date of the date range picker.
     *
     * @default "End"
     */
    placeholderEnd?: string
}
```

## @date datetime
Displays the date as a datetime input.

```typescript
export interface DateTimeDateDecoratorConfig extends DateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'datetime',
    /**
     * The selectable times.
     */
    times?: DropdownValue<Time>[],
    /**
     * The name to use as a label for the time form field.
     *
     * @default 'Time'
     */
    timeDisplayName?: string,
    /**
     * A function to get the minimum value of the date.
     */
    minDate?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the date.
     */
    maxDate?: (date?: Date) => Date,
    /**
     * A filter function to do more specific date filtering. This could be the removal of e.g. All weekends.
     */
    filterDate?: DateFilterFn<Date | null | undefined>,
    /**
     * A function to get the minimum value of the time.
     */
    minTime?: (date?: Date) => Time,
    /**
     * A function to get the maximum value of the time.
     */
    maxTime?: (date?: Date) => Time,
    /**
     * A filter function to do more specific time filtering. This could be e.g. The removal of lunch breaks.
     */
    filterTime?: ((time: Time) => boolean) | (() => boolean)
}
```

## @object default
Displays an entity object inline.

```typescript
export interface DefaultObjectDecoratorConfig<EntityType extends object> extends ObjectDecoratorConfig<EntityType> {
    /**
     * The class of the object. Is used to call the constructor so that all metadata is initialized.
     */
    EntityClass!: EntityClassNewable<EntityType>;

    /**
     * How to display the object.
     *
     * The objects properties are added as input fields in an section of the entity.
     * Useful if the object only contains a few properties (e.g. A address on a user).
     */
    displayStyle!: 'inline';
}
```

## @array
```typescript
/**
 * Interface definition for the @array metadata.
 */
abstract class ArrayDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * How to display the string.
     */
    displayStyle!: 'table' | 'chips';

    /**
     * The type of the items inside the array.
     */
    itemType!: DecoratorTypes;
}
```
## @array entity
```typescript
/**
 * Definition for an array of Entities.
 */
export interface EntityArrayDecoratorConfig<EntityType extends object> extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.OBJECT,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'table',

    /**
     * The EntityClass used for generating the create inputs.
     */
    EntityClass: EntityClassNewable<EntityType>,

    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column.
     */
    displayColumns: ArrayTableDisplayColumn<EntityType>[],

    /**
     * The data for the add-item-dialog.
     * Can be omitted when adding items inline.
     */
    createDialogData?: CreateDialogData,

    /**
     * Whether or not the form for adding items to the array
     * should be displayed inline.
     *
     * @default true
     */
    createInline?: boolean,

    /**
     * The label for the add button when createInline is true.
     *
     * @default 'Add'
     */
    addButtonLabel?: string,

    /**
     * The label for the remove button when createInline is true.
     *
     * @default 'Remove'
     */
    removeButtonLabel?: string,

    /**
     * The error-message to display when the array is required but contains no values.
     */
    missingErrorMessage?: string
}
```

## @array string chips
```typescript
/**
 * Definition for an array of strings displayed as a chips list.
 */
export interface StringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips',

    /**
     * The class for the <i> tag used to remove an entry from the array.
     *
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}
```

## @array string chips autocomplete
```typescript
/**
 * Definition for an array of autocomplete strings displayed as a chips list.
 */
export interface AutocompleteStringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips',

    /**
     * The class for the <i> tag used to remove an entry from the array.
     *
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The autocomplete values.
     */
    autocompleteValues: string[],
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}
```

# NgxMatEntityInput Configuration
With the property input you can generate an input field based on the metadata you defined on your property.
<br>
Configuration options are:

```typescript
/**
 * The entity on which the property exists. Used in conjunction with the "propertyKey"
 * to determine the property for which the input should be generated.
 */
@Input()
entity!: EntityType;

/**
 * The name of the property to generate the input for. Used in conjunction with the "entity".
 */
@Input()
propertyKey!: keyof EntityType;

/**
 * (optional) A custom function to generate the error-message for invalid inputs.
 */
@Input()
getValidationErrorMessage!: (model: NgModel) => string;

/**
 * Whether to hide a value if it is omitted for creation.
 * Is used internally for the object property.
 */
@Input()
hideOmitForCreate?: boolean;

/**
 * Whether to hide a value if it is omitted for editing.
 * Is used internally for the object property.
 */
@Input()
hideOmitForEdit?: boolean;
```

# NgxMatEntityTable Configuration
With the `ngx-mat-entity-table` component you can create a complete CRUD functionality for your entities.
<br>
As this component is highly configurable and allows you to either create your own create and edit implementations or use the default out of the box  dialogs for that.

```typescript
/**
 * The base data of the ngx-mat-entity-table.
 */
export interface BaseData<EntityType extends object> {
    /**
     * The title of the table.
     */
    title: string,
    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column.
     */
    displayColumns: DisplayColumn<EntityType>[],
    /**
     * The Class of the service that handles the entities.
     * Needs to be injectable and an extension of the "EntityService"-Class.
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The Class of the entities to manage.
     */
    EntityClass?: EntityClassNewable<EntityType>,
    /**
     * The label on the search bar. Defaults to "Search".
     */
    searchLabel?: string,
    /**
     * The label on the button for adding new entities. Defaults to "Create".
     */
    createButtonLabel?: string,
    /**
     * Takes a custom edit method which runs when you click on a entity.
     * If you don't need any special editing of entries you can also omit this.
     * In that case a default edit dialog is generated.
     */
    edit?: (entity: EntityType) => unknown,
    /**
     * Takes a method to run when you click on the new button.
     * If you don't need anything special you can also omit this.
     * In that case a default create dialog is generated.
     */
    create?: (entity: EntityType) => unknown,
    /**
     * Defines how the search string of entities is generated.
     */
    searchString?: (entity: EntityType) => string,
    /**
     * Defines whether or not the user can add new entities.
     *
     * @default true
     */
    allowCreate?: boolean,
    /**
     * Defines whether or not the user can edit entities.
     *
     * @default () => true
     */
    allowEdit?: (entity: EntityType) => boolean,
    /**
     * Whether or not the user can delete this specific entity.
     */
    allowDelete?: (entity: EntityType) => boolean,
    /**
     * All Actions that you want to run on multiple entities can be defined here.
     * (e.g. Download as zip-file or mass delete).
     */
    multiSelectActions?: MultiSelectAction<EntityType>[],
    /**
     * The Label for the button that opens all multi-actions.
     */
    multiSelectLabel?: string
}

/**
 * The data of the default create-dialog.
 */
export interface CreateDialogData {
    /**
     * The title of the default create-dialog.
     */
    title?: string,
    /**
     * The label on the create-button of the default create-dialog. Defaults to "Create".
     */
    createButtonLabel?: string,
    /**
     * The label on the cancel-button for the default create-dialog. Defaults to "Cancel".
     */
    cancelButtonLabel?: string,
    /**
     * Whether or not the creation of an entry should require a confirm dialog.
     */
    createRequiresConfirmDialog?: boolean,
    /**
     * The data used to generate a confirmation dialog for the create action.
     */
    confirmCreateDialogData?: ConfirmDialogData
}

/**
 * The data of the default edit-dialog.
 */
export interface EditDialogData<EntityType extends object> {
    /**
     * The title of the default edit-dialog.
     */
    title?: (entity: EntityType) => string,
    /**
     * The label on the confirm-button of the default edit-dialog. Defaults to "Save".
     */
    confirmButtonLabel?: string,
    /**
     * The label on the delete-button of the default edit-dialog. Defaults to "Delete".
     */
    deleteButtonLabel?: string,
    /**
     * The label on the cancel-button for the default edit-dialog. Defaults to "Cancel".
     */
    cancelButtonLabel?: string,
    /**
     * Whether or not the deletion of an entry should require a confirm dialog.
     */
    deleteRequiresConfirmDialog?: boolean,
    /**
     * Whether or not the editing of an entry should require a confirm dialog.
     */
    editRequiresConfirmDialog?: boolean,

    /**
     * The data used to generate a confirmation dialog for the delete action.
     */
    confirmDeleteDialogData?: ConfirmDialogData,

    /**
     * The data used to generate a confirmation dialog for the delete action.
     */
    confirmEditDialogData?: ConfirmDialogData
}

/**
 * All the configuration data required to display a ngx-mat-entity-table.
 */
export interface TableData<EntityType extends object> {
    /**
     * The base data for the table-component.
     * Includes stuff like the title for the table, what to display inside the rows etc.
     */
    baseData: BaseData<EntityType>,
    /**
     * The data for the default create-dialog.
     * Can be omitted when specifying a custom "create" method inside the baseData.
     */
    createDialogData?: CreateDialogData,
    /**
     * The data for the default edit-dialog.
     * Can be omitted when specifying a custom "edit" method inside the baseData.
     */
    editDialogData?: EditDialogData<EntityType>
}
```

## Display Columns
The definition of a column inside the table.
```typescript
export interface DisplayColumn<EntityType extends object> {
    /**
     * The name inside the header.
     */
    displayName: string,
    /**
     * A method to get the value inside an row.
     */
    value: (entity: EntityType) => string
}
```

## Multiselect Actions
Multiselect Actions appear on the right upper corner and allow you to do actions on all selected entries.

```typescript
export interface MultiSelectAction<EntityType extends object> {
    /**
     * The name of the action.
     */
    displayName: string,
    /**
     * The action itself.
     */
    action: (selectedEntities: EntityType[]) => unknown,
    /**
     * A method that defines whether or not the action can be used.
     *
     * @default true
     */
    enabled?: (selectedEntities: EntityType[]) => boolean,
    /**
     * A method that defines whether or not a confirm dialog is needed to run the action.
     *
     * @default false
     */
    requireConfirmDialog?: (selectedEntities: EntityType[]) => boolean,
    /**
     * The data used to generate a confirmation dialog for the multiSelect action.
     */
    confirmDialogData?: ConfirmDialogData
}
```
