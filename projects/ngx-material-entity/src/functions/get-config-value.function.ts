import { CONFIG_NEEDS_UPDATE_KEY } from '../default-global-configuration-values';

/**
 * Gets either the provided value or the default value, depending on if and what has been provided.
 * @param defaultValue - The default value to fallback when nothing has been provided.
 * @param value - The specific value configured by the user.
 * @returns Value if it is not null and not the CONFIG_NEEDS_UPDATE_KEY, defaultValue otherwise.
 */
export function getConfigValue<ValueType>(defaultValue: ValueType, value?: ValueType): ValueType {
    if (value != null && value !== CONFIG_NEEDS_UPDATE_KEY) {
        return value;
    }
    return defaultValue;
}