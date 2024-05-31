import { DropdownValue } from '../decorators/base/dropdown-value.interface';

/**
 * Generic Type for all possible values that can be provided as dropdown values.
 */
export type DropdownValues<T> = DropdownValue<T | undefined>[]
    // eslint-disable-next-line typescript/no-explicit-any
    | ((entity: any) => DropdownValue<T | undefined>[])
    // eslint-disable-next-line typescript/no-explicit-any
    | ((entity: any) => Promise<DropdownValue<T | undefined>[]>);

/**
 * Transforms the given dropdown values to an async function.
 * @param dropdownValues - The dropdown values to transform.
 * @returns An abstract function.
 */
// eslint-disable-next-line typescript/no-explicit-any
export function dropdownValuesToFunction<T>(dropdownValues: DropdownValues<T>): (entity: any) => Promise<DropdownValue<T | undefined>[]> {
    if (Array.isArray(dropdownValues)) {
        return async () => dropdownValues;
    }
    // eslint-disable-next-line typescript/no-explicit-any
    return async (e: any) => await dropdownValues(e);
}