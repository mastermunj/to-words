import { ConstructorOf, ConverterOptions, LocaleInterface, NumberWordMap, ToWordsOptions } from './types';
import LOCALES from './locales';

export { LOCALES };

export const DefaultConverterOptions: ConverterOptions = {
  currency: false,
  ignoreDecimal: false,
  ignoreZeroCurrency: false,
  doNotAddOnly: false,
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
    const localeConfig = locale.config;

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) {
      number = Math.abs(number);
    }

    const isFloat = this.isFloat(number);
    let integerPart = Math.trunc(number);
    let fractionalPart = '';
    if (isFloat) {
      const segments = number.toString().split('.');
      integerPart = Number(segments[0]);
      fractionalPart = segments[1] ?? '';
    }

    const ignoreZero = this.isNumberZero(number) && localeConfig.ignoreZeroInDecimals;
    let words = this.convertInternal(integerPart, true, undefined, locale);
    if (isFloat && ignoreZero) {
      words = [];
    }

    const wordsWithDecimal: string[] = [];
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(localeConfig.texts.point);
      }
      if (fractionalPart.startsWith('0') && !localeConfig?.decimalLengthWordMapping) {
        const zeroWords: string[] = [];
        for (const num of fractionalPart) {
          zeroWords.push(...this.convertInternal(Number(num), true, undefined, locale));
        }
        wordsWithDecimal.push(...zeroWords);
      } else if (fractionalPart.length) {
        wordsWithDecimal.push(...this.convertInternal(Number(fractionalPart), true, undefined, locale));
        const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];
        if (decimalLengthWord) {
          wordsWithDecimal.push(decimalLengthWord);
        }
      }
    }
    const isEmpty = words.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(localeConfig.texts.minus);
    }
    words.push(...wordsWithDecimal);
    return words;
  }

  protected convertCurrency(number: number, options: ConverterOptions = {}): string[] {
    const locale = this.getLocale();
    const localeConfig = locale.config;

    const currencyOptions = options.currencyOptions ?? localeConfig.currency;

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) {
      number = Math.abs(number);
    }

    number = this.toFixed(number);
    // Extra check for isFloat to overcome 1.999 rounding off to 2
    const isFloat = this.isFloat(number);
    let mainAmount = Math.trunc(number);
    let fractionalPart = '';
    if (isFloat) {
      const segments = number.toString().split('.');
      mainAmount = Number(segments[0]);
      fractionalPart = segments[1] ?? '';
    }
    let words: string[] = [];

    if (currencyOptions.numberSpecificForms?.[mainAmount]) {
      words = [currencyOptions.numberSpecificForms[mainAmount]];
    } else {
      // Determine if the main currency should be in singular form
      // e.g. 1 Dollar Only instead of 1 Dollars Only
      words = [...this.convertInternal(mainAmount, false, undefined, locale)];
      if (mainAmount === 1 && currencyOptions.singular) {
        words.push(currencyOptions.singular);
      } else if (currencyOptions.plural) {
        words.push(currencyOptions.plural);
      }
    }
    const ignoreZero =
      this.isNumberZero(number) && (options.ignoreZeroCurrency || (localeConfig?.ignoreZeroInDecimals && number !== 0));

    if (ignoreZero) {
      words = [];
    }

    const wordsWithDecimal = [];
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(localeConfig.texts.and);
      }
      const decimalBase =
        !localeConfig.decimalLengthWordMapping && fractionalPart.length
          ? Math.pow(10, Math.max(0, 2 - fractionalPart.length))
          : 1;
      const decimalPart = Number(fractionalPart || '0') * decimalBase;

      const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];

      if (currencyOptions.fractionalUnit.numberSpecificForms?.[decimalPart]) {
        wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPart]);
      } else {
        wordsWithDecimal.push(...this.convertInternal(decimalPart, false, undefined, locale));

        if (decimalLengthWord?.length) {
          wordsWithDecimal.push(decimalLengthWord);
        }

        if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.singular);
        } else {
          wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
        }
      }
    } else if (localeConfig.decimalLengthWordMapping && words.length) {
      wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
    }
    const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(localeConfig.texts.minus);
    }
    if (!isEmpty && localeConfig.texts.only && !options.doNotAddOnly && !localeConfig.onlyInFront) {
      wordsWithDecimal.push(localeConfig.texts.only);
    }
    if (wordsWithDecimal.length) {
      words.push(...wordsWithDecimal);
    }

    if (!isEmpty && !options.doNotAddOnly && localeConfig.onlyInFront) {
      words.splice(0, 0, localeConfig.texts.only);
    }

    return words;
  }

  protected convertInternal(
    number: number,
    trailing: boolean = false,
    overrides: Record<number, string> = {},
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const locale = localeInstance ?? this.getLocale();
    const localeConfig = locale.config;

    if (overrides[number]) {
      return [overrides[number]];
    }

    if (localeConfig.exactWordsMapping) {
      const exactMatch = localeConfig?.exactWordsMapping?.find((elem) => {
        return number === elem.number;
      });
      if (exactMatch) {
        return [Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value];
      }
    }

    const match = localeConfig.numberWordsMapping.find((elem) => {
      return number >= elem.number;
    }) as NumberWordMap;

    const words: string[] = [];
    if (number <= 100 || (number < 1000 && localeConfig.namedLessThan1000)) {
      words.push(Array.isArray(match.value) ? match.value[0] : match.value);
      number -= match.number;
      if (number > 0) {
        if (localeConfig?.splitWord?.length) {
          words.push(localeConfig.splitWord);
        }
        words.push(...this.convertInternal(number, trailing, overrides, locale));
      }
      return words;
    }

    const quotient = Math.floor(number / match.number);
    const remainder = number % match.number;
    let matchValue = Array.isArray(match.value) ? match.value[0] : match.value;

    const pluralForms = localeConfig?.pluralForms?.[match.number];
    let usedPluralForm = false;

    if (pluralForms) {
      const lastTwoDigits = quotient % 100;
      const useLastDigits = quotient >= 11 && lastTwoDigits >= 3 && lastTwoDigits <= 10;

      if (quotient === 2 && pluralForms.dual) {
        matchValue = pluralForms.dual;
        usedPluralForm = true;
      } else if (
        (quotient >= (localeConfig?.paucalConfig?.min ?? 3) && quotient <= (localeConfig?.paucalConfig?.max ?? 10)) ||
        useLastDigits
      ) {
        if (pluralForms.paucal) {
          matchValue = pluralForms.paucal;
        }
      } else if (quotient >= 11 && pluralForms.plural) {
        matchValue = pluralForms.plural;
      }
    } else {
      if (quotient > 1 && localeConfig?.pluralWords?.find((word) => word === match.value) && localeConfig?.pluralMark) {
        matchValue += localeConfig.pluralMark;
      }
      if (quotient % 10 === 1) {
        matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
      }
    }

    if ((quotient === 1 && localeConfig?.ignoreOneForWords?.includes(matchValue)) || usedPluralForm) {
      words.push(matchValue);
    } else {
      words.push(...this.convertInternal(quotient, false, overrides, locale), matchValue);
    }

    if (remainder > 0) {
      if (localeConfig?.splitWord?.length) {
        if (!localeConfig?.noSplitWordAfter?.find((word) => word === match.value)) {
          words.push(localeConfig.splitWord);
        }
      }
      words.push(...this.convertInternal(remainder, trailing, overrides, locale));
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
