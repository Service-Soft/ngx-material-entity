/*
 * Public API Surface of ngx-material-entity
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

export * from './components/entities/entities-data';
export * from './components/entities/entities.component';
export * from './components/entities/entities.module';

export * from './components/entities/create-entity-dialog/create-entity-dialog-data';
export * from './components/entities/create-entity-dialog/create-entity-dialog.module';
export * from './components/entities/create-entity-dialog/create-entity-dialog.component';

export * from './components/entities/edit-entity-dialog/edit-entity-dialog-data';
export * from './components/entities/edit-entity-dialog/edit-entity-dialog.module';
export * from './components/entities/edit-entity-dialog/edit-entity-dialog.component';

export * from './components/property-input/property-input.module';
export * from './components/property-input/property-input.component';

export * from './components/get-validation-error-message.function';

// decorators
export * from './decorators/array.decorator';
export * from './decorators/boolean.decorator';
export * from './decorators/number.decorator';
export * from './decorators/object.decorator';
export * from './decorators/string.decorator';