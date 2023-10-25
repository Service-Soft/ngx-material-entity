import JSZip from 'jszip';

// eslint-disable-next-line jsdoc/require-jsdoc
export type Zip = JSZip;

// TODO: Find a way to use blobs with jest
/* istanbul ignore next */
/**
 * Encapsulates JSZip functionality.
 */
export abstract class JSZipUtilities {
    /**
     * Generates a new JSZip object that is correctly typed.
     * @returns A new JSZip object.
     */
    static new(): Zip {
        return new JSZip();
    }
}