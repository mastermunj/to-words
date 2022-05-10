import { ConstructorOf, ConverterOptions, LocaleInterface, NumberWordMap, ToWordsOptions } from './types';
import enBd from './locales/en-BD';
import enGh from './locales/en-GH';
import enIn from './locales/en-IN';
import enMm from './locales/en-MM';
import enMu from './locales/en-MU';
import enNg from './locales/en-NG';
import enUs from './locales/en-US';
import enGb from './locales/en-GB';
import faIr from './locales/fa-IR';
import frFr from './locales/fr-FR';
import guIn from './locales/gu-IN';
import hiIn from './locales/hi-IN';
import mrIn from './locales/mr-IN';
import trTr from './locales/tr-TR';
import nlSr from './locales/nl-SR';

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

  /**
   * Get locale class for the locale passed in the options.
   * @returns {class} - based on selected currency
   */

  public getLocaleClass(): ConstructorOf<LocaleInterface> {
    /* eslint-disable @typescript-eslint/no-var-requires */
    switch (this.options.localeCode) {
      case 'en-BD':
        return enBd;
      case 'en-GH':
        return enGh;
      case 'en-IN':
        return enIn;
      case 'en-MM':
        return enMm;
      case 'en-MU':
        return enMu;
      case 'en-NG':
        return enNg;
      case 'en-US':
        return enUs;
      case 'en-GB':
        return enGb;
      case 'fa-IR':
        return faIr;
      case 'fr-FR':
        return frFr;
      case 'gu-IN':
        return guIn;
      case 'hi-IN':
        return hiIn;
      case 'mr-IN':
        return mrIn;
      case 'tr-TR':
        return trTr;
      case 'nl-SR':
        return nlSr;
    }
    /* eslint-enable @typescript-eslint/no-var-requires */
    throw new Error(`Unknown Locale "${this.options.localeCode}"`);
  }

  /**
   * Create instance of the locale class.
   *
   * @returns {class}
   */
  public getLocale(): InstanceType<ConstructorOf<LocaleInterface>> {
    if (this.locale === undefined) {
      const LocaleClass = this.getLocaleClass();
      this.locale = new LocaleClass();
    }
    return this.locale;
  }

  /**
   *
   * @param number - The number to be converted into the words.
   * @param options - Converter Options object.
   * @returns {string} - converted number to words
   */
  public convert(number: number | string, options: ConverterOptions = {}): string {
    options = Object.assign({}, this.options.converterOptions, options);

    //check type of the user input and replace any commas
    // and convert the input to number if string
    number = this.clean(number);

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
    return words.join(' ');
  }

  /**
   *
   * @param number
   * @returns {Array<string>} converted words as array of strings
   */
  protected convertNumber(number: number): string[] {
    const locale = this.getLocale();

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) {
      number = Math.abs(number);
    }

    const split = number.toString().split('.');
    const ignoreZero = this.isNumberZero(number) && locale.config.ignoreZeroInDecimals;
    let words = this.convertInternal(Number(split[0]));
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
          zeroWords.push(...this.convertInternal(Number(num)));
        }
        wordsWithDecimal.push(...zeroWords);
      } else {
        wordsWithDecimal.push(...this.convertInternal(Number(split[1])));
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

    const isNegativeNumber = number < 0;
    if (isNegativeNumber) {
      number = Math.abs(number);
    }

    number = this.toFixed(number);
    // Extra check for isFloat to overcome 1.999 rounding off to 2
    const split = number.toString().split('.');
    let words = [...this.convertInternal(Number(split[0]))];
    if (locale.config.currency.plural) {
      words.push(locale.config.currency.plural);
    }
    const ignoreZero =
      this.isNumberZero(number) &&
      (options.ignoreZeroCurrency || (locale.config?.ignoreZeroInDecimals && number !== 0));

    if (ignoreZero) {
      words = [];
    }

    const wordsWithDecimal = [];
    const isFloat = this.isFloat(number);
    if (isFloat) {
      if (!ignoreZero) {
        wordsWithDecimal.push(locale.config.texts.and);
      }
      wordsWithDecimal.push(
        ...this.convertInternal(
          Number(split[1]) * (!locale.config.decimalLengthWordMapping ? Math.pow(10, 2 - split[1].length) : 1),
        ),
      );
      const decimalLengthWord = locale.config?.decimalLengthWordMapping?.[split[1].length];
      if (decimalLengthWord?.length) {
        wordsWithDecimal.push(decimalLengthWord);
      }
      wordsWithDecimal.push(locale.config.currency.fractionalUnit.plural);
    } else if (locale.config.decimalLengthWordMapping && words.length) {
      wordsWithDecimal.push(locale.config.currency.fractionalUnit.plural);
    }
    const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
    if (!isEmpty && isNegativeNumber) {
      words.unshift(locale.config.texts.minus);
    }
    if (!isEmpty && locale.config.texts.only && !options.doNotAddOnly) {
      wordsWithDecimal.push(locale.config.texts.only);
    }
    if (wordsWithDecimal.length) {
      words.push(...wordsWithDecimal);
    }
    return words;
  }

  protected convertInternal(number: number): string[] {
    const locale = this.getLocale();

    if (locale.config.exactWordsMapping) {
      const exactMatch = locale.config?.exactWordsMapping?.find((elem) => {
        return number === elem.number;
      });
      if (exactMatch) {
        return [exactMatch.value];
      }
    }

    const match = locale.config.numberWordsMapping.find((elem) => {
      return number >= elem.number;
    }) as NumberWordMap;

    const words: string[] = [];
    if (number <= 100 || (number < 1000 && locale.config.namedLessThan1000)) {
      words.push(match.value);
      number -= match.number;
      if (number > 0) {
        if (locale.config?.splitWord?.length) {
          words.push(locale.config.splitWord);
        }
        words.push(...this.convertInternal(number));
      }
      return words;
    }

    const quotient = Math.floor(number / match.number);
    const remainder = number % match.number;
    let matchValue = match.value;
    if (quotient > 1 && locale.config?.pluralWords?.find((word) => word === match.value) && locale.config?.pluralMark) {
      matchValue += locale.config.pluralMark;
    }
    if (quotient === 1 && locale.config?.ignoreOneForWords?.includes(matchValue)) {
      words.push(matchValue);
    } else {
      words.push(...this.convertInternal(quotient), matchValue);
    }

    if (remainder > 0) {
      if (locale.config?.splitWord?.length) {
        words.push(locale.config.splitWord);
      }
      words.push(...this.convertInternal(remainder));
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

  // replace the commas and convert to number
  public clean(value: string | number): number {
    return typeof value === 'string' ? Number(value.toString().replace(/,/g, '')) : value;
  }
}
