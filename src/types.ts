export interface CurrencyOptions {
  name: string;
  plural: string;
  symbol: string;
  fractionalUnit: {
    name: string;
    plural: string;
    symbol: string;
  };
}

export type ConverterOptions = {
  currency?: boolean;
  ignoreDecimal?: boolean;
  ignoreZeroCurrency?: boolean;
  doNotAddOnly?: boolean; // applicable only when currency = true
  currencyOptions?: CurrencyOptions; // applicable only when currency = true, overwrites options from locales
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
  value: string;
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
};

export interface LocaleInterface {
  config: LocaleConfig;
}
