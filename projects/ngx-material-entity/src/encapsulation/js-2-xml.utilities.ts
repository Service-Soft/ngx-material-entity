import * as js2xml from 'js2xmlparser';

/**
 * Encapsulates functionality of the js2xml package.
 */
export abstract class Js2XmlUtilities {
    /**
     * Returns a XML string representation of the specified object using the specified options.
     * @param root - Name of the xml root element.
     * @param value - The json value to convert. Will be a child of root.
     * @param options - Additional options for the conversion.
     * @returns The converted xml string.
     */
    static parse(root: string, value: unknown, options?: js2xml.IOptions): string {
        return js2xml.parse(root, value, options);
    }
}