import { ConstructorOf, ConverterOptions, LocaleInterface, NumberWordMap, ToWordsOptions } from './types';
import LOCALES from './locales';

export { LOCALES };

export const DefaultConverterOptions: ConverterOptions = {
  currency: false,
  ignoreDecimal: false,
  ignoreZeroCurrency: false,
  doNotAddOnly: false,
  readZeroDecimal: false,
};

export const DefaultToWordsOptions: ToWordsOptions = {
  localeCode: 'en-IN',
  converterOptions: DefaultConverterOptions,
};

export class ToWords {
  private options: ToWordsOptions = {};

  private locale: InstanceType<ConstructorOf<LocaleInterface>> | undefined = undefined;

  constructor(options: ToWordsOptions = {}) {
    this.options = Object.assign({}, DefaultToWordsOptions, options);
  }

  public getLocaleClass(): ConstructorOf<LocaleInterface> {
    if (!(this.options.localeCode! in LOCALES)) {
      throw new Error(`Unknown Locale "${this.options.localeCode}"`);
    }
    return LOCALES[this.options.localeCode!];
  }

  public getLocale(): InstanceType<ConstructorOf<LocaleInterface>> {
    if (this.locale === undefined) {
      const LocaleClass = this.getLocaleClass();
      this.locale = new LocaleClass();
    }
    return this.locale;
  }

  public convert(number: number, options: ConverterOptions = {}): string {
    options = Object.assign({}, this.options.converterOptions, options);

    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${number}"`);
    }

    if (options.ignoreDecimal) {
      number = Number.parseInt(number.toString());
    }

    let words: string[] = [];
    if (options.currency) {
      words = this.convertCurrency(number, options);
    } else {
      words = this.convertNumber(number);
    }

