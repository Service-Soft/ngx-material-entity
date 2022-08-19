import { BaseEntityType } from './entity.model';

/**
 * The abstract BaseBuilder class.
 */
export abstract class BaseBuilder<InternalType extends InputType, InputType extends BaseEntityType<InputType>> {

    private readonly data: InternalType;
    private readonly inputData?: InputType;

    protected constructor(data?: InputType) {
        this.validateInput(data);
        this.inputData = data;
        this.data = this.generateBaseData(data);
        return this;
    }

    /**
     * Generates the internal data from the given user inputs.
     *
     * @param data - The input from the user.
     * @returns The internal data.
     */
    protected abstract generateBaseData(data?: InputType): InternalType;

    /**
     * Used to validate the user input in the constructor.
     *
     * @param data - The user input.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected validateInput(data?: InputType): void {
        // By default, no validation is done
    }

    /**
     * Sets the value for the given key if no user value was provided.
     *
     * @param key - The key to set the default value for.
     * @param value - The value to set when nothing was provided.
     * @returns The Builder.
     */
    withDefault(key: keyof InputType, value: Omit<InternalType[keyof InputType], 'undefined'>): BaseBuilder<InternalType, InputType> {
        if (this.inputData == null || this.inputData[key] == null) {
            this.data[key] = value as InternalType[keyof InputType];
        }
        return this;
    }

    /**
     * Method used to get the final build value after applying all chaining.
     *
     * @returns The build value.
     */
    getResult(): InternalType {
        return this.data;
    }
}