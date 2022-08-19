import { ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog-data';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultFileDecoratorConfig, ImageFileDecoratorConfig } from './file-decorator.data';

/**
 * Contains data about a file property where a blob exists.
 */
export interface FileDataWithFile {
    /**
     * The name of the file.
     */
    name: string,
    /**
     * The file data itself in form of a blob.
     */
    file: Blob,
    /**
     * The mime type of the file.
     * This is needed to increase performance when checking if the provided file is valid.
     */
    type: string,
    /**
     * The size of the file in bytes.
     * This is needed to increase performance when checking if the provided file is valid.
     */
    size: number,
    /**
     * The url where the blob is saved.
     */
    url?: string
}

/**
 * Contains data about a file property where no blob exists.
 */
export interface FileDataWithUrl {
    /**
     * The name of the file.
     */
    name: string,
    /**
     * The file data itself in form of a blob.
     */
    file?: Blob,
    /**
     * The mime type of the file.
     * This is needed to increase performance when checking if the provided file is valid.
     */
    type: string,
    /**
     * The size of the file in bytes.
     * This is needed to increase performance when checking if the provided file is valid.
     */
    size: number,
    /**
     * The url where the blob is saved.
     */
    url: string
}

/**
 * The internal DefaultFileDecoratorConfig. Sets default values.
 */
export class DefaultFileDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultFileDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'other';
    // eslint-disable-next-line jsdoc/require-jsdoc
    preview: false;
    // eslint-disable-next-line jsdoc/require-jsdoc
    multiple: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowedMimeTypes: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSize: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeTotal: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    mimeTypeErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeTotalErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dragAndDrop: boolean;

    constructor(data: DefaultFileDecoratorConfig) {
        super(data);
        this.type = data.type;
        this.preview = false;
        this.multiple = data.multiple;
        this.deleteIcon = data.deleteIcon ?? 'fas fa-circle-minus';
        this.allowedMimeTypes = data.allowedMimeTypes ?? ['*'];
        this.maxSize = data.maxSize ?? 10;
        this.maxSizeTotal = data.maxSizeTotal ?? 100;
        this.mimeTypeErrorDialog = data.mimeTypeErrorDialog ?? getDefaultMimeTypeErrorDialogData(data);
        this.maxSizeErrorDialog = data.maxSizeErrorDialog ?? getDefaultMaxSizeErrorDialogData(data);
        this.maxSizeTotalErrorDialog = data.maxSizeTotalErrorDialog ?? getDefaultMaxSizeTotalErrorDialogData(data);
        this.dragAndDrop = data.dragAndDrop ?? data.multiple;
    }
}

/**
 * The internal ImageFileDecoratorConfig. Sets default values.
 */
export class ImageFileDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements ImageFileDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'image';
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowedMimeTypes: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    multiple: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    preview: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    previewPlaceholderUrl?: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSize: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeTotal: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    mimeTypeErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxSizeTotalErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dragAndDrop: boolean;

    constructor(data: ImageFileDecoratorConfig) {
        super(data);
        this.type = data.type;
        this.allowedMimeTypes = data.allowedMimeTypes ?? ['image/*'];
        this.multiple = data.multiple;
        this.preview = data.preview ?? true;
        this.deleteIcon = data.deleteIcon ?? 'fas fa-circle-minus';
        this.maxSize = data.maxSize ?? 10;
        this.maxSizeTotal = data.maxSizeTotal ?? 100;
        this.mimeTypeErrorDialog = data.mimeTypeErrorDialog ?? getDefaultMimeTypeErrorDialogData(data);
        this.maxSizeErrorDialog = data.maxSizeErrorDialog ?? getDefaultMaxSizeErrorDialogData(data);
        this.maxSizeTotalErrorDialog = data.maxSizeTotalErrorDialog ?? getDefaultMaxSizeTotalErrorDialogData(data);
        this.previewPlaceholderUrl = data.previewPlaceholderUrl;
        this.dragAndDrop = data.dragAndDrop ?? data.multiple;
    }
}

/**
 * Gets the default dialog data for the error dialog to display
 * when the user tries to add a file with a wrong type.
 *
 * @param data - The File Decorator data.
 * @returns The dialog data with set default values.
 */
function getDefaultMimeTypeErrorDialogData(data: DefaultFileDecoratorConfig | ImageFileDecoratorConfig): ConfirmDialogData {
    return {
        type: data.mimeTypeErrorDialog?.type ?? 'info-only',
        // eslint-disable-next-line max-len
        text: data.mimeTypeErrorDialog?.text ?? (data.multiple ? ['One of the uploaded files has the wrong type.'] : ['The uploaded file has the wrong type.']),
        title: data.mimeTypeErrorDialog?.title ?? (data.multiple ? 'Error adding files' : 'Error adding file'),
        confirmButtonLabel: data.mimeTypeErrorDialog?.confirmButtonLabel,
        cancelButtonLabel: data.mimeTypeErrorDialog?.cancelButtonLabel,
        requireConfirmation: data.mimeTypeErrorDialog?.requireConfirmation,
        confirmationText: data.mimeTypeErrorDialog?.confirmationText
    };
}

/**
 * Gets the default dialog data for the error dialog to display
 * when the user tries to add a single file that is bigger than the allowed maxSize.
 *
 * @param data - The File Decorator data.
 * @returns The dialog data with set default values.
 */
function getDefaultMaxSizeErrorDialogData(data: DefaultFileDecoratorConfig | ImageFileDecoratorConfig): ConfirmDialogData {
    return {
        type: data.mimeTypeErrorDialog?.type ?? 'info-only',
        // eslint-disable-next-line max-len
        text: data.mimeTypeErrorDialog?.text ?? (data.multiple ? ['One of the uploaded files is too big'] : ['The uploaded files is too big']),
        title: data.mimeTypeErrorDialog?.title ?? (data.multiple ? 'Error adding files' : 'Error adding file'),
        confirmButtonLabel: data.mimeTypeErrorDialog?.confirmButtonLabel,
        cancelButtonLabel: data.mimeTypeErrorDialog?.cancelButtonLabel,
        requireConfirmation: data.mimeTypeErrorDialog?.requireConfirmation,
        confirmationText: data.mimeTypeErrorDialog?.confirmationText
    };
}

/**
 * Gets the default dialog data for the error dialog to display
 * when the user tries to add a single file that is bigger than the allowed maxSize.
 *
 * @param data - The File Decorator data.
 * @returns The dialog data with set default values.
 */
function getDefaultMaxSizeTotalErrorDialogData(data: DefaultFileDecoratorConfig | ImageFileDecoratorConfig): ConfirmDialogData {
    return {
        type: data.mimeTypeErrorDialog?.type ?? 'info-only',
        // eslint-disable-next-line max-len
        text: data.mimeTypeErrorDialog?.text ?? ['The size of all files combined is too big'],
        title: data.mimeTypeErrorDialog?.title ?? (data.multiple ? 'Error adding files' : 'Error adding file'),
        confirmButtonLabel: data.mimeTypeErrorDialog?.confirmButtonLabel,
        cancelButtonLabel: data.mimeTypeErrorDialog?.cancelButtonLabel,
        requireConfirmation: data.mimeTypeErrorDialog?.requireConfirmation,
        confirmationText: data.mimeTypeErrorDialog?.confirmationText
    };
}