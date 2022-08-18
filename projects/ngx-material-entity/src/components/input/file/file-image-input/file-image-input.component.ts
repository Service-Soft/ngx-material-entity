/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ImageFileDecoratorConfigInternal } from '../../../../decorators/file/file-decorator-internal.data';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { FileUtilities } from '../../../../classes/file.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { placeholder } from '../../../../mocks/placeholder-data.png';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-image-input',
    templateUrl: './file-image-input.component.html',
    styleUrls: ['./file-image-input.component.scss']
})
export class FileImageInputComponent<EntityType extends object> implements OnInit {

    FileUtilities = FileUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: ImageFileDecoratorConfigInternal;

    singlePreviewImage?: string;
    multiPreviewImages?: string[];
    imageIndex: number = 0;
    placeHolder = placeholder;

    constructor() { }

    async ngOnInit(): Promise<void> {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.FILE_IMAGE);
        // setting the image is done inside the refresh method
    }

    private async setSinglePreviewImage(): Promise<void> {
        let singleFileData = this.entity[this.key] as unknown as FileData | undefined;
        if (singleFileData) {
            singleFileData = await FileUtilities.getFileData(singleFileData);
            this.singlePreviewImage = await FileUtilities.getDataURLFromFile(singleFileData.file);
        }
        else {
            this.singlePreviewImage = undefined;
        }
    }

    private async setMultiPreviewImages(index: number): Promise<void> {
        const multiFileData = this.entity[this.key] as unknown as FileData[] | undefined;
        const previewImages: string[] = [];
        if (multiFileData?.length) {
            for (let i = 0; i < multiFileData.length; i++) {
                if (i === index) {
                    multiFileData[index] = await FileUtilities.getFileData(multiFileData[index]);
                    previewImages.push(await FileUtilities.getDataURLFromFile(multiFileData[index].file as Blob));
                }
                else {
                    previewImages.push('empty');
                }
            }
        }
        this.multiPreviewImages = previewImages;
    }

    async refreshFileData(fileData?: FileData | FileData[]): Promise<void> {
        this.entity[this.key] = fileData as unknown as EntityType[keyof EntityType];
        this.emitChange();
        if (this.metadata.multiple) {
            if (!(fileData as FileData[])?.[this.imageIndex]) {
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

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}