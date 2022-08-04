/**
 * Public API Surface of ngx-material-entity.
 */
import 'reflect-metadata';

// classes
export * from './classes/entity.model';
export * from './classes/entity.service';
export * from './classes/entity.utilities';
export * from './classes/date.utilities';

// components
export * from './components/confirm-dialog/confirm-dialog-data';
export * from './components/confirm-dialog/confirm-dialog.component';
export * from './components/confirm-dialog/confirm-dialog.module';

export * from './components/input/input.module';
export * from './components/input/input.component';

export * from './components/table/table-data';
export * from './components/table/table.component';
export * from './components/table/table.module';

export * from './components/table/create-dialog/create-entity-dialog-data';
export * from './components/table/create-dialog/create-entity-dialog.module';
export * from './components/table/create-dialog/create-entity-dialog.component';

export * from './components/table/edit-dialog/edit-entity-dialog-data';
export * from './components/table/edit-dialog/edit-entity-dialog.module';
export * from './components/table/edit-dialog/edit-entity-dialog.component';

export * from './components/get-validation-error-message.function';

// decorators
export * from './decorators/array/array.decorator';
export * from './decorators/array/array-decorator.data';

export * from './decorators/base/decorator-types.enum';
export * from './decorators/base/dropdown-value.interface';
export { Col, Position } from './decorators/base/property-decorator.data';

export * from './decorators/boolean/boolean.decorator';
export * from './decorators/boolean/boolean-decorator.data';

export * from './decorators/number/number.decorator';
export * from './decorators/number/number-decorator.data';

export * from './decorators/object/object.decorator';
export * from './decorators/object/object-decorator.data';

export * from './decorators/string/string.decorator';
export * from './decorators/string/string-decorator.data';