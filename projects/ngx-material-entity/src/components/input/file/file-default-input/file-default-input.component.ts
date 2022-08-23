/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FileUtilities } from '../../../../classes/file.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-default-input',
    templateUrl: './file-default-input.component.html',
    styleUrls: ['./file-default-input.component.scss']
})
export class FileDefaultInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.FILE_DEFAULT> implements OnInit {

    FileUtilities = FileUtilities;

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        (this.entity[this.key] as FileData | FileData[] | undefined) = fileData;
        this.emitChange();
    }
}