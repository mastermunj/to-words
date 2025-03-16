"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToWords = exports.DefaultToWordsOptions = exports.DefaultConverterOptions = exports.LOCALES = void 0;
const locales_1 = __importDefault(require("./locales"));
exports.LOCALES = locales_1.default;
exports.DefaultConverterOptions = {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
};
exports.DefaultToWordsOptions = {
    localeCode: 'en-IN',
    converterOptions: exports.DefaultConverterOptions,
};
class ToWords {
    constructor(options = {}) {
        this.options = {};
        this.locale = undefined;
        this.options = Object.assign({}, exports.DefaultToWordsOptions, options);
    }
    getLocaleClass() {
        if (!(this.options.localeCode in locales_1.default)) {
            throw new Error(`Unknown Locale "${this.options.localeCode}"`);
        }
        return locales_1.default[this.options.localeCode];
    }
    getLocale() {
        if (this.locale === undefined) {
            const LocaleClass = this.getLocaleClass();
            this.locale = new LocaleClass();
        }
        return this.locale;
    }
    convert(number, options = {}) {
        var _a;
        options = Object.assign({}, this.options.converterOptions, options);
        if (!this.isValidNumber(number)) {
            throw new Error(`Invalid Number "${number}"`);
        }
        if (options.ignoreDecimal) {
            number = Number.parseInt(number.toString());
        }
        let words = [];
        if (options.currency) {
            words = this.convertCurrency(number, options);
        }
        else {
            words = this.convertNumber(number);
        }
        if ((_a = this.locale) === null || _a === void 0 ? void 0 : _a.config.trim) {
            return words.join('');
        }
        return words.join(' ');
    }
    convertNumber(number) {
        var _a, _b, _c;
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
            if (split[1].startsWith('0') && !((_a = locale.config) === null || _a === void 0 ? void 0 : _a.decimalLengthWordMapping)) {
                const zeroWords = [];
                for (const num of split[1]) {
                    zeroWords.push(...this.convertInternal(Number(num), true));
                }
                wordsWithDecimal.push(...zeroWords);
            }
            else {
                wordsWithDecimal.push(...this.convertInternal(Number(split[1]), true));
                const decimalLengthWord = (_c = (_b = locale.config) === null || _b === void 0 ? void 0 : _b.decimalLengthWordMapping) === null || _c === void 0 ? void 0 : _c[split[1].length];
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
    convertCurrency(number, options = {}) {
        var _a, _b, _c, _d;
        const locale = this.getLocale();
        const currencyOptions = (_a = options.currencyOptions) !== null && _a !== void 0 ? _a : locale.config.currency;
        const isNegativeNumber = number < 0;
        if (isNegativeNumber) {
            number = Math.abs(number);
        }
        number = this.toFixed(number);
        // Extra check for isFloat to overcome 1.999 rounding off to 2
        const split = number.toString().split('.');
        let words = [...this.convertInternal(Number(split[0]))];
        // Determine if the main currency should be in singular form
        // e.g. 1 Dollar Only instead of 1 Dollars Only
        if (Number(split[0]) === 1 && currencyOptions.singular) {
            words.push(currencyOptions.singular);
        }
        else if (currencyOptions.plural) {
            words.push(currencyOptions.plural);
        }
        const ignoreZero = this.isNumberZero(number) &&
            (options.ignoreZeroCurrency || (((_b = locale.config) === null || _b === void 0 ? void 0 : _b.ignoreZeroInDecimals) && number !== 0));
        if (ignoreZero) {
            words = [];
        }
        const wordsWithDecimal = [];
        const isFloat = this.isFloat(number);
        if (isFloat) {
            if (!ignoreZero) {
                wordsWithDecimal.push(locale.config.texts.and);
            }
            const decimalPart = Number(split[1]) * (!locale.config.decimalLengthWordMapping ? Math.pow(10, 2 - split[1].length) : 1);
            wordsWithDecimal.push(...this.convertInternal(decimalPart));
            const decimalLengthWord = (_d = (_c = locale.config) === null || _c === void 0 ? void 0 : _c.decimalLengthWordMapping) === null || _d === void 0 ? void 0 : _d[split[1].length];
            if (decimalLengthWord === null || decimalLengthWord === void 0 ? void 0 : decimalLengthWord.length) {
                wordsWithDecimal.push(decimalLengthWord);
            }
            // Determine if the fractional unit should be in singular form
            // e.g. 1 Dollar and 1 Cent Only instead of 1 Dollar and 1 Cents Only
            if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
                wordsWithDecimal.push(currencyOptions.fractionalUnit.singular);
            }
            else {
                wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
            }
        }
        else if (locale.config.decimalLengthWordMapping && words.length) {
            wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
        }
        const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0;
        if (!isEmpty && isNegativeNumber) {
            words.unshift(locale.config.texts.minus);
        }
        if (!isEmpty && locale.config.texts.only && !options.doNotAddOnly && !locale.config.onlyInFront) {
            wordsWithDecimal.push(locale.config.texts.only);
        }
        if (wordsWithDecimal.length) {
            words.push(...wordsWithDecimal);
        }
        if (!isEmpty && !options.doNotAddOnly && locale.config.onlyInFront) {
            words.splice(0, 0, locale.config.texts.only);
        }
        return words;
    }
    convertInternal(number, trailing = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const locale = this.getLocale();
        if (locale.config.exactWordsMapping) {
            const exactMatch = (_b = (_a = locale.config) === null || _a === void 0 ? void 0 : _a.exactWordsMapping) === null || _b === void 0 ? void 0 : _b.find((elem) => {
                return number === elem.number;
            });
            if (exactMatch) {
                return [Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value];
            }
        }
        const match = locale.config.numberWordsMapping.find((elem) => {
            return number >= elem.number;
        });
        const words = [];
        if (number <= 100 || (number < 1000 && locale.config.namedLessThan1000)) {
            words.push(Array.isArray(match.value) ? match.value[0] : match.value);
            number -= match.number;
            if (number > 0) {
                if ((_d = (_c = locale.config) === null || _c === void 0 ? void 0 : _c.splitWord) === null || _d === void 0 ? void 0 : _d.length) {
                    words.push(locale.config.splitWord);
                }
                words.push(...this.convertInternal(number, trailing));
            }
            return words;
        }
        const quotient = Math.floor(number / match.number);
        const remainder = number % match.number;
        let matchValue = match.value;
        if (quotient > 1 && ((_f = (_e = locale.config) === null || _e === void 0 ? void 0 : _e.pluralWords) === null || _f === void 0 ? void 0 : _f.find((word) => word === match.value)) && ((_g = locale.config) === null || _g === void 0 ? void 0 : _g.pluralMark)) {
            matchValue += locale.config.pluralMark;
        }
        if (quotient === 1 &&
            ((_j = (_h = locale.config) === null || _h === void 0 ? void 0 : _h.ignoreOneForWords) === null || _j === void 0 ? void 0 : _j.includes(Array.isArray(matchValue) ? matchValue[0] : matchValue))) {
            words.push(Array.isArray(matchValue) ? matchValue[1] : matchValue);
        }
        else {
            words.push(...this.convertInternal(quotient, false), Array.isArray(matchValue) ? matchValue[0] : matchValue);
        }
        if (remainder > 0) {
            if ((_l = (_k = locale.config) === null || _k === void 0 ? void 0 : _k.splitWord) === null || _l === void 0 ? void 0 : _l.length) {
                if (!((_o = (_m = locale.config) === null || _m === void 0 ? void 0 : _m.noSplitWordAfter) === null || _o === void 0 ? void 0 : _o.find((word) => word === match.value))) {
                    words.push(locale.config.splitWord);
                }
            }
            words.push(...this.convertInternal(remainder, trailing));
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
    isNumberZero(number) {
        return number >= 0 && number < 1;
    }
}
exports.ToWords = ToWords;
