import { ConstructorOf, ConverterOptions, LocaleInterface, NumberInput, NumberWordMap, ToWordsOptions } from './types';
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

  public convert(number: NumberInput, options: ConverterOptions = {}): string {
    options = Object.assign({}, this.options.converterOptions, options);

    if (!this.isValidNumber(number)) {
      throw new Error(`Invalid Number "${number}"`);
    }

    const isBigInt = typeof number === 'bigint';
    let numericValue: number | bigint = isBigInt ? number : Number(number);

    if (options.ignoreDecimal && !isBigInt) {
      numericValue = Number.parseInt(numericValue.toString());
    }

    let words: string[] = [];
    if (options.currency) {
      words = this.convertCurrency(numericValue, options);
    } else {
      words = this.convertNumber(numericValue);
    }

    if (this.locale?.config.trim) {
      return words.join('');
    }

    return words.join(' ');
  }

  protected convertNumber(number: number | bigint): string[] {
    const locale = this.getLocale();
    const localeConfig = locale.config;

    const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
    if (isNegativeNumber) {
      number = typeof number === 'bigint' ? -number : Math.abs(number);
    }

    const isBigInt = typeof number === 'bigint';
    const isFloat = !isBigInt && this.isFloat(number as number);
    let integerPart: bigint;
    let fractionalPart = '';

    if (isBigInt) {
      integerPart = number as bigint;
    } else if (isFloat) {
      const segments = number.toString().split('.');
      integerPart = BigInt(segments[0]);
      fractionalPart = segments[1] ?? '';
    } else {
      integerPart = BigInt(Math.trunc(number as number));
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
          zeroWords.push(...this.convertInternal(BigInt(num), true, undefined, locale));
        }
        wordsWithDecimal.push(...zeroWords);
      } else if (fractionalPart.length) {
        wordsWithDecimal.push(...this.convertInternal(BigInt(fractionalPart), true, undefined, locale));
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

  protected convertCurrency(number: number | bigint, options: ConverterOptions = {}): string[] {
    const locale = this.getLocale();
    const localeConfig = locale.config;

    const currencyOptions = options.currencyOptions ?? localeConfig.currency;

    const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
    if (isNegativeNumber) {
      number = typeof number === 'bigint' ? -number : Math.abs(number);
    }

    const isBigInt = typeof number === 'bigint';
    if (!isBigInt) {
      number = this.toFixed(number as number);
    }
    // Extra check for isFloat to overcome 1.999 rounding off to 2
    const isFloat = !isBigInt && this.isFloat(number as number);
    let mainAmount: bigint;
    let fractionalPart = '';

    if (isBigInt) {
      mainAmount = number as bigint;
    } else if (isFloat) {
      const segments = number.toString().split('.');
      mainAmount = BigInt(segments[0]);
      fractionalPart = segments[1] ?? '';
    } else {
      mainAmount = BigInt(Math.trunc(number as number));
    }
    let words: string[] = [];

    const mainAmountNum = mainAmount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(mainAmount) : -1;
    if (mainAmountNum !== -1 && currencyOptions.numberSpecificForms?.[mainAmountNum]) {
      words = [currencyOptions.numberSpecificForms[mainAmountNum]];
    } else {
      // Determine if the main currency should be in singular form
      // e.g. 1 Dollar Only instead of 1 Dollars Only
      words = [...this.convertInternal(mainAmount, false, undefined, locale)];
      if (mainAmount === 1n && currencyOptions.singular) {
        words.push(currencyOptions.singular);
      } else if (currencyOptions.plural) {
        words.push(currencyOptions.plural);
      }
    }
    const ignoreZero =
      this.isNumberZero(number) &&
      (options.ignoreZeroCurrency || (localeConfig?.ignoreZeroInDecimals && number !== 0 && number !== 0n));

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
        wordsWithDecimal.push(...this.convertInternal(BigInt(decimalPart), false, undefined, locale));

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
    number: bigint,
    trailing: boolean = false,
    overrides: Record<number, string> = {},
    localeInstance?: InstanceType<ConstructorOf<LocaleInterface>>,
  ): string[] {
    const locale = localeInstance ?? this.getLocale();
    const localeConfig = locale.config;

    const numberAsNum = number <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(number) : -1;
    if (numberAsNum !== -1 && overrides[numberAsNum]) {
      return [overrides[numberAsNum]];
    }

    if (localeConfig.exactWordsMapping) {
      const exactMatch = localeConfig?.exactWordsMapping?.find((elem) => {
        return number === BigInt(elem.number);
      });
      if (exactMatch) {
        return [Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value];
      }
    }

    const match = localeConfig.numberWordsMapping.find((elem) => {
      return number >= BigInt(elem.number);
    }) as NumberWordMap;

    const matchNumber = BigInt(match.number);
    const words: string[] = [];
    if (number <= 100n || (number < 1000n && localeConfig.namedLessThan1000)) {
      words.push(Array.isArray(match.value) ? match.value[0] : match.value);
      number -= matchNumber;
      if (number > 0n) {
        if (localeConfig?.splitWord?.length) {
          words.push(localeConfig.splitWord);
        }
        words.push(...this.convertInternal(number, trailing, overrides, locale));
      }
      return words;
    }

    const quotient = number / matchNumber;
    const remainder = number % matchNumber;
    let matchValue = Array.isArray(match.value) ? match.value[0] : match.value;

    const matchNumberNum = Number(matchNumber);
    const pluralForms = localeConfig?.pluralForms?.[matchNumberNum];
    let usedPluralForm = false;

    if (pluralForms) {
      const lastTwoDigits = Number(quotient % 100n);
      const useLastDigits = quotient >= 11n && lastTwoDigits >= 3 && lastTwoDigits <= 10;

      if (quotient === 2n && pluralForms.dual) {
        matchValue = pluralForms.dual;
        usedPluralForm = true;
      } else if (
        (quotient >= BigInt(localeConfig?.paucalConfig?.min ?? 3) &&
          quotient <= BigInt(localeConfig?.paucalConfig?.max ?? 10)) ||
        useLastDigits
      ) {
        if (pluralForms.paucal) {
          matchValue = pluralForms.paucal;
        }
      } else if (quotient >= 11n && pluralForms.plural) {
        matchValue = pluralForms.plural;
      }
    } else {
      if (
        quotient > 1n &&
        localeConfig?.pluralWords?.find((word) => word === match.value) &&
        localeConfig?.pluralMark
      ) {
        matchValue += localeConfig.pluralMark;
      }
      if (quotient % 10n === 1n) {
        matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
      }
    }

    if ((quotient === 1n && localeConfig?.ignoreOneForWords?.includes(matchValue)) || usedPluralForm) {
      words.push(matchValue);
    } else {
      words.push(...this.convertInternal(quotient, false, overrides, locale), matchValue);
    }

    if (remainder > 0n) {
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

  public isValidNumber(number: NumberInput): boolean {
    if (typeof number === 'bigint') {
      return true;
    }
    return !isNaN(parseFloat(number as string)) && isFinite(number as number);
  }

  public isNumberZero(number: number | bigint): boolean {
    if (typeof number === 'bigint') {
      return number === 0n;
    }
    return number >= 0 && number < 1;
  }
}
