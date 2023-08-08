/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DefaultFileDecoratorConfigInternal, FileDataWithFile, ImageFileDecoratorConfigInternal } from '../../../../decorators/file/file-decorator-internal.data';
import { FileData } from '../../../../decorators/file/file-decorator.data';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { FileUtilities } from '../../../../utilities/file.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    get filenames(): string[] | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.FILENAMES_KEY, this.entity, this.key) as string[] | undefined;
    }
    set filenames(value: string[] | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.FILENAMES_KEY, value, this.entity, this.key);
    }

    FileUtilities: typeof FileUtilities = FileUtilities;

    @Input()
    propertyValue!: FileData | FileData[] | undefined;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    metadata!: DefaultFileDecoratorConfigInternal | ImageFileDecoratorConfigInternal;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Input()
    isReadOnly!: boolean;

    @Output()
    fileDataChangeEvent: EventEmitter<FileData | FileData[]> = new EventEmitter<FileData | FileData[]>();

    constructor(private readonly dialog: MatDialog, private readonly http: HttpClient) { }

    async ngOnInit(): Promise<void> {
        if (this.metadata.multiple) {
            this.initMultiFile();
        }
        else {
            this.initSingleFile();
        }
        this.fileDataChangeEvent.emit(this.propertyValue);
    }

    private initMultiFile(): void {
        if (this.propertyValue) {
            this.filenames = (this.propertyValue as FileData[]).map(f => f.name);
        }
    }

    private initSingleFile(): void {
        if (this.propertyValue) {
            this.filenames = [(this.propertyValue as FileData).name];
        }
    }

    async setFileFromInput(event: Event): Promise<void> {
        const files: FileList | [] = (event.target as HTMLInputElement).files ?? [];
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
        if (files.find(f => FileUtilities.transformToMegaBytes(f.size, 'B') > this.metadata.maxSize)) {
            this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                data: this.metadata.maxSizeErrorDialog,
                autoFocus: false,
                restoreFocus: false
            });
            this.resetFileInputs();
            return;
        }
        let fileSizeTotal: number = 0;
        for (const file of files) {
            fileSizeTotal += file.size;
        }
        if (FileUtilities.transformToMegaBytes(fileSizeTotal, 'B') > this.metadata.maxSizeTotal) {
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
        this.fileDataChangeEvent.emit(this.propertyValue);
    }

    private resetFileInputs(): void {
        this.filenames = undefined;
        this.propertyValue = undefined;
        this.fileDataChangeEvent.emit(this.propertyValue);
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
        this.propertyValue = LodashUtilities.cloneDeep(data);
        this.filenames = this.propertyValue.map(f => f.name);
    }

    private async setSingleFile(file: File): Promise<void> {
        this.propertyValue = {
            file: file,
            name: file.name,
            type: file.type,
            size: file.size
        };
        this.filenames = [this.propertyValue.name];
    }

    removeFile(name: string): void {
        if (this.isReadOnly) {
            return;
        }
        if (this.metadata.multiple) {
            this.filenames?.splice(this.filenames.indexOf(name), 1);
            if (!this.filenames?.length) {
                this.filenames = undefined;
            }
            const fileDataToRemove: FileData = (this.propertyValue as FileData[]).find(f => f.name === name) as FileData;
            (this.propertyValue as FileData[]).splice((this.propertyValue as FileData[]).indexOf(fileDataToRemove), 1);
            if (!(this.propertyValue as FileData[]).length) {
                this.propertyValue = undefined;
            }
        }
        else {
            this.filenames = undefined;
            this.propertyValue = undefined;
        }
        this.fileDataChangeEvent.emit(this.propertyValue);
    }

    async downloadFile(name: string): Promise<void> {
        if (this.metadata.multiple && (this.propertyValue as FileData[]).length) {
            const foundFileData: FileData = (this.propertyValue as FileData[]).find(f => f.name === name) as FileData;
            // the index need to be saved in a constant because we edit foundFileData
            // => .indexOf() returns undefined.
            const index: number = (this.propertyValue as FileData[]).indexOf(foundFileData);
            (this.propertyValue as FileData[])[index] = await FileUtilities.getFileData(foundFileData, this.http);
            FileUtilities.downloadSingleFile((this.propertyValue as FileData[])[index] as FileDataWithFile);
        }
        else if (this.propertyValue) {
            this.propertyValue = await FileUtilities.getFileData(this.propertyValue as FileData, this.http);
            FileUtilities.downloadSingleFile(this.propertyValue);
        }
    }

    downloadAllEnabled(): boolean {
        if (!this.metadata.multiple) {
            return false;
        }
        if (!this.propertyValue) {
            return false;
        }
        if ((this.propertyValue as FileData[]).length < 2) {
            return false;
        }
        return true;
    }

    async downloadAll(): Promise<void> {
        if ((this.propertyValue as FileData[]).length) {
            // eslint-disable-next-line max-len
            void FileUtilities.downloadMultipleFiles(this.metadata.displayName, LodashUtilities.cloneDeep(this.propertyValue as FileData[]), this.http);
        }
    }
}