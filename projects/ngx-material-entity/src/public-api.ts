/**
 * Public API Surface of ngx-material-entity.
 */
import 'reflect-metadata';

// classes
export * from './classes/entity.model';
// components
export * from './components/confirm-dialog/confirm-dialog-data';
export * from './components/confirm-dialog/confirm-dialog.component';
export * from './components/confirm-dialog/confirm-dialog.module';
export * from './components/edit-page/edit-page.component';
export * from './components/get-validation-error-message.function';
export * from './components/input/base-input.component';
export * from './components/input/input.component';
export * from './components/input/input.module';
export * from './components/table/create-dialog/create-entity-dialog-data';
export * from './components/table/create-dialog/create-entity-dialog.component';
export * from './components/table/create-dialog/create-entity-dialog.module';
export * from './components/table/edit-dialog/edit-entity-data';
export * from './components/table/edit-dialog/edit-entity-dialog.component';
export * from './components/table/edit-dialog/edit-entity-dialog.module';
export * from './components/table/table-data';
export * from './components/table/table.component';
export * from './components/table/table.module';
export * from './components/table/default.actions';
// decorators
export * from './decorators/array/array-decorator.data';
export * from './decorators/array/array.decorator';
export * from './decorators/base/decorator-types.enum';
export * from './decorators/base/dropdown-value.interface';
export { Col, Position } from './decorators/base/property-decorator.data';
export * from './decorators/boolean/boolean-decorator.data';
export * from './decorators/boolean/boolean.decorator';
export * from './decorators/custom/custom-decorator.data';
export * from './decorators/custom/custom.decorator';
export * from './decorators/date/date-decorator.data';
export * from './decorators/date/date.decorator';
export * from './decorators/file/file-decorator.data';
export * from './decorators/file/file.decorator';
export * from './decorators/number/number-decorator.data';
export * from './decorators/number/number.decorator';
export * from './decorators/object/object-decorator.data';
export * from './decorators/object/object.decorator';
export * from './decorators/references-many/references-many-decorator.data';
export * from './decorators/references-many/references-many.decorator';
export * from './decorators/has-many/has-many-decorator.data';
export * from './decorators/has-many/has-many.decorator';
export * from './decorators/string/string-decorator.data';
export * from './decorators/string/string.decorator';
// services
export * from './services/entity.service';
export * from './services/unsaved-changes.guard';
//utilities
export * from './utilities/date.utilities';
export * from './utilities/entity.utilities';
export * from './utilities/file.utilities';