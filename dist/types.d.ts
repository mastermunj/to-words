export interface CurrencyOptions {
    name: string;
    plural: string;
    symbol: string;
    singular?: string;
    fractionalUnit: {
        name: string;
        plural: string;
        singular?: string;
        symbol: string;
    };
}
export type ConverterOptions = {
    currency?: boolean;
    ignoreDecimal?: boolean;
    ignoreZeroCurrency?: boolean;
    doNotAddOnly?: boolean;
    currencyOptions?: CurrencyOptions;
};
export type ToWordsOptions = {
    localeCode?: string;
    converterOptions?: ConverterOptions;
};
export interface ConstructorOf<T> {
    new (...args: unknown[]): T;
}
export type NumberWordMap = {
    number: number;
    value: string | [string, string];
};
export type LocaleConfig = {
    currency: CurrencyOptions;
    texts: {
        and: string;
        minus: string;
        only: string;
        point: string;
    };
    numberWordsMapping: NumberWordMap[];
    exactWordsMapping?: NumberWordMap[];
    namedLessThan1000?: boolean;
    splitWord?: string;
    ignoreZeroInDecimals?: boolean;
    decimalLengthWordMapping?: Record<number, string>;
    ignoreOneForWords?: string[];
    pluralMark?: string;
    pluralWords?: string[];
    noSplitWordAfter?: string[];
    onlyInFront?: boolean;
    trim?: boolean;
};
export interface LocaleInterface {
    config: LocaleConfig;
}
