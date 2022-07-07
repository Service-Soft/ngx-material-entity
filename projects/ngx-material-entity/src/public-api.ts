/**
 * Public API Surface of ngx-material-entity.
 */

import 'reflect-metadata';

// classes
export * from './classes/entity-model.class';
export * from './classes/entity-service.class';
export * from './classes/entity-utilities.class';

// components
export * from './components/confirm-dialog/confirm-dialog-data';
export * from './components/confirm-dialog/confirm-dialog.component';
export * from './components/confirm-dialog/confirm-dialog.module';

export * from './components/table/table-data';
export * from './components/table/table.component';
export * from './components/table/table.module';

export * from './components/table/create-dialog/create-entity-dialog-data';
export * from './components/table/create-dialog/create-entity-dialog.module';
export * from './components/table/create-dialog/create-entity-dialog.component';

export * from './components/table/edit-dialog/edit-entity-dialog-data';
export * from './components/table/edit-dialog/edit-entity-dialog.module';
export * from './components/table/edit-dialog/edit-entity-dialog.component';

export * from './components/input/input.module';
export * from './components/input/input.component';

export * from './components/get-validation-error-message.function';

// decorators
export * from './decorators/base/decorator-types.enum';
export * from './decorators/array.decorator';
export * from './decorators/boolean.decorator';
export * from './decorators/number.decorator';
export * from './decorators/object.decorator';
export * from './decorators/string.decorator';