export interface CurrencyOptions {
    name: string;
    plural: string;
    symbol: string;
    singular?: string;
    numberSpecificForms?: Record<number, string>;
    fractionalUnit: {
        name: string;
        plural: string;
        singular?: string;
        numberSpecificForms?: Record<number, string>;
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
export type OrdinalOptions = {
    gender?: 'masculine' | 'feminine';
};
export type ToWordsOptions = {
    localeCode?: string;
    converterOptions?: ConverterOptions;
};
export interface ConstructorOf<T> {
    new (...args: unknown[]): T;
}
export type NumberWordMap = {
    number: number | bigint;
    value: string | [string, string];
    singularValue?: string;
};
export type OrdinalWordMap = {
    number: number;
    value: string;
};
export type NumberInput = number | bigint | string;
export type PluralFormsMapping = {
    [scaleNumber: number]: {
        dual?: string;
        paucal?: string;
        plural?: string;
    };
};
export type PaucalConfig = {
    min: number;
    max: number;
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
    ordinalWordsMapping?: OrdinalWordMap[];
    ordinalSuffix?: string;
    ordinalExactWordsMapping?: OrdinalWordMap[];
    namedLessThan1000?: boolean;
    splitWord?: string;
    ignoreZeroInDecimals?: boolean;
    decimalLengthWordMapping?: Record<number, string>;
    ignoreOneForWords?: string[];
    pluralMark?: string;
    pluralWords?: string[];
    pluralForms?: PluralFormsMapping;
    paucalConfig?: PaucalConfig;
    noSplitWordAfter?: string[];
    onlyInFront?: boolean;
    trim?: boolean;
};
export interface LocaleInterface {
    config: LocaleConfig;
}
