/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FileUtilities } from '../../../../classes/file.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { placeholder } from '../../../../mocks/placeholder-data.png';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-image-input',
    templateUrl: './file-image-input.component.html',
    styleUrls: ['./file-image-input.component.scss']
})
export class FileImageInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.FILE_IMAGE> implements OnInit {

    FileUtilities = FileUtilities;

    singlePreviewImage?: string;
    multiPreviewImages?: string[];
    imageIndex: number = 0;
    placeHolder = placeholder;

    private async setSinglePreviewImage(): Promise<void> {
        let singleFileData = this.entity[this.key] as FileData | undefined;
        if (singleFileData) {
            singleFileData = await FileUtilities.getFileData(singleFileData);
            this.singlePreviewImage = await FileUtilities.getDataURLFromFile(singleFileData.file);
        }
        else {
            this.singlePreviewImage = undefined;
        }
    }

    private async setMultiPreviewImages(index: number): Promise<void> {
        const multiFileData = this.entity[this.key] as FileData[] | undefined;
        const previewImages: string[] = [];
        if (multiFileData?.length) {
            for (let i = 0; i < multiFileData.length; i++) {
                if (i === index) {
                    multiFileData[index] = await FileUtilities.getFileData(multiFileData[index]);
                    previewImages.push(await FileUtilities.getDataURLFromFile(multiFileData[index].file as Blob) as string);
                }
                else {
                    previewImages.push('empty');
                }
            }
        }
        this.multiPreviewImages = previewImages;
    }

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        (this.entity[this.key] as FileData | FileData[] | undefined) = fileData;
        this.emitChange();
        if (this.metadata.multiple) {
            if (!((fileData as FileData[] | undefined)?.[this.imageIndex])) {
                this.imageIndex = 0;
            }
            await this.setMultiPreviewImages(this.imageIndex);
        }
        else {
            await this.setSinglePreviewImage();
        }
    }

    async prev(): Promise<void> {
        if (this.imageIndex > 0) {
            await this.setMultiPreviewImages(this.imageIndex - 1);
            this.imageIndex--;
        }
    }

    async next(): Promise<void> {
        if (this.multiPreviewImages?.length && this.imageIndex !== (this.multiPreviewImages.length - 1)) {
            await this.setMultiPreviewImages(this.imageIndex + 1);
            this.imageIndex++;
        }
    }

    async setIndex(index: number): Promise<void> {
        await this.setMultiPreviewImages(index);
        this.imageIndex = index;
    }
}