"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToWords = void 0;
const DefaultConverterOptions = {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
};
class ToWords {
    constructor(options = {}) {
        this.options = {};
        this.locale = undefined;
        this.options = Object.assign({
            localeCode: 'en-IN',
            converterOptions: DefaultConverterOptions,
        }, options);
    }
    getLocaleClass() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(`./locales/${this.options.localeCode}`).Locale;
    }
    getLocale() {
        if (this.locale === undefined) {
            try {
                const LocaleClass = this.getLocaleClass();
                this.locale = new LocaleClass();
            }
            catch (e) {
                throw new Error(`Unknown Locale "${this.options.localeCode}"`);
            }
        }
        return this.locale;
    }
    convert(number, options = {}) {
        options = Object.assign({}, this.options.converterOptions, options);
        if (!this.isValidNumber(number)) {
            throw new Error(`Invalid Number "${number}"`);
        }
        const locale = this.getLocale();
        let isFloat = this.isFloat(number);
        if (options.ignoreDecimal) {
            number = Number.parseInt(number.toString());
            isFloat = false;
        }
        const isNegativeNumber = number < 0;
        if (isNegativeNumber) {
            number = Math.abs(number);
        }
        if (options.currency) {
            number = this.toFixed(number);
            // Extra check for isFloat to overcome 1.999 rounding off to 2
            isFloat = this.isFloat(number);
            const isNumberZero = number >= 0 && number < 1;
            const split = number.toString().split('.');
            let words = `${this.convertInternal(Number(split[0]), options)} ${locale.currency.plural}`;
            if (isNumberZero && options.ignoreZeroCurrency) {
                words = '';
            }
            let wordsWithDecimal = '';
            if (isFloat) {
                if (!isNumberZero || !options.ignoreZeroCurrency) {
                    wordsWithDecimal += ` ${locale.texts.and} `;
                }
                wordsWithDecimal += `${this.convertInternal(Number(split[1]) * Math.pow(10, 2 - split[1].length), options)} ${locale.currency.fractionalUnit.plural}`;
            }
            const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
            return ((!isEmpty && isNegativeNumber ? `${locale.texts.minus} ` : '') +
                words +
                wordsWithDecimal +
                (!isEmpty ? ` ${locale.texts.only}` : ''));
        }
        else {
            const split = number.toString().split('.');
            const words = this.convertInternal(Number(split[0]), options);
            let wordsWithDecimal = '';
            if (isFloat) {
                wordsWithDecimal += ` ${locale.texts.point} `;
                if (split[1].startsWith('0')) {
                    const zeroWords = [];
                    for (const num of split[1]) {
                        zeroWords.push(this.convertInternal(Number(num)));
                    }
                    wordsWithDecimal += zeroWords.join(' ');
                }
                else {
                    wordsWithDecimal += this.convertInternal(Number(split[1]), options);
                }
            }
            const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
            return ((!isEmpty && isNegativeNumber ? `${locale.texts.minus} ` : '') +
                words +
                wordsWithDecimal);
        }
    }
    convertInternal(number, options = {}) {
        const locale = this.getLocale();
        const match = locale.numberWordsMapping.find((elem) => {
            return number >= elem.number;
        });
        if (!match) {
            throw new Error(`Invalid Number "${number}"`);
        }
        let words = '';
        if (number <= 100) {
            words += match.value;
            number -= match.number;
            if (number > 0) {
                words += ` ${this.convertInternal(number, options)}`;
            }
        }
        else {
            const quotient = Math.floor(number / match.number);
            const remainder = number % match.number;
            if (remainder > 0) {
                return `${this.convertInternal(quotient, options)} ${match.value} ${this.convertInternal(remainder, options)}`;
            }
            else {
                return `${this.convertInternal(quotient, options)} ${match.value}`;
            }
        }
        return words;
    }
    toFixed(number, precision = 2) {
        return Number(Number(number).toFixed(precision));
    }
    isFloat(number) {
        return Number(number) === number && number % 1 !== 0;
    }
    isValidNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
}
exports.ToWords = ToWords;
