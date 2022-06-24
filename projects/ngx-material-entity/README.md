# NgxMaterialEntity
Create Entities and define how to display them directly on their properties.
<br>
Can even generate complete and highly customizable CRUD-Tables for them.
<br>
<br>

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
  - [@object default](#object-default)
- [PropertyInput Configuration](#propertyinput-configuration)
- [Entities Configuration](#entities-configuration)
  - [Display Columns](#display-columns)
  - [Multiselect Actions](#multiselect-actions)
<br>
<br>

# Requirements
This package relies on the [angular material library](https://material.angular.io/guide/getting-started) to render its components.
<br>
It also uses [bootstrap](https://getbootstrap.com/) for responsive design.
<br>
<br>

# Basic Usage
## Create your entity
Create your entity and define Metadata directly on the properties:
<div style="background-color: #d9d28d; color: black; padding: 10px; border-radius: 7px; border: 2px solid #d4c533">
    IMPORTANT:
    <br>
    You need to always create an entity with the "new" keyword.
    Otherwise the metadata on the properties won't get generated.
</div>
<br>

```typescript
import { Entity, EntityUtilities, string } from 'ngx-material-entity';

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
        EntityUtilities.new(this, entity);
    }

}
```
For a list of all decorators and configuration options see [PropertyDecorators](#propertydecorators).
<br>
<br>

## Use the input for your entity property
You can import the ```PropertyInputModule``` anywhere in your code:

```typescript
import { PropertyInputModule } from 'ngx-material-entity';

...
    imports: [
        PropertyInputModule
    ]
...
```

In the html you can then define:

```html
<ngx-material-entity-input
    [entity]="myEntity"
    [propertyKey]="myString">
</ngx-material-entity-input>
```

This snippet automatically generates an material input for "myString" based on the metadata you defined earlier.
<br>
For a list of all configuration options for the input see [PropertyInput Configuration](#propertyinput-configuration).
<br>
<br>

## Generate a complete CRUD Table for your entity
### Create a Service for your entity
In order to use the ngx-material-entites component you have to define a service that handles http-Requests for the entity and extends from the abstract EntityService-Class:

```typescript
// ↓ It's required that the service can be injected
@Injectable({
    providedIn: 'root'
})
export class MyEntityService extends EntityService<MyEntity> {
    baseUrl: string = `${environment.apiUrl}/my-entity`;

    constructor(private readonly httpClient: HttpClient) {
        super(httpClient);
    }
}
```
<br>
<br>

### Define the CRUD-Element
Import the ```EntitiesModule``` anywhere in your code:

```typescript
import { EntitiesModule } from 'ngx-material-entity';

...
    imports: [
        EntitiesModule
    ]
...
```

In the html you can then define:

```html
<ngx-material-entities
    [displayColumns]="displayColumns"
    [title]="title"
    [EntityServiceClass]="MyEntityService"
    [EntityClass]="MyEntity"
    [multiSelectActions]="multiSelectActions"
    [createDialogTitle]="'Custom Create Dialog Title'">
</ngx-material-entities>
```
For a list of all configuration options see [Entities Configuration](#entities-configuration).
<br>
<br>

# PropertyDecorators
The property decorators contain all the metadata of an entity property.
<br>
<br>

## base
Contains information that is universally defined on every property.

```typescript
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
 * Specifies order of the input property when used inside the default create or edit dialog.
 * Ordering is ascending
 * @default -1 (sets this property at the end)
 */
order?: number;
```
For more information regarding the defaultWidths see the bootstrap guide about the [Grid system](https://getbootstrap.com/docs/5.0/layout/grid/).
<br>
<br>

## @string default
The "default" display of a string value. Inside a single line mat-input.

```typescript
override displayStyle: 'line';
/**
 * (optional) The minimum required length of the string
 */
minLength?: number;
/**
 * (optional) The maximum required length of the string
 */
maxLength?: number;
/**
 * (optional) A regex used for validation
 */
regex?: RegExp;
```
<br>
<br>

## @string dropdown
Displays a string as a dropdown where the user can input one of the defined dropdownValues.

```typescript
override displayStyle: 'dropdown';
/**
 * The values of the dropdown, consisting of a name to display and the actual value
 * Can also receive a function to determine the values
 */
dropdownValues: { displayName: string, value: string }[];
```
<br>
<br>

## @string textbox
Displays a string as a textbox.

```typescript
override displayStyle: 'textbox';
/**
 * (optional) The minimum required length of the string
 */
minLength?: number;
/**
 * (optional) The maximum required length of the string
 */
maxLength?: number;
```
<br>
<br>

## @string autocomplete
Just like the default @string, but the user has additional autocomplete values to quickly input data.

```typescript
override displayStyle: 'autocomplete';
/**
 * The autocomplete values
 */
autocompleteValues: string[];
/**
 * (optional) The minimum required length of the string
 */
minLength?: number;
/**
 * (optional) The maximum required length of the string
 */
maxLength?: number;
/**
 * (optional) A regex used for validation
 */
regex?: RegExp;
```
<br>
<br>

## @number default
The "default" display of a number value. Inside a single line mat-input.

```typescript
override displayStyle: 'line';
/**
 * (optional) The minimum value of the number
 */
min?: number;
/**
 * (optional) The maximum value of the number
 */
max?: number;
```
<br>
<br>

## @number dropdown
Displays the numbers in a dropdown

```typescript
override displayStyle: 'dropdown';
/**
 * The values of the dropdown, consisting of a name to display and the actual value
 * Can also receive a function to determine the values
 */
dropdownValues: { displayName: string, value: number }[];
```
<br>
<br>

## @boolean toggle
Displays the boolean value as a MatSlideToggle

```typescript
override displayStyle: 'toggle';
```
<br>
<br>

## @boolean checkbox
Displays the boolean value as a MatCheckbox

```typescript
override displayStyle: 'checkbox';
```
<br>
<br>

## @boolean dropdown
Displays the boolean value as a MatCheckbox

```typescript
override displayStyle: 'dropdown';
/**
 * The name of the true value if displayStyle dropdown is used.
 * Can also receive a function to determine the name.
 */
dropdownTrue: string | { (args: unknown): string };
/**
 * The name of the false value if displayStyle dropdown is used.
 * Can also receive a function to determine the name,
 */
dropdownFalse: string | { (args: unknown): string };
```
<br>
<br>

## @object default
Displays an entity object inline.

```typescript
override displayStyle: 'inline';
/**
 * (optional) The title of the section containing all object properties. Defaults to the display name.
 */
sectionTitle?: string;
```
<br>
<br>

# PropertyInput Configuration
With the property input you can generate an input field based on the metadata you defined on your property.
<br>
Configuration options are:

```typescript
/**
 * The entity on which the property exists. Used in conjuction with the "propertyKey"
 * to determine the property for which the input should be generated.
 */
@Input()
entity!: EntityType;

/**
 * The name of the property to generate the input for. Used in conjuction with the "entity".
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
<br>
<br>

# Entities Configuration
With the ngx-material-entities component you can create a complete CRUD functionality for your entities.
<br>
As this component is highly configurable and allows you to either create your own create and edit implementations or use the default out of the box  dialogs for that.

```typescript
/**
 * The title of the table
 */
@Input()
title!: string;
/**
 * The definition of the columns to display. Consists of the displayName to show in the header of the row
 * and the value, which is a function that generates the value to display inside a column
 */
@Input()
displayColumns!: DisplayColumn<EntityType>[];
/**
 * The label on the search bar. Defaults to "Search".
 */
@Input()
searchLabel?: string;
/**
 * The label on the button for adding new entities. Defaults to "Create".
 */
@Input()
createButtonLabel?: string;
/**
 * The Class of the entities to manage
 */
@Input()
EntityClass!: new (entity?: EntityType) => EntityType;
/**
 * The Class of the service that handles the entities.
 * Needs to be injectable and an extension of the "EntityService"-Class
 */
@Input()
EntityServiceClass!: new (httpClient: HttpClient) => EntityService<EntityType>;
/**
 * Takes a custom edit method which runs when you click on a entity.
 * If you don't need any special editing of entries you can also omit this.
 * In that case a default edit dialog is generated.
 */
@Input()
edit?: (entity: EntityType) => unknown;
/**
 * Takes a method to run when you click on the new button.
 * If you don't need anything special you can also omit this.
 * In that case a default create dialog is generated.
 */
@Input()
create?: (entity: EntityType) => unknown;
/**
 * Defines how the search string of entities is generated.
 */
@Input()
searchString?: (enity: EntityType) => string;
/**
 * Defines whether or not the user can add new entities.
 */
@Input()
allowCreate!: boolean;
/**
 * Defines whether or not the user can edit entities.
 */
@Input()
allowEdit!: boolean;
/**
 * Defines whether or not the user can delete entities.
 */
    @Input()
allowDelete!: boolean;
/**
 * All Actions that you want to run on multiple entities can be defined here.
 * (e.g. download as zip-file or mass delete)
 */
@Input()
multiSelectActions?: MultiSelectAction<EntityType>[];
/**
 * The Label for the button that opens all multi-actions.
 */
@Input()
multiSelectLabel?: string;



/**
 * The title of the default create-dialog.
 */
@Input()
createDialogTitle!: string;
/**
 * The label on the create-button of the default create-dialog. Defaults to "Create".
 */
@Input()
createDialogCreateButtonLabel?: string;
/**
 * The label on the cancel-button for the default create-dialog. Defaults to "Cancel".
 */
@Input()
createDialogCancelButtonLabel?: string;



/**
 * The title of the default edit-dialog.
 */
@Input()
editDialogTitle!: string;
/**
 * The label on the confirm-button of the default edit-dialog. Defaults to "Save".
 */
@Input()
editDialogConfirmButtonLabel?: string;
/**
 * The label on the delete-button of the default edit-dialog. Defaults to "Delete".
 */
@Input()
editDialogDeleteButtonLabel?: string;
/**
 * The label on the cancel-button for the default edit-dialog. Defaults to "Cancel".
 */
@Input()
editDialogCancelButtonLabel?: string;
/**
 * The text inside the confirm delete dialog.
 * Each string inside the array is a paragraph.
 */
@Input()
confirmDeleteText?: string[];
/**
 * The label on the button that confirms the deletion of an entity.
 */
@Input()
confirmDeleteButtonLabel?: string;
/**
 * The label on the button that cancels the deletion of an entity.
 */
@Input()
cancelDeleteButtonLabel?: string;
/**
 * The title of the dialog where you have to either confirm or cancel the deletion of an entity.
 */
@Input()
confirmDeleteDialogTitle?: string;
/**
 * Whether or not a checkbox needs to be checked before being able to click on the confirm-delete-button
 */
@Input()
confirmDeleteRequireConfirmation?: boolean;
/**
 * The text next to the checkbox
 */
@Input()
confirmDeleteConfirmationText?: string
```

## Display Columns
The definition of a column inside the table.
```typescript
export interface DisplayColumn<EntityType extends Entity> {
    /**
     * The name inside the header.
     */
    displayName: string;
    /**
     * A method to get the value inside an entry
     */
    value: (entity: EntityType) => string;
}
```

## Multiselect Actions
Multiselect Actions appear on the right upper corner and allow you to do actions on all selected entries.

```typescript
export interface MultiSelectAction<EntityType extends Entity> {
    /**
     * The name of the action
     */
    displayName: string;
    /**
     * The action itself
     */
    action: (entity: EntityType[]) => unknown;
    /**
     * A method that defines whether or not the action can be used.
     * Defaults to true.
     */
    enabled?: (entity: EntityType[]) => boolean;
}
```
//TODO