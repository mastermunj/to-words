"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToWords = exports.DefaultToWordsOptions = exports.DefaultConverterOptions = void 0;
const en_BD_1 = __importDefault(require("./locales/en-BD"));
const en_GH_1 = __importDefault(require("./locales/en-GH"));
const en_IN_1 = __importDefault(require("./locales/en-IN"));
const en_MM_1 = __importDefault(require("./locales/en-MM"));
const en_MU_1 = __importDefault(require("./locales/en-MU"));
const en_NG_1 = __importDefault(require("./locales/en-NG"));
const en_US_1 = __importDefault(require("./locales/en-US"));
const en_GB_1 = __importDefault(require("./locales/en-GB"));
const fa_IR_1 = __importDefault(require("./locales/fa-IR"));
const fr_FR_1 = __importDefault(require("./locales/fr-FR"));
const gu_IN_1 = __importDefault(require("./locales/gu-IN"));
const hi_IN_1 = __importDefault(require("./locales/hi-IN"));
const mr_IN_1 = __importDefault(require("./locales/mr-IN"));
const tr_TR_1 = __importDefault(require("./locales/tr-TR"));
const nl_SR_1 = __importDefault(require("./locales/nl-SR"));
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
    /**
     * Get locale class for the locale passed in the options.
     * @returns {class} - based on selected currency
     */
    getLocaleClass() {
        /* eslint-disable @typescript-eslint/no-var-requires */
        switch (this.options.localeCode) {
            case 'en-BD':
                return en_BD_1.default;
    /**
     * Instantiating the passed user currency local option in configuration
     * object
     * @returns {class}
     */
            case 'en-GH':
                return en_GH_1.default;
            case 'en-IN':
                return en_IN_1.default;
            case 'en-MM':
                return en_MM_1.default;
            case 'en-MU':
    /**
     *
     * @param number - user input number to be converted
     * @param options - configuration set by user
     * @returns {string} - converted number to words string
     */
                return en_MU_1.default;
    /**
     * Instantiating the passed user currency local option in configuration
     * object
     * @returns {class}
     */
            case 'en-NG':
                return en_NG_1.default;
            case 'en-US':
                return en_US_1.default;
            case 'en-GB':
                return en_GB_1.default;
            case 'fa-IR':
    /**
     *
     * @param number - user input number to be converted
     * @param options - configuration set by user
    /**
     *
     * @param number
     * @returns {Array<string>} converted words as array of strings
     */
     * @returns {string} - converted number to words string
     */
                return fa_IR_1.default;
    /**
     * Instantiating the passed user currency local option in configuration
     * object
     * @returns {class}
     */
            case 'fr-FR':
                return fr_FR_1.default;
            case 'gu-IN':
                return gu_IN_1.default;
            case 'hi-IN':
                return hi_IN_1.default;
            case 'mr-IN':
    /**
     *
     * @param number - user input number to be converted
     * @param options - configuration set by user
    /**
     *
     * @param number
     * @returns {Array<string>} converted words as array of strings
     */
     * @returns {string} - converted number to words string
     */
                return mr_IN_1.default;
    /**
     * Instantiating the passed user currency local option in configuration
     * object
     * @returns {class}
     */
            case 'tr-TR':
                return tr_TR_1.default;
            case 'nl-SR':
                return nl_SR_1.default;
        }
        /* eslint-enable @typescript-eslint/no-var-requires */
        throw new Error(`Unknown Locale "${this.options.localeCode}"`);
    /**
     *
     * @param number - user input number to be converted
     * @param options - configuration set by user
    /**
     *
     * @param number
     * @returns {Array<string>} converted words as array of strings
     */
     * @returns {string} - converted number to words string
     */
    }
    /**
     * Create instance of the locale class.
     *
     * @returns {class}
     */
    getLocale() {
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
    convert(number, options = {}) {
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
        let words = [];
        if (options.currency) {
            words = this.convertCurrency(number, options);
        }
        else {
            words = this.convertNumber(number);
        }
        return words.join(' ');
    }
    /**
     *
     * @param number
     * @returns {Array<string>} converted words as array of strings
     */
    convertNumber(number) {
        var _a, _b, _c;
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
            if (split[1].startsWith('0') && !((_a = locale.config) === null || _a === void 0 ? void 0 : _a.decimalLengthWordMapping)) {
                const zeroWords = [];
                for (const num of split[1]) {
                    zeroWords.push(...this.convertInternal(Number(num)));
                }
                wordsWithDecimal.push(...zeroWords);
            }
            else {
                wordsWithDecimal.push(...this.convertInternal(Number(split[1])));
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
        var _a, _b, _c;
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
        const ignoreZero = this.isNumberZero(number) &&
            (options.ignoreZeroCurrency || (((_a = locale.config) === null || _a === void 0 ? void 0 : _a.ignoreZeroInDecimals) && number !== 0));
        if (ignoreZero) {
            words = [];
        }
        const wordsWithDecimal = [];
        const isFloat = this.isFloat(number);
        if (isFloat) {
            if (!ignoreZero) {
                wordsWithDecimal.push(locale.config.texts.and);
            }
            wordsWithDecimal.push(...this.convertInternal(Number(split[1]) * (!locale.config.decimalLengthWordMapping ? Math.pow(10, 2 - split[1].length) : 1)));
            const decimalLengthWord = (_c = (_b = locale.config) === null || _b === void 0 ? void 0 : _b.decimalLengthWordMapping) === null || _c === void 0 ? void 0 : _c[split[1].length];
            if (decimalLengthWord === null || decimalLengthWord === void 0 ? void 0 : decimalLengthWord.length) {
                wordsWithDecimal.push(decimalLengthWord);
            }
            wordsWithDecimal.push(locale.config.currency.fractionalUnit.plural);
        }
        else if (locale.config.decimalLengthWordMapping && words.length) {
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
    convertInternal(number) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const locale = this.getLocale();
        if (locale.config.exactWordsMapping) {
            const exactMatch = (_b = (_a = locale.config) === null || _a === void 0 ? void 0 : _a.exactWordsMapping) === null || _b === void 0 ? void 0 : _b.find((elem) => {
                return number === elem.number;
            });
            if (exactMatch) {
                return [exactMatch.value];
            }
        }
        const match = locale.config.numberWordsMapping.find((elem) => {
            return number >= elem.number;
        });
        const words = [];
        if (number <= 100 || (number < 1000 && locale.config.namedLessThan1000)) {
            words.push(match.value);
            number -= match.number;
            if (number > 0) {
                if ((_d = (_c = locale.config) === null || _c === void 0 ? void 0 : _c.splitWord) === null || _d === void 0 ? void 0 : _d.length) {
                    words.push(locale.config.splitWord);
                }
                words.push(...this.convertInternal(number));
            }
            return words;
        }
        const quotient = Math.floor(number / match.number);
        const remainder = number % match.number;
        let matchValue = match.value;
        if (quotient > 1 && ((_f = (_e = locale.config) === null || _e === void 0 ? void 0 : _e.pluralWords) === null || _f === void 0 ? void 0 : _f.find((word) => word === match.value)) && ((_g = locale.config) === null || _g === void 0 ? void 0 : _g.pluralMark)) {
            matchValue += locale.config.pluralMark;
        }
        if (quotient === 1 && ((_j = (_h = locale.config) === null || _h === void 0 ? void 0 : _h.ignoreOneForWords) === null || _j === void 0 ? void 0 : _j.includes(matchValue))) {
            words.push(matchValue);
        }
        else {
            words.push(...this.convertInternal(quotient), matchValue);
        }
        if (remainder > 0) {
            if ((_l = (_k = locale.config) === null || _k === void 0 ? void 0 : _k.splitWord) === null || _l === void 0 ? void 0 : _l.length) {
                words.push(locale.config.splitWord);
            }
            words.push(...this.convertInternal(remainder));
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
    // replace the commas and convert to number
    clean(value) {
        return typeof value === 'string' ? Number(value.toString().replace(/,/g, '')) : value;
    }
}
exports.ToWords = ToWords;
