// TODO: Move to entity model

/**
 * JSON serializable object.
 */
type Base = {
    [key: string]: unknown
};

/**
 * Creates a new type, that mimics O exactly,
 * except replaces every unsupported value type by union of supported ones.
 */
// eslint-disable-next-line @typescript-eslint/no-type-alias
type RestrictedObject<O, AllowedTypes> = {
    [P in keyof O]: O[P] extends AllowedTypes
      ? O[P]
      : Record<string, never> extends AllowedTypes
      ? O[P] extends Record<string, unknown> ? RestrictedObject<O[P], AllowedTypes>
      : AllowedTypes : AllowedTypes;
};

/**
 * Create wrapper for restricting objects by the Json type.
 */
export type RestrictedJsonObject<T> = RestrictedObject<T, Base[keyof Base]>