/**
 * Checks if the given function is async or not.
 *
 * @param originalFunction - The function to check.
 * @returns True when the constructor name is 'AsyncFunction' and false otherwise.
 */
export function isAsyncFunction(originalFunction: Function): boolean {
    return originalFunction.constructor.name === 'AsyncFunction';
}