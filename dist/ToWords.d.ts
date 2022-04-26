import { ConstructorOf, ConverterOptions, LocaleInterface, ToWordsOptions } from './types';
export declare const DefaultConverterOptions: ConverterOptions;
export declare const DefaultToWordsOptions: ToWordsOptions;
export declare class ToWords {
    private options;
    private locale;
    constructor(options?: ToWordsOptions);
    /**
     * getting language locale class based on user
     * passed config options
     * It contains the mapping for currency, texts and
     * numberToWord mapping
     *
     * @returns {class} - based on selected currency
     */
    getLocaleClass(): ConstructorOf<LocaleInterface>;
    /**
     * Instantiating the passed user currency local option in configuration
     * object
     * @returns {class}
     */
    getLocale(): InstanceType<ConstructorOf<LocaleInterface>>;
    /**
     *
     * @param number - user input number to be converted
     * @param options - configuration set by user
     * @returns {string} - converted number to words string
     */
    convert(number: number, options?: ConverterOptions): string;
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
}
