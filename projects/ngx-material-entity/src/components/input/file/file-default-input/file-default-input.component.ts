/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DefaultFileDecoratorConfigInternal } from '../../../../decorators/file/file-decorator-internal.data';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { FileUtilities } from '../../../../classes/file.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-default-input',
    templateUrl: './file-default-input.component.html',
    styleUrls: ['./file-default-input.component.scss']
})
export class FileDefaultInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    FileUtilities = FileUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DefaultFileDecoratorConfigInternal;

    constructor() { }

    async ngOnInit(): Promise<void> {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.FILE_DEFAULT);
    }

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        (this.entity[this.key] as FileData | FileData[] | undefined) = fileData;
        this.emitChange();
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}