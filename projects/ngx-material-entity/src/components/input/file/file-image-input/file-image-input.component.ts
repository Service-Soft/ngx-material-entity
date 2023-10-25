/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { PLACEHOLDER } from '../../../../mocks/placeholder-data.png';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { FileUtilities } from '../../../../utilities/file.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'file-image-input',
    templateUrl: './file-image-input.component.html',
    styleUrls: ['./file-image-input.component.scss']
})
export class FileImageInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.FILE_IMAGE, FileData | FileData[]> implements OnInit {

    get multiPreviewImages(): string[] | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.MULTI_PREVIEW_IMAGES_KEY, this.entity, this.key) as string[] | undefined;
    }
    set multiPreviewImages(value: string[] | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.MULTI_PREVIEW_IMAGES_KEY, value, this.entity, this.key);
    }

    get singlePreviewImage(): string | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.SINGLE_PREVIEW_IMAGE_KEY, this.entity, this.key) as string | undefined;
    }
    set singlePreviewImage(value: string | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.SINGLE_PREVIEW_IMAGE_KEY, value, this.entity, this.key);
    }

    imageIndex: number = 0;
    placeHolder: string = PLACEHOLDER;

    constructor(private readonly http: HttpClient) {
        super();
    }

    private async setSinglePreviewImage(): Promise<void> {
        if (this.propertyValue) {
            this.propertyValue = await FileUtilities.getFileData(this.propertyValue as FileData, this.http);
            this.singlePreviewImage = await FileUtilities.getDataURLFromFile(this.propertyValue.file);
        }
        else {
            this.singlePreviewImage = undefined;
        }
    }

    private async setMultiPreviewImages(index: number): Promise<void> {
        const multiFileData: FileData[] | undefined = this.propertyValue as FileData[] | undefined;
        const previewImages: string[] = [];
        if (multiFileData?.length) {
            for (let i: number = 0; i < multiFileData.length; i++) {
                if (i === index) {
                    multiFileData[index] = await FileUtilities.getFileData(multiFileData[index], this.http);
                    previewImages.push(await FileUtilities.getDataURLFromFile(multiFileData[index].file) as string);
                }
                else {
                    previewImages.push('empty');
                }
            }
        }
        this.multiPreviewImages = previewImages;
    }

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        this.propertyValue = fileData;
        this.emitChange();
        if (this.metadata.multiple) {
            fileData = (fileData as FileData[] | undefined);
            if (!fileData?.[this.imageIndex]) {
                this.imageIndex = 0;
            }
            await this.setMultiPreviewImages(this.imageIndex);
        }
        else {
            await this.setSinglePreviewImage();
        }
    }

    async prev(): Promise<void> {
        if (this.imageIndex <= 0) {
            return;
        }
        await this.setMultiPreviewImages(this.imageIndex - 1);
        this.imageIndex--;
    }

    async next(): Promise<void> {
        if (!this.multiPreviewImages?.length) {
            return;
        }
        if (this.imageIndex === (this.multiPreviewImages.length - 1)) {
            return;
        }
        await this.setMultiPreviewImages(this.imageIndex + 1);
        this.imageIndex++;
    }

    async setIndex(index: number): Promise<void> {
        await this.setMultiPreviewImages(index);
        this.imageIndex = index;
    }
}