    if (this.locale?.config.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  protected convertNumber(number: number): string[] {
    const locale = this.getLocale();

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) {
      number = Math.abs(number);
    }

    const split = number.toString().split('.');
    const ignoreZero = this.isNumberZero(number) && locale.config.ignoreZeroInDecimals;
    let words = this.convertInternal(Number(split[0]), true);
    const isFloat = this.isFloat(number);
    if (isFloat && ignoreZero) {
      words = [];
    }
    const wordsWithDecimal = [];
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(locale.config.texts.point);
      }
      if (split[1].startsWith('0') && !locale.config?.decimalLengthWordMapping) {
        const zeroWords = [];
        for (const num of split[1]) {
          zeroWords.push(...this.convertInternal(Number(num), true));
        }
        wordsWithDecimal.push(...zeroWords);
      } else {
        wordsWithDecimal.push(...this.convertInternal(Number(split[1]), true));
        const decimalLengthWord = locale.config?.decimalLengthWordMapping?.[split[1].length];
        if (decimalLengthWord) {
          wordsWithDecimal.push(decimalLengthWord);
        }
      }
    }
    const isEmpty = words.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(locale.config.texts.minus);
    }
    words.push(...wordsWithDecimal);
    return words;
  }

  protected convertCurrency(number: number, options: ConverterOptions = {}): string[] {
    const locale = this.getLocale();
    const currencyOptions = options.currencyOptions ?? locale.config.currency;

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) number = Math.abs(number);

    const fixed = Number(number).toFixed(2);
    const [mainStr, decStr = '00'] = fixed.split('.');
    const mainAmount = Number(mainStr);
    const decimalPart = Number(decStr);

    let words: string[] = [];

    if (currencyOptions.numberSpecificForms?.[mainAmount]) {
      words = [currencyOptions.numberSpecificForms[mainAmount]];
    } else {
      words = [...this.convertInternal(mainAmount, false)];
      if (mainAmount === 1 && currencyOptions.singular) words.push(currencyOptions.singular);
      else if (currencyOptions.plural) words.push(currencyOptions.plural);
    }

    const ignoreZero =
      this.isNumberZero(Number(fixed)) &&
      (options.ignoreZeroCurrency || (locale.config?.ignoreZeroInDecimals && Number(fixed) !== 0));

    if (ignoreZero) words = [];

    const shouldReadDecimals = options.readZeroDecimal ? true : decimalPart !== 0;
    if (shouldReadDecimals && currencyOptions.fractionalUnit?.plural) {
      if (words.length) words.push(locale.config.texts.and);

      if (currencyOptions.fractionalUnit.numberSpecificForms?.[decimalPart]) {
        words.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPart]);
      } else {
        words.push(...this.convertInternal(decimalPart, false));
        if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
          words.push(currencyOptions.fractionalUnit.singular);
        } else {
          words.push(currencyOptions.fractionalUnit.plural);
        }
      }
    }

    if (words.length && locale.config.texts.only && !options.doNotAddOnly && !locale.config.onlyInFront) {
      words.push(locale.config.texts.only);
    }
    if (words.length && !options.doNotAddOnly && locale.config.onlyInFront) {
      words.unshift(locale.config.texts.only);
    }
    if (isNegativeNumber && words.length) words.unshift(locale.config.texts.minus);

    return words;
  }
  protected convertInternal(
    number: number,
    trailing: boolean = false,
    overrides: Record<number, string> = {},
  ): string[] {
    const locale = this.getLocale();

    if (overrides[number]) {
      return [overrides[number]];
    }

    if (locale.config.exactWordsMapping) {
      const exactMatch = locale.config?.exactWordsMapping?.find((elem) => {
        return number === elem.number;
      });
      if (exactMatch) {
        return [Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value];
      }
    }

    const match = locale.config.numberWordsMapping.find((elem) => {
      return number >= elem.number;
    }) as NumberWordMap;

    const words: string[] = [];
    if (number <= 100 || (number < 1000 && locale.config.namedLessThan1000)) {
      words.push(Array.isArray(match.value) ? match.value[0] : match.value);
      number -= match.number;
      if (number > 0) {
        if (locale.config?.splitWord?.length) {
          words.push(locale.config.splitWord);
        }
        words.push(...this.convertInternal(number, trailing, overrides));
      }
      return words;
    }

    const quotient = Math.floor(number / match.number);
    const remainder = number % match.number;
    let matchValue = Array.isArray(match.value) ? match.value[0] : match.value;

    const pluralForms = locale.config?.pluralForms?.[match.number];
    let usedPluralForm = false;

    if (pluralForms) {
      const lastTwoDigits = quotient % 100;
      const useLastDigits = quotient >= 11 && lastTwoDigits >= 3 && lastTwoDigits <= 10;

      if (quotient === 2 && pluralForms.dual) {
        matchValue = pluralForms.dual;
        usedPluralForm = true;
      } else if (
        (quotient >= (locale.config?.paucalConfig?.min ?? 3) && quotient <= (locale.config?.paucalConfig?.max ?? 10)) ||
        useLastDigits
      ) {
        if (pluralForms.paucal) {
          matchValue = pluralForms.paucal;
        }
      } else if (quotient >= 11 && pluralForms.plural) {
        matchValue = pluralForms.plural;
      }
    } else {
      if (
        quotient > 1 &&
        locale.config?.pluralWords?.find((word) => word === match.value) &&
        locale.config?.pluralMark
      ) {
        matchValue += locale.config.pluralMark;
      }
      if (quotient % 10 === 1) {
        matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
      }
    }

    if ((quotient === 1 && locale.config?.ignoreOneForWords?.includes(matchValue)) || usedPluralForm) {
      words.push(matchValue);
    } else {
      words.push(...this.convertInternal(quotient, false, overrides), matchValue);
    }

    if (remainder > 0) {
      if (locale.config?.splitWord?.length) {
        if (!locale.config?.noSplitWordAfter?.find((word) => word === match.value)) {
          words.push(locale.config.splitWord);
        }
      }
      words.push(...this.convertInternal(remainder, trailing, overrides));
    }
    return words;
  }

  public toFixed(number: number, precision = 2): number {
    return Number(Number(number).toFixed(precision));
  }

  public isFloat(number: number | string): boolean {
    return Number(number) === number && number % 1 !== 0;
  }

  public isValidNumber(number: number | string): boolean {
    return !isNaN(parseFloat(number as string)) && isFinite(number as number);
  }

  public isNumberZero(number: number): boolean {
    return number >= 0 && number < 1;
  }
}
