import { ConstructorOf, ConverterOptions, LocaleInterface, NumberInput, OrdinalOptions, ToWordsOptions } from './types';
import LOCALES from './locales';
export { LOCALES };
export declare const DefaultConverterOptions: ConverterOptions;
export declare const DefaultToWordsOptions: ToWordsOptions;
export declare class ToWords {
    private options;
    private locale;
    constructor(options?: ToWordsOptions);
    getLocaleClass(): ConstructorOf<LocaleInterface>;
    getLocale(): InstanceType<ConstructorOf<LocaleInterface>>;
    private initLocaleCache;
    private getLocaleCache;
    convert(number: NumberInput, options?: ConverterOptions): string;
    toOrdinal(number: NumberInput, options?: OrdinalOptions): string;
    protected convertOrdinal(number: number, _options: OrdinalOptions, localeInstance: InstanceType<ConstructorOf<LocaleInterface>>): string[];
    protected getLastNumberComponent(number: number, localeConfig: LocaleInterface['config']): number;
    protected convertNumber(number: number | bigint): string[];
    protected convertCurrency(number: number | bigint, options?: ConverterOptions): string[];
    protected convertInternal(number: bigint, trailing?: boolean, overrides?: Record<number, string>, localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>): string[];
    /**
     * Binary search on a descending-sorted array of CachedNumberWordMap.
     * Finds the first element where numberBigInt <= target.
     */
    private binarySearchDescending;
    toFixed(number: number, precision?: number): number;
    isFloat(number: number | string): boolean;
    isValidNumber(number: NumberInput): boolean;
    isNumberZero(number: number | bigint): boolean;
}
