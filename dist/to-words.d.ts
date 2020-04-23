import { LocaleInterface } from './locales/locale.interface';
declare type ConverterOptions = {
    currency?: boolean;
    ignoreDecimal?: boolean;
    ignoreZeroCurrency?: boolean;
};
declare type ToWordsOptions = {
    localeCode?: string;
    converterOptions?: ConverterOptions;
};
export declare class ToWords {
    private options;
    private locale;
    constructor(options?: ToWordsOptions);
    private getLocaleClass;
    getLocale(): LocaleInterface;
    convert(number: number, options?: ConverterOptions): string;
    private convertInternal;
    toFixed(number: number, precision?: number): number;
    isFloat(number: number | string): boolean;
    isValidNumber(number: number | string): boolean;
}
export {};
