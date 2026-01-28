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
// Global cache for all locales (computed once per locale)
const localeCache = new WeakMap();
class ToWords {
    options = {};
    locale = undefined;
    constructor(options = {}) {
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
            // Initialize cache for this locale
            this.initLocaleCache(this.locale);
        }
        return this.locale;
    }
    initLocaleCache(locale) {
        if (localeCache.has(locale))
            return;
        const config = locale.config;
        // Pre-compute BigInt values and resolved string values for numberWordsMapping
        const numberWordsMappingBigInt = config.numberWordsMapping.map((elem) => ({
            ...elem,
            numberBigInt: BigInt(elem.number),
            resolvedValue: Array.isArray(elem.value) ? elem.value[0] : elem.value,
        }));
        // Create Map for O(1) exact match lookup
        const exactWordsMap = new Map();
        if (config.exactWordsMapping) {
            for (const elem of config.exactWordsMapping) {
                const cached = {
                    ...elem,
                    numberBigInt: BigInt(elem.number),
                    resolvedValue: Array.isArray(elem.value) ? elem.value[0] : elem.value,
                };
                exactWordsMap.set(cached.numberBigInt, cached);
            }
        }
        // Create direct lookup map for small numbers (0-100) for O(1) access
        const smallNumbersMap = new Map();
        for (const elem of numberWordsMappingBigInt) {
            if (elem.numberBigInt <= 100n) {
                smallNumbersMap.set(elem.numberBigInt, elem);
            }
        }
        localeCache.set(locale, {
            numberWordsMappingBigInt,
            exactWordsMap,
            smallNumbersMap,
        });
    }
    getLocaleCache(locale) {
        let cache = localeCache.get(locale);
        if (!cache) {
            this.initLocaleCache(locale);
            cache = localeCache.get(locale);
        }
        return cache;
    }
    convert(number, options = {}) {
        options = Object.assign({}, this.options.converterOptions, options);
        if (!this.isValidNumber(number)) {
            throw new Error(`Invalid Number "${number}"`);
        }
        const isBigInt = typeof number === 'bigint';
        let numericValue = isBigInt ? number : Number(number);
        if (options.ignoreDecimal && !isBigInt) {
            numericValue = Number.parseInt(numericValue.toString());
        }
        let words = [];
        if (options.currency) {
            words = this.convertCurrency(numericValue, options);
        }
        else {
            words = this.convertNumber(numericValue);
        }
        if (this.locale?.config.trim) {
            return words.join('');
        }
        return words.join(' ');
    }
    toOrdinal(number, options = {}) {
        if (!this.isValidNumber(number)) {
            throw new Error(`Invalid Number "${number}"`);
        }
        const locale = this.getLocale();
        const localeConfig = locale.config;
        // Convert to number (ordinals typically don't need BigInt support for practical use)
        const numValue = typeof number === 'bigint' ? Number(number) : Number(number);
        if (!Number.isInteger(numValue) || numValue < 0) {
            throw new Error(`Ordinal numbers must be non-negative integers, got "${number}"`);
        }
        // Check if locale supports ordinals
        if (!localeConfig.ordinalWordsMapping && !localeConfig.ordinalSuffix) {
            throw new Error(`Ordinal conversion not supported for locale "${this.options.localeCode}"`);
        }
        const words = this.convertOrdinal(numValue, options, locale);
        if (localeConfig.trim) {
            return words.join('');
        }
        return words.join(' ');
    }
    convertOrdinal(number, _options, localeInstance) {
        const localeConfig = localeInstance.config;
        // Check exact ordinal mapping first (for special cases like 100 that need special wording)
        if (localeConfig.ordinalExactWordsMapping) {
            const exactMatch = localeConfig.ordinalExactWordsMapping.find((m) => m.number === number);
            if (exactMatch) {
                return [exactMatch.value];
            }
        }
        // For simple numbers (0-20), use direct ordinal mapping
        if (number <= 20 && localeConfig.ordinalWordsMapping) {
            const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => m.number === number);
            if (ordinalMatch) {
                return [ordinalMatch.value];
            }
        }
        // For composite numbers (like 21, 1000, 1234), convert to cardinal then modify last component
        // Strategy: Convert the number to cardinal, then find the last component and replace it with ordinal
        const cardinalWords = this.convertInternal(BigInt(number), true, undefined, localeInstance);
        if (cardinalWords.length > 0) {
            // We need to convert only the last number word to ordinal form
            // For composite numbers like 21 (Twenty One), only "One" should become "First"
            // For 1000 (One Thousand), "Thousand" becomes "Thousandth"
            const lastWordIndex = cardinalWords.length - 1;
            const lastWord = cardinalWords[lastWordIndex];
            // Find what number the last word represents
            const lastNumberComponent = this.getLastNumberComponent(number, localeConfig);
            // Try to find ordinal mapping for the last component
            if (localeConfig.ordinalWordsMapping) {
                const ordinalMatch = localeConfig.ordinalWordsMapping.find((m) => m.number === lastNumberComponent);
                if (ordinalMatch) {
                    cardinalWords[lastWordIndex] = ordinalMatch.value;
                    return cardinalWords;
                }
            }
            // If ordinalSuffix is available, use it
            if (localeConfig.ordinalSuffix) {
                cardinalWords[lastWordIndex] = lastWord + localeConfig.ordinalSuffix;
            }
        }
        return cardinalWords;
    }
    getLastNumberComponent(number, localeConfig) {
        // Find the last number component that makes up this number
        // This is locale-aware: Hindi/Indic locales have atomic words for 21-99,
        // while English composes them (Twenty + One)
        // For numbers 1-20, return the number itself
        if (number <= 20) {
            return number;
        }
        // Get the units defined in the locale (sorted descending)
        const unitMappings = localeConfig.numberWordsMapping
            .filter((m) => Number(m.number) >= 100) // Units are 100 and above
            .sort((a, b) => Number(b.number) - Number(a.number));
        // Find if this is a round number ending in a unit
        for (const mapping of unitMappings) {
            const unit = Number(mapping.number);
            if (number % unit === 0) {
                // This number is a multiple of this unit
                // Return the unit itself (e.g., for 1000000 = 10 × 100000, return 100000)
                return unit;
            }
        }
        // Get the last two digits
        const lastTwoDigits = number % 100;
        // Check if locale has atomic word for the last two digits (1-99)
        // This is true for Hindi, Bengali, Gujarati, Marathi, etc.
        // For numbers like 111 (last two digits = 11), check if locale has word for 11
        if (lastTwoDigits >= 1 && lastTwoDigits <= 99) {
            const hasAtomicWord = localeConfig.numberWordsMapping.some((m) => Number(m.number) === lastTwoDigits);
            if (hasAtomicWord) {
                return lastTwoDigits;
            }
        }
        // For English-style locales that compose 21-99 (Twenty + One)
        // Check for decade (20, 30, 40, etc.)
        if (lastTwoDigits % 10 === 0) {
            return lastTwoDigits;
        }
        // Return the ones digit
        return number % 10;
    }
    convertNumber(number) {
        const locale = this.getLocale();
        const localeConfig = locale.config;
        const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
        if (isNegativeNumber) {
            number = typeof number === 'bigint' ? -number : Math.abs(number);
        }
        const isBigInt = typeof number === 'bigint';
        const isFloat = !isBigInt && this.isFloat(number);
        let integerPart;
        let fractionalPart = '';
        if (isBigInt) {
            integerPart = number;
        }
        else if (isFloat) {
            const segments = number.toString().split('.');
            integerPart = BigInt(segments[0]);
            fractionalPart = segments[1] ?? '';
        }
        else {
            integerPart = BigInt(Math.trunc(number));
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
            if (fractionalPart.startsWith('0') && !localeConfig?.decimalLengthWordMapping) {
                const zeroWords = [];
                for (const num of fractionalPart) {
                    zeroWords.push(...this.convertInternal(BigInt(num), true, undefined, locale));
                }
                wordsWithDecimal.push(...zeroWords);
            }
            else if (fractionalPart.length) {
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
    convertCurrency(number, options = {}) {
        const locale = this.getLocale();
        const localeConfig = locale.config;
        const currencyOptions = options.currencyOptions ?? localeConfig.currency;
        const isNegativeNumber = number < 0 || (typeof number === 'bigint' && number < 0n);
        if (isNegativeNumber) {
            number = typeof number === 'bigint' ? -number : Math.abs(number);
        }
        const isBigInt = typeof number === 'bigint';
        if (!isBigInt) {
            number = this.toFixed(number);
        }
        // Extra check for isFloat to overcome 1.999 rounding off to 2
        const isFloat = !isBigInt && this.isFloat(number);
        let mainAmount;
        let fractionalPart = '';
        if (isBigInt) {
            mainAmount = number;
        }
        else if (isFloat) {
            const segments = number.toString().split('.');
            mainAmount = BigInt(segments[0]);
            fractionalPart = segments[1] ?? '';
        }
        else {
            mainAmount = BigInt(Math.trunc(number));
        }
        let words = [];
        const mainAmountNum = mainAmount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(mainAmount) : -1;
        if (mainAmountNum !== -1 && currencyOptions.numberSpecificForms?.[mainAmountNum]) {
            words = [currencyOptions.numberSpecificForms[mainAmountNum]];
        }
        else {
            // Determine if the main currency should be in singular form
            // e.g. 1 Dollar Only instead of 1 Dollars Only
            words = [...this.convertInternal(mainAmount, false, undefined, locale)];
            if (mainAmount === 1n && currencyOptions.singular) {
                words.push(currencyOptions.singular);
            }
            else if (currencyOptions.plural) {
                words.push(currencyOptions.plural);
            }
        }
        const ignoreZero = this.isNumberZero(number) &&
            (options.ignoreZeroCurrency || (localeConfig?.ignoreZeroInDecimals && number !== 0 && number !== 0n));
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
            const decimalLengthWord = localeConfig?.decimalLengthWordMapping?.[fractionalPart.length];
            if (currencyOptions.fractionalUnit.numberSpecificForms?.[decimalPart]) {
                wordsWithDecimal.push(currencyOptions.fractionalUnit.numberSpecificForms[decimalPart]);
            }
            else {
                wordsWithDecimal.push(...this.convertInternal(BigInt(decimalPart), false, undefined, locale));
                if (decimalLengthWord?.length) {
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
        const locale = localeInstance ?? this.getLocale();
        const localeConfig = locale.config;
        const cache = this.getLocaleCache(locale);
        const numberAsNum = number <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(number) : -1;
        if (numberAsNum !== -1 && overrides[numberAsNum]) {
            return [overrides[numberAsNum]];
        }
        // Check exactWordsMapping using O(1) Map lookup
        const exactMatch = cache.exactWordsMap.get(number);
        if (exactMatch) {
            return [trailing && Array.isArray(exactMatch.value) ? exactMatch.value[1] : exactMatch.resolvedValue];
        }
        // Fast path: Use O(1) Map lookup for small numbers (0-100)
        let match;
        if (number <= 100n) {
            const directMatch = cache.smallNumbersMap.get(number);
            if (directMatch) {
                return [trailing && Array.isArray(directMatch.value) ? directMatch.value[1] : directMatch.resolvedValue];
            }
            // Number not directly in map, use binary search (e.g., 21 = 20 + 1)
            match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
        }
        else {
            // Use binary search on pre-computed BigInt values (array is sorted descending)
            match = this.binarySearchDescending(cache.numberWordsMappingBigInt, number);
        }
        const matchNumber = match.numberBigInt;
        const words = [];
        if (number <= 100n || (number < 1000n && localeConfig.namedLessThan1000)) {
            words.push(match.resolvedValue);
            number -= matchNumber;
            if (number > 0n) {
                if (localeConfig.splitWord) {
                    words.push(localeConfig.splitWord);
                }
                words.push(...this.convertInternal(number, trailing, overrides, locale));
            }
            return words;
        }
        const quotient = number / matchNumber;
        const remainder = number % matchNumber;
        let matchValue = match.resolvedValue;
        const originalMatchValue = match.resolvedValue;
        const matchNumberNum = Number(matchNumber);
        const pluralForms = localeConfig?.pluralForms?.[matchNumberNum];
        let usedPluralForm = false;
        // Check if this word uses ignoreOneForWords
        const usesIgnoreOne = localeConfig?.ignoreOneForWords?.includes(originalMatchValue);
        if (pluralForms) {
            const lastTwoDigits = Number(quotient % 100n);
            const useLastDigits = quotient >= 11n && lastTwoDigits >= 3 && lastTwoDigits <= 10;
            if (quotient === 2n && pluralForms.dual) {
                matchValue = pluralForms.dual;
                usedPluralForm = true;
            }
            else if ((quotient >= BigInt(localeConfig?.paucalConfig?.min ?? 3) &&
                quotient <= BigInt(localeConfig?.paucalConfig?.max ?? 10)) ||
                useLastDigits) {
                if (pluralForms.paucal) {
                    matchValue = pluralForms.paucal;
                }
            }
            else if (quotient >= 11n && pluralForms.plural) {
                matchValue = pluralForms.plural;
            }
        }
        else {
            if (quotient > 1n &&
                localeConfig?.pluralWords?.find((word) => word === match.value) &&
                localeConfig?.pluralMark) {
                matchValue += localeConfig.pluralMark;
            }
            // Apply singularValue only when quotient ends in 1 AND this word doesn't use ignoreOneForWords
            // For ignoreOneForWords words, singularValue is handled separately below
            if (quotient % 10n === 1n && !usesIgnoreOne) {
                matchValue = match.singularValue || (Array.isArray(matchValue) ? matchValue[0] : matchValue);
            }
        }
        if ((quotient === 1n && usesIgnoreOne) || usedPluralForm) {
            // When ignoring "one" and quotient is exactly 1, use singularValue if available
            const valueToUse = quotient === 1n && match.singularValue ? match.singularValue : matchValue;
            words.push(valueToUse);
        }
        else {
            words.push(...this.convertInternal(quotient, false, overrides, locale), matchValue);
        }
        if (remainder > 0n) {
            if (localeConfig.splitWord) {
                if (!localeConfig.noSplitWordAfter?.includes(match.resolvedValue)) {
                    words.push(localeConfig.splitWord);
                }
            }
            words.push(...this.convertInternal(remainder, trailing, overrides, locale));
        }
        return words;
    }
    /**
     * Binary search on a descending-sorted array of CachedNumberWordMap.
     * Finds the first element where numberBigInt <= target.
     */
    binarySearchDescending(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        let result = arr[arr.length - 1]; // Default to smallest (last element)
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid].numberBigInt <= target) {
                result = arr[mid];
                right = mid - 1; // Look for larger match in left half
            }
            else {
                left = mid + 1; // Look in right half
            }
        }
        return result;
    }
    toFixed(number, precision = 2) {
        return Number(Number(number).toFixed(precision));
    }
    isFloat(number) {
        return Number(number) === number && number % 1 !== 0;
    }
    isValidNumber(number) {
        if (typeof number === 'bigint') {
            return true;
        }
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
    isNumberZero(number) {
        if (typeof number === 'bigint') {
            return number === 0n;
        }
        return number >= 0 && number < 1;
    }
}
exports.ToWords = ToWords;
