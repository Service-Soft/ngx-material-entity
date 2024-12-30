import { TableColumnValue } from '../components/table/table-data';

/**
 * Converts the given table column value to a string/number for sorting.
 * This also supports string dates, if you eg. Needed to format them.
 * @param value - The value to convert.
 * @returns A string or a number to sort by.
 * @throws When a value with an unknown type has been provided.
 */
export function tableColumnValueToSortValue(value: TableColumnValue): string | number {
    switch (typeof value) {
        case 'string': {
            const stringDate: Date = new Date(value);
            if (!Number.isNaN(stringDate.getTime())) {
                return stringDate.getTime();
            }
            const number: number = Number.parseFloat(value);
            if (!Number.isNaN(number)) {
                return number;
            }
            return value;
        }
        case 'number': {
            return value;
        }
        case 'object': {
            const date: Date = new Date(value);
            return date.getTime();
        }
        default: {
            throw new Error(`Unsupported type for table value: ${typeof value}`);
        }
    }
}