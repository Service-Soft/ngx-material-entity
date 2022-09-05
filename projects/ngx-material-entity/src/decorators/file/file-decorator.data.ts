import { ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog-data';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';
import { FileDataWithFile, FileDataWithUrl } from './file-decorator-internal.data';

/**
 * The type of a property annotated with @file.
 */
export type FileData = FileDataWithFile | FileDataWithUrl;

/**
 * Definition for the @file metadata.
 */
abstract class FileDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Specifies whether or not the decorated property can have multiple files.
     */
    multiple!: boolean;

    /**
     * The type of the upload.
     */
    type!: 'image' | 'other';

    /**
     * The class for the <i> tag used to remove a file from the input.
     *
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string;

    /**
     * Whether or not the file should be displayed inside a preview.
     *
     * @default true
     */
    preview?: boolean;

    /**
     * Specifies allowed File types like 'image/jpg' etc.
     * Allows every file type if not set.
     */
    allowedMimeTypes?: string[];

    /**
     * The error dialog to display when the user inputs files that are not of the allowed mime types.
     */
    mimeTypeErrorDialog?: ConfirmDialogData;

    /**
     * The maximum allowed size of a single file in MB.
     *
     * @default 10
     */
    maxSize?: number;

    /**
     * The error dialog to display when the user inputs a single file that is bigger than the 'maxSize' value.
     */
    maxSizeErrorDialog?: ConfirmDialogData;

    /**
     * The maximum allowed size of all files in MB.
     *
     * @default 100
     */
    maxSizeTotal?: number;

    /**
     * The error dialog to display when the user inputs files which are in total bigger than the 'maxSizeTotal' value.
     */
    maxSizeTotalErrorDialog?: ConfirmDialogData;

    /**
     * Defines whether or not a dropdown box is displayed.
     *
     * @default
     * true // when multiple is set to true.
     * false // when multiple is set to false.
     */
    dragAndDrop?: boolean;

    /**
     * The label of the button to download all files.
     * Is only shown when the property contains multiple files.
     *
     * @default 'Download All'
     */
    downloadAllButtonLabel?: string;
}

/**
 * Definition for a default file.
 */
export interface DefaultFileDecoratorConfig extends FileDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'other',
    // eslint-disable-next-line jsdoc/require-jsdoc
    preview?: false
}

/**
 * Definition for a image file.
 */
export interface ImageFileDecoratorConfig extends FileDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'image',
    /**
     * Specifies allowed File types like image/jpg etc. In a comma separated string.
     *
     * @default ['image/*']
     */
    allowedMimeTypes?: string[],
    /**
     * Url to the file that gets displayed in the preview when no file has been selected yet.
     */
    previewPlaceholderUrl?: string
}