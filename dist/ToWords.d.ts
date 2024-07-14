import { ConstructorOf, ConverterOptions, LocaleInterface, ToWordsOptions } from './types';
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
    convert(number: number, options?: ConverterOptions): string;
    protected convertNumber(number: number): string[];
    protected convertCurrency(number: number, options?: ConverterOptions): string[];
    protected convertInternal(number: number, trailing?: boolean): string[];
    toFixed(number: number, precision?: number): number;
    isFloat(number: number | string): boolean;
    isValidNumber(number: number | string): boolean;
    isNumberZero(number: number): boolean;
}
