/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DefaultFileDecoratorConfigInternal } from '../../../../decorators/file/file-decorator-internal.data';
import { FileUtilities } from '../../../../classes/file.utilities';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { LodashUtilities } from '../../../../capsulation/lodash.utilities';
import { MatDialog } from '@angular/material/dialog';
import { NgxMatEntityConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    singleFileData?: FileData;
    multiFileData?: FileData[];
    filenames?: string[];

    FileUtilities = FileUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    fileDataChangeEvent = new EventEmitter<FileData | FileData[]>();

    metadata!: DefaultFileDecoratorConfigInternal;

    constructor(private readonly dialog: MatDialog) { }

    async ngOnInit(): Promise<void> {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.FILE_DEFAULT);
        if (this.metadata.multiple) {
            this.initMultiFile();
        }
        else {
            this.initSingleFile();
        }
        this.fileDataChangeEvent.emit(this.singleFileData ?? this.multiFileData);
    }

    private initMultiFile(): void {
        this.multiFileData = this.entity[this.key] as FileData[] | undefined;
        if (this.multiFileData) {
            this.filenames = this.multiFileData.map(f => f.name);
        }
    }

    private initSingleFile(): void {
        this.singleFileData = this.entity[this.key] as FileData | undefined;
        if (this.singleFileData) {
            this.filenames = LodashUtilities.cloneDeep([this.singleFileData.name]);
        }
    }

    async setFileFromInput(event: Event): Promise<void> {
        const files = (event.target as HTMLInputElement).files ?? [];
        await this.setFile(Array.from(files));
    }

    async setFile(files: File[]): Promise<void> {
        // validation done inline
        if (files.find(f => !FileUtilities.isMimeTypeValid(f.type, this.metadata.allowedMimeTypes))) {
            this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                data: this.metadata.mimeTypeErrorDialog,
                autoFocus: false,
                restoreFocus: false
            });
            this.resetFileInputs();
            return;
        }
        if (files.find(f => f.size > (this.metadata.maxSize * 1000000))) {
            this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                data: this.metadata.maxSizeErrorDialog,
                autoFocus: false,
                restoreFocus: false
            });
            this.resetFileInputs();
            return;
        }
        let fileSizeTotal = 0;
        for (const file of files) {
            fileSizeTotal += file.size;
        }
        if (fileSizeTotal > (this.metadata.maxSizeTotal * 1000000)) {
            this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                data: this.metadata.maxSizeTotalErrorDialog,
                autoFocus: false,
                restoreFocus: false
            });
            this.resetFileInputs();
            return;
        }
        if (this.metadata.multiple) {
            await this.setMultiFile(Array.from(files));
        }
        else {
            await this.setSingleFile(files[0]);
        }
        this.fileDataChangeEvent.emit(this.singleFileData ?? this.multiFileData);
    }

    private resetFileInputs(): void {
        this.filenames = undefined;
        this.singleFileData = undefined;
        this.multiFileData = undefined;
        this.fileDataChangeEvent.emit();
    }

    private async setMultiFile(files: File[]): Promise<void> {
        const data: FileData[] = [];
        for (const file of files) {
            const fileData: FileData = {
                file: file,
                name: file.name,
                type: file.type,
                size: file.size
            };
            data.push(fileData);
        }
        this.multiFileData = LodashUtilities.cloneDeep(data);
        this.filenames = this.multiFileData.map(f => f.name);
    }

    private async setSingleFile(file: File): Promise<void> {
        this.singleFileData = {
            file: file,
            name: file.name,
            type: file.type,
            size: file.size
        };
        this.filenames = LodashUtilities.cloneDeep([this.singleFileData.name]);
    }

    removeFile(name: string): void {
        if (this.metadata.multiple) {
            this.filenames?.splice(this.filenames.indexOf(name), 1);
            if (!this.filenames?.length) {
                this.filenames = undefined;
            }
            const fileDataToRemove = this.multiFileData?.find(f => f.name === name) as FileData;
            this.multiFileData?.splice(this.multiFileData.indexOf(fileDataToRemove), 1);
            if (!this.multiFileData?.length) {
                this.multiFileData = undefined;
            }
        }
        else {
            this.filenames = undefined;
            this.singleFileData = undefined;
        }
        this.fileDataChangeEvent.emit(this.singleFileData ?? this.multiFileData);
    }
}