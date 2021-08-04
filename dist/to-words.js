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
        /* eslint-disable @typescript-eslint/no-var-requires */
        switch (this.options.localeCode) {
            case 'en-IN':
                return require('./locales/en-IN').Locale;
            case 'en-MM':
                return require('./locales/en-MM').Locale;
            case 'en-MU':
                return require('./locales/en-MU').Locale;
            case 'en-US':
                return require('./locales/en-US').Locale;
            case 'en-NG':
                return require('./locales/en-NG').Locale;
            case 'fa-IR':
                return require('./locales/fa-IR').Locale;
            case 'fr-FR':
                return require('./locales/fr-FR').Locale;
        }
        /* eslint-enable @typescript-eslint/no-var-requires */
        throw new Error(`Unknown Locale "${this.options.localeCode}"`);
    }
    getLocale() {
        if (this.locale === undefined) {
            const LocaleClass = this.getLocaleClass();
            this.locale = new LocaleClass();
        }
        return this.locale;
    }
    convert(number, options = {}) {
        var _a, _b, _c, _d;
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
            const split = number.toString().split('.');
            let words = `${this.convertInternal(Number(split[0]), options)}${locale.currency.plural ? ` ${locale.currency.plural}` : ''}`;
            const isNumberZero = number >= 0 && number < 1;
            const ignoreZero = options.ignoreZeroCurrency || (((_a = locale.options) === null || _a === void 0 ? void 0 : _a.ignoreZeroInDecimals) && number !== 0);
            if (isNumberZero && ignoreZero) {
                words = '';
            }
            let wordsWithDecimal = '';
            if (isFloat) {
                if (!isNumberZero || !ignoreZero) {
                    wordsWithDecimal += ` ${locale.texts.and} `;
                }
                const decimalLengthWord = (_b = locale === null || locale === void 0 ? void 0 : locale.decimalLengthWordMapping) === null || _b === void 0 ? void 0 : _b[split[1].length];
                wordsWithDecimal += `${this.convertInternal(Number(split[1]) * (!locale.decimalLengthWordMapping ? Math.pow(10, 2 - split[1].length) : 1), options)}${decimalLengthWord ? ` ${decimalLengthWord}` : ''} ${locale.currency.fractionalUnit.plural}`;
            }
            else if (locale.decimalLengthWordMapping && words !== '') {
                words += ` ${locale.currency.fractionalUnit.plural}`;
            }
            const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
            return ((!isEmpty && isNegativeNumber ? `${locale.texts.minus} ` : '') +
                words +
                wordsWithDecimal +
                (!isEmpty && locale.texts.only ? ` ${locale.texts.only}` : ''));
        }
        else {
            const isNumberZero = number >= 0 && number < 1;
            const split = number.toString().split('.');
            const ignoreZero = isNumberZero && ((_c = locale.options) === null || _c === void 0 ? void 0 : _c.ignoreZeroInDecimals);
            const words = isFloat && ignoreZero ? '' : this.convertInternal(Number(split[0]), options);
            let wordsWithDecimal = '';
            if (isFloat) {
                const decimalLengthWord = (_d = locale === null || locale === void 0 ? void 0 : locale.decimalLengthWordMapping) === null || _d === void 0 ? void 0 : _d[split[1].length];
                if (!ignoreZero)
                    wordsWithDecimal += ` ${locale.texts.point} `;
                if (split[1].startsWith('0') && !locale.decimalLengthWordMapping) {
                    const zeroWords = [];
                    for (const num of split[1]) {
                        zeroWords.push(this.convertInternal(Number(num)));
                    }
                    wordsWithDecimal += zeroWords.join(' ');
                }
                else {
                    wordsWithDecimal += `${this.convertInternal(Number(split[1]), options)}${decimalLengthWord ? ` ${decimalLengthWord}` : ''}`;
                }
            }
            const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
            return (!isEmpty && isNegativeNumber ? `${locale.texts.minus} ` : '') + words + wordsWithDecimal;
        }
    }
    convertInternal(number, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const locale = this.getLocale();
        const splitWord = ((_a = locale.options) === null || _a === void 0 ? void 0 : _a.splitWord) ? `${(_b = locale.options) === null || _b === void 0 ? void 0 : _b.splitWord} ` : '';
        const pluralMark = ((_c = locale.options) === null || _c === void 0 ? void 0 : _c.pluralMark) ? `${(_d = locale.options) === null || _d === void 0 ? void 0 : _d.pluralMark}` : '';
        const match = locale.numberWordsMapping.find((elem) => {
            return number >= elem.number;
        });
        if (!match) {
            throw new Error(`Invalid Number "${number}"`);
        }
        let words = '';
        if (number <= 100 || (number < 1000 && ((_e = locale.options) === null || _e === void 0 ? void 0 : _e.namedLessThan1000))) {
            words += match.value;
            number -= match.number;
            if (number > 0) {
                words += ` ${splitWord}${this.convertInternal(number, options)}`;
            }
        }
        else {
            const quotient = Math.floor(number / match.number);
            const remainder = number % match.number;
            const matchValue = quotient > 1 && ((_g = (_f = locale.options) === null || _f === void 0 ? void 0 : _f.pluralWords) === null || _g === void 0 ? void 0 : _g.find((word) => word === match.value))
                ? match.value + pluralMark
                : match.value;
            if (remainder > 0) {
                if (quotient == 1 && ((_h = locale.options) === null || _h === void 0 ? void 0 : _h.ignoreOneForWords)) {
                    return `${matchValue} ${splitWord}${this.convertInternal(remainder, options)}`;
                }
                else {
                    return `${this.convertInternal(quotient, options)} ${matchValue} ${splitWord}${this.convertInternal(remainder, options)}`;
                }
            }
            else {
                if (quotient == 1 && ((_j = locale.options) === null || _j === void 0 ? void 0 : _j.ignoreOneForWords)) {
                    return `${matchValue}`;
                }
                else {
                    return `${this.convertInternal(quotient, options)} ${matchValue}`;
                }
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
