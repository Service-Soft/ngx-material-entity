import { Js2XmlUtilities } from '../../encapsulation/js-2-xml.utilities';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../encapsulation/reflect.utilities';
import { BaseEntityType } from '../../public-api';
import { FileUtilities } from '../../utilities/file.utilities';

const CSV_SEPARATOR: string = ';';

/**
 * A multi select action that exports the data as a json file.
 *
 * @param selectedEntities - The selected entities to export.
 */
export function exportAsJsonMultiAction<EntityType extends BaseEntityType<EntityType>>(selectedEntities: EntityType[]): void {
    const blob: Blob = new Blob([JSON.stringify(selectedEntities, null, '\t')], { type: '.json' });
    FileUtilities.downLoadBlob(blob, 'export.json');
}

/**
 * A multi select action that exports the data as a csv file.
 * Object values get stringified.
 *
 * @param selectedEntities - The selected entities to export.
 */
export function exportAsCsvMultiAction<EntityType extends BaseEntityType<EntityType>>(selectedEntities: EntityType[]): void {
    const blob: Blob = new Blob([convertToCsv(selectedEntities, ReflectUtilities.ownKeys(selectedEntities[0]))], { type: '.csv' });
    FileUtilities.downLoadBlob(blob, 'export.csv');
}

/**
 * A multi select action that exports the data as a xml file.
 * Object values get stringified.
 *
 * @param selectedEntities - The selected entities to export.
 */
export function exportAsXmlMultiAction<EntityType extends BaseEntityType<EntityType>>(selectedEntities: EntityType[]): void {
    const xmlString: string = Js2XmlUtilities.parse('values', selectedEntities);
    const blob: Blob = new Blob([xmlString], { type: '.xml' });
    FileUtilities.downLoadBlob(blob, 'export.xml');
}

// eslint-disable-next-line jsdoc/require-jsdoc
function convertToCsv<EntityType extends BaseEntityType<EntityType>>(array: EntityType[], headerList: (keyof EntityType)[]): string {
    const headerRow: string = headerList.join(CSV_SEPARATOR);
    let result: string = headerRow + '\r\n';
    for (const entity of array) {
        result += getLineForEntity<EntityType>(headerList, entity) + '\r\n';
    }
    return result;
}


// eslint-disable-next-line jsdoc/require-jsdoc
function getLineForEntity<EntityType extends BaseEntityType<EntityType>>(headerList: (keyof EntityType)[], entity: EntityType): string {
    let line: string = '';
    for (const head of headerList) {
        line = line += getLineForHeader<EntityType>(entity, head);
    }
    line.slice(0, line.length - 1);
    return line;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function getLineForHeader<EntityType extends BaseEntityType<EntityType>>(entity: EntityType, head: keyof EntityType): string {
    const value: unknown = entity[head];
    if (LodashUtilities.isObject(value)) {
        return `${JSON.stringify(value)}${CSV_SEPARATOR}`;
    }
    if (LodashUtilities.isArray(value) && LodashUtilities.isObject(value[0])) {
        return `${value.map(v => JSON.stringify(v))}${CSV_SEPARATOR}`;
    }
    return `${entity[head]}${CSV_SEPARATOR}`;
}