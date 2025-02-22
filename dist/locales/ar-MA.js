"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Locale {
    constructor() {
        this.config = {
            currency: {
                name: 'درهم',
                plural: 'دراهم',
                singular: 'درهم',
                symbol: 'DH',
                fractionalUnit: {
                    name: 'سنتيم',
                    singular: 'سنتيم',
                    plural: 'سنتيمات',
                    symbol: 'سنتيم',
                },
            },
            texts: {
                and: 'و',
                minus: 'ناقص',
                only: 'فقط',
                point: 'فاصلة',
            },
            numberWordsMapping: [
                { number: 1000000000000000, value: 'كوادريليون' },
                { number: 1000000000000, value: 'تريليون' },
                { number: 1000000000, value: 'مليار' },
                { number: 1000000, value: 'مليون' },
                { number: 1000, value: 'ألف' },
                { number: 100, value: 'مائة' },
                { number: 90, value: 'تسعون' },
                { number: 80, value: 'ثمانون' },
                { number: 70, value: 'سبعون' },
                { number: 60, value: 'ستون' },
                { number: 50, value: 'خمسون' },
                { number: 40, value: 'أربعون' },
                { number: 30, value: 'ثلاثون' },
                { number: 20, value: 'عشرون' },
                { number: 19, value: 'تسعة عشر' },
                { number: 18, value: 'ثمانية عشر' },
                { number: 17, value: 'سبعة عشر' },
                { number: 16, value: 'ستة عشر' },
                { number: 15, value: 'خمسة عشر' },
                { number: 14, value: 'أربعة عشر' },
                { number: 13, value: 'ثلاثة عشر' },
                { number: 12, value: 'اثنا عشر' },
                { number: 11, value: 'أحد عشر' },
                { number: 10, value: 'عشرة' },
                { number: 9, value: 'تسعة' },
                { number: 8, value: 'ثمانية' },
                { number: 7, value: 'سبعة' },
                { number: 6, value: 'ستة' },
                { number: 5, value: 'خمسة' },
                { number: 4, value: 'أربعة' },
                { number: 3, value: 'ثلاثة' },
                { number: 2, value: 'اثنان' },
                { number: 1, value: 'واحد' },
                { number: 0, value: 'صفر' },
            ],
            ignoreOneForWords: ['مائة', 'ألف'],
            pluralMark: 'ات',
            pluralWords: ['مليون', 'مليار', 'تريليون'],
        };
    }
}
exports.default = Locale;
