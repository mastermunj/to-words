import { ConstructorOf, ConverterOptions, LocaleInterface, NumberInput, ToWordsOptions } from './types';
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
    convert(number: NumberInput, options?: ConverterOptions): string;
    protected convertNumber(number: number | bigint): string[];
    protected convertCurrency(number: number | bigint, options?: ConverterOptions): string[];
    protected convertInternal(number: bigint, trailing?: boolean, overrides?: Record<number, string>, localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>): string[];
    toFixed(number: number, precision?: number): number;
    isFloat(number: number | string): boolean;
    isValidNumber(number: NumberInput): boolean;
    isNumberZero(number: number | bigint): boolean;
}
