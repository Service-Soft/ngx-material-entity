import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { FileDataWithFile } from '../decorators/file/file-decorator-internal.data';
import { FileData } from '../decorators/file/file-decorator.data';
import { JSZipUtilities } from '../encapsulation/jszip.utilities';
import JSZip from 'jszip';

/**
 * Provides functionality regarding files.
 */
export abstract class FileUtilities {
    /**
     * Gets the accept value for the html input.
     *
     * @param mimeTypes - The mimeTypes to get the accept string from.
     * @returns A comma separated string of all the provided mime types.
     */
    static getAcceptString(mimeTypes?: string[]): string {
        if (!mimeTypes?.length) {
            return '*';
        }
        return mimeTypes.join(', ');
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Reads a url to display the given file.
     *
     * @param file - The file to get the url from.
     * @returns A promise of the url. Undefined if no file was provided.
     */
    static async getDataURLFromFile(file?: Blob): Promise<string | undefined> {
        if (!file) {
            return undefined;
        }
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.onload = e => resolve(e.target?.result as string);
            reader.onerror = e => reject(e);
            reader.readAsDataURL(file);
        });
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Gets a file from the given url.
     *
     * @param url - The url to get the file from.
     * @returns A promise of the File.
     */
    private static async getFileFromUrl(url: string): Promise<Blob> {
        const res: Response = await fetch(url);
        if (!res.ok) {
            // TODO make error more robust
            throw new Error(`Error fetching the file from the url ${url}`);
        }
        return await res.blob();
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Gets the file data with the blob from the given File Data.
     *
     * @param data - The File Data to get the file data with blob from.
     * @returns FileDataWithFile.
     */
    static async getFileData(data: FileData): Promise<FileDataWithFile> {
        if (data.file) {
            return {
                file: data.file,
                name: data.name,
                url: data.url,
                type: data.type,
                size: data.size
            };
        }
        else {
            return {
                file: await FileUtilities.getFileFromUrl(data.url as string),
                name: data.name,
                url: data.url,
                type: data.type,
                size: data.size
            };
        }
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Downloads a single file from the given File Data.
     *
     * @param fileData - The file data. Needs to contain a blob.
     */
    static downloadSingleFile(fileData: FileDataWithFile): void {
        const a: HTMLAnchorElement = document.createElement('a');
        const objectUrl: string = URL.createObjectURL(fileData.file);
        a.href = objectUrl;
        a.download = fileData.name;
        a.click();
        URL.revokeObjectURL(objectUrl);
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Downloads multiple files as a zip with the given name.
     *
     * @param name - The name of the zip file to generate.
     * @param multiFileData - The file data array to put in the zip.
     */
    static async downloadMultipleFiles(name: string, multiFileData: FileData[]): Promise<void> {
        const zip: JSZip = JSZipUtilities.new();
        for (let i: number = 0; i < multiFileData.length; i++) {
            multiFileData[i] = await FileUtilities.getFileData(multiFileData[i]);
            zip.file(multiFileData[i].name, (multiFileData[i] as FileDataWithFile).file);
        }
        const zipBlob: Blob = await zip.generateAsync({ type: 'blob' });
        const fileData: FileDataWithFile = {
            name: name,
            file: zipBlob,
            type: 'application/zip',
            size: zipBlob.size
        };
        FileUtilities.downloadSingleFile(fileData);
    }

    /**
     * Checks if the given file has a valid mime type.
     *
     * @param type - The type of the file to check.
     * @param allowedMimeTypes - The allowed mime types.
     * @returns Whether or not the given file has a valid mime type.
     */
    static isMimeTypeValid(type: string, allowedMimeTypes: string[]): boolean {
        if (allowedMimeTypes.includes('*')) {
            return true;
        }
        for (const t of allowedMimeTypes) {
            if (t === type) {
                return true;
            }
            if (t.endsWith('*') && type.startsWith(t.split('*')[0])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Transform the given value to Megabytes.
     *
     * @param value - The original value.
     * @param unit - If the value is B, KB or GB.
     * @returns The given value as bytes.
     */
    static transformToMegaBytes(value: number, unit: 'B' | 'KB' | 'GB'): number {
        const bytes: number = this.transformToBytes(LodashUtilities.cloneDeep(value), unit);
        return bytes / 1000000;
    }

    private static transformToBytes(value: number, unit: 'B' | 'KB' | 'GB'): number {
        switch (unit) {
            case 'B':
                return value;
            case 'KB':
                return value * 1000;
            case 'GB':
                return value * 1000000000;
        }
    }
}