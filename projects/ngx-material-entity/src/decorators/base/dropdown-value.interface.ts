/**
 * The definition for a dropdown value.
 * Consists of the name to display in the dropdown and the actual value.
 */
export interface DropdownValue<T> {
    /**
     * The name to display in the dropdown.
     */
    displayName: string,
    /**
     * The actual value.
     */
    value: T
}