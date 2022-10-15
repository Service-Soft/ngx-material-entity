import JSZip from 'jszip';
// eslint-disable-next-line no-duplicate-imports
import * as JSZipType from 'jszip'; // <-- This is needed to provide type safety.

// TODO: Find a way to use blobs with jest
/* istanbul ignore next */
/**
 * Encapsulates JSZip functionality.
 */
export abstract class JSZipUtilities {
    /**
     * Generates a new JSZip object that is correctly typed.
     *
     * @returns A new JSZip object.
     */
    static new(): JSZipType {
        return new JSZip() as JSZipType;
    }
}