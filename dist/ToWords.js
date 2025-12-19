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
        var _a, _b;
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
            fractionalPart = (_a = segments[1]) !== null && _a !== void 0 ? _a : '';
        }
        const ignoreZero = this.isNumberZero(number) && localeConfig.ignoreZeroInDecimals;
        let words = this.convertInternal(integerPart, true, undefined, locale);
        if (isFloat && ignoreZero) {
            words = [];
        }
        const wordsWithDecimal = [];
        if (isFloat) {
            if (!ignoreZero) {
                wordsWithDecimal.push(localeConfig.texts.point);
            }
            if (fractionalPart.startsWith('0') && !(localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.decimalLengthWordMapping)) {
                const zeroWords = [];
                for (const num of fractionalPart) {
                    zeroWords.push(...this.convertInternal(Number(num), true, undefined, locale));
                }
                wordsWithDecimal.push(...zeroWords);
            }
            else if (fractionalPart.length) {
                wordsWithDecimal.push(...this.convertInternal(Number(fractionalPart), true, undefined, locale));
                const decimalLengthWord = (_b = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.decimalLengthWordMapping) === null || _b === void 0 ? void 0 : _b[fractionalPart.length];
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
    convertCurrency(number, options = {}) {
        var _a, _b, _c, _d, _e;
        const locale = this.getLocale();
        const localeConfig = locale.config;
        const currencyOptions = (_a = options.currencyOptions) !== null && _a !== void 0 ? _a : localeConfig.currency;
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
            fractionalPart = (_b = segments[1]) !== null && _b !== void 0 ? _b : '';
        }
        let words = [];
        if ((_c = currencyOptions.numberSpecificForms) === null || _c === void 0 ? void 0 : _c[mainAmount]) {
            words = [currencyOptions.numberSpecificForms[mainAmount]];
        }
        else {
            // Determine if the main currency should be in singular form
            // e.g. 1 Dollar Only instead of 1 Dollars Only
            words = [...this.convertInternal(mainAmount, false, undefined, locale)];
            if (mainAmount === 1 && currencyOptions.singular) {
                words.push(currencyOptions.singular);
            }
            else if (currencyOptions.plural) {
                words.push(currencyOptions.plural);
            }
        }
        const ignoreZero = this.isNumberZero(number) && (options.ignoreZeroCurrency || ((localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.ignoreZeroInDecimals) && number !== 0));
        if (ignoreZero) {
            words = [];
        }
        const wordsWithDecimal = [];
        if (isFloat) {
            if (!ignoreZero) {
                wordsWithDecimal.push(localeConfig.texts.and);
            }
            const decimalBase = !localeConfig.decimalLengthWordMapping && fractionalPart.length
                ? Math.pow(10, Math.max(0, 2 - fractionalPart.length))
                : 1;
            const decimalPart = Number(fractionalPart || '0') * decimalBase;
            const decimalLengthWord = (_d = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.decimalLengthWordMapping) === null || _d === void 0 ? void 0 : _d[fractionalPart.length];
            if ((_e = currencyOptions.fractionalUnit.numberSpecificForms) === null || _e === void 0 ? void 0 : _e[decimalPart]) {
                wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPart]);
            }
            else {
                wordsWithDecimal.push(...this.convertInternal(decimalPart, false, undefined, locale));
                if (decimalLengthWord === null || decimalLengthWord === void 0 ? void 0 : decimalLengthWord.length) {
                    wordsWithDecimal.push(decimalLengthWord);
                }
                if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
                    wordsWithDecimal.push(currencyOptions.fractionalUnit.singular);
                }
                else {
                    wordsWithDecimal.push(currencyOptions.fractionalUnit.plural);
                }
            }
        }
        else if (localeConfig.decimalLengthWordMapping && words.length) {
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
    convertInternal(number, trailing = false, overrides = {}, localeInstance) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const locale = localeInstance !== null && localeInstance !== void 0 ? localeInstance : this.getLocale();
        const localeConfig = locale.config;
        if (overrides[number]) {
            return [overrides[number]];
        }
        if (localeConfig.exactWordsMapping) {
            const exactMatch = (_a = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.exactWordsMapping) === null || _a === void 0 ? void 0 : _a.find((elem) => {
                return number === elem.number;
            });
            if (exactMatch) {
                return [Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value];
            }
        }
        const match = localeConfig.numberWordsMapping.find((elem) => {
            return number >= elem.number;
        });
        const words = [];
        if (number <= 100 || (number < 1000 && localeConfig.namedLessThan1000)) {
            words.push(Array.isArray(match.value) ? match.value[0] : match.value);
            number -= match.number;
            if (number > 0) {
                if ((_b = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.splitWord) === null || _b === void 0 ? void 0 : _b.length) {
                    words.push(localeConfig.splitWord);
                }
                words.push(...this.convertInternal(number, trailing, overrides, locale));
            }
            return words;
        }
        const quotient = Math.floor(number / match.number);
        const remainder = number % match.number;
        let matchValue = Array.isArray(match.value) ? match.value[0] : match.value;
        const pluralForms = (_c = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.pluralForms) === null || _c === void 0 ? void 0 : _c[match.number];
        let usedPluralForm = false;
        if (pluralForms) {
            const lastTwoDigits = quotient % 100;
            const useLastDigits = quotient >= 11 && lastTwoDigits >= 3 && lastTwoDigits <= 10;
            if (quotient === 2 && pluralForms.dual) {
                matchValue = pluralForms.dual;
                usedPluralForm = true;
            }
            else if ((quotient >= ((_e = (_d = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.paucalConfig) === null || _d === void 0 ? void 0 : _d.min) !== null && _e !== void 0 ? _e : 3) && quotient <= ((_g = (_f = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.paucalConfig) === null || _f === void 0 ? void 0 : _f.max) !== null && _g !== void 0 ? _g : 10)) ||
                useLastDigits) {
                if (pluralForms.paucal) {
                    matchValue = pluralForms.paucal;
                }
            }
            else if (quotient >= 11 && pluralForms.plural) {
                matchValue = pluralForms.plural;
            }
        }
        else {
            if (quotient > 1 && ((_h = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.pluralWords) === null || _h === void 0 ? void 0 : _h.find((word) => word === match.value)) && (localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.pluralMark)) {
                matchValue += localeConfig.pluralMark;
            }
            if (quotient % 10 === 1) {
                matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
            }
        }
        if ((quotient === 1 && ((_j = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.ignoreOneForWords) === null || _j === void 0 ? void 0 : _j.includes(matchValue))) || usedPluralForm) {
            words.push(matchValue);
        }
        else {
            words.push(...this.convertInternal(quotient, false, overrides, locale), matchValue);
        }
        if (remainder > 0) {
            if ((_k = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.splitWord) === null || _k === void 0 ? void 0 : _k.length) {
                if (!((_l = localeConfig === null || localeConfig === void 0 ? void 0 : localeConfig.noSplitWordAfter) === null || _l === void 0 ? void 0 : _l.find((word) => word === match.value))) {
                    words.push(localeConfig.splitWord);
                }
            }
            words.push(...this.convertInternal(remainder, trailing, overrides, locale));
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
