import { ConstructorOf, ConverterOptions, LocaleInterface, ToWordsOptions } from './types';
export declare const DefaultConverterOptions: ConverterOptions;
export declare const DefaultToWordsOptions: ToWordsOptions;
export declare class ToWords {
    private options;
    private locale;
    constructor(options?: ToWordsOptions);
    /**
     * Get locale class for the locale passed in the options.
     * @returns {class} - based on selected currency
     */
    getLocaleClass(): ConstructorOf<LocaleInterface>;
    /**
     * Create instance of the locale class.
     *
     * @returns {class}
     */
    getLocale(): InstanceType<ConstructorOf<LocaleInterface>>;
    /**
     *
     * @param number - The number to be converted into the words.
     * @param options - Converter Options object.
     * @returns {string} - converted number to words
     */
    convert(number: number | string, options?: ConverterOptions): string;
    /**
     *
     * @param number
     * @returns {Array<string>} converted words as array of strings
     */
    protected convertNumber(number: number): string[];
    protected convertCurrency(number: number, options?: ConverterOptions): string[];
    protected convertInternal(number: number): string[];
    toFixed(number: number, precision?: number): number;
    isFloat(number: number | string): boolean;
    isValidNumber(number: number | string): boolean;
    isNumberZero(number: number): boolean;
    clean(value: string | number): number;
}
