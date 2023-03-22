/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { FileUtilities } from '../../../../utilities/file.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-default-input',
    templateUrl: './file-default-input.component.html',
    styleUrls: ['./file-default-input.component.scss']
})
export class FileDefaultInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.FILE_DEFAULT, FileData | FileData[]> implements OnInit {

    FileUtilities: typeof FileUtilities = FileUtilities;

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        this.propertyValue = fileData;
        this.emitChange();
    }
}