"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Locale {
    constructor() {
        this.config = {
            currency: {
                name: 'euro',
                plural: 'euro',
                symbol: '€',
                fractionalUnit: {
                    name: 'cents',
                    plural: 'centi',
                    symbol: '',
                },
            },
            texts: {
                and: 'un',
                minus: 'mīnus',
                only: '',
                point: 'punkts',
            },
            numberWordsMapping: [
                { number: 1000000000000000, value: 'kvadriljoni' },
                { number: 1000000000000, value: 'triljoni' },
                { number: 1000000000, value: 'miljardi' },
                { number: 1000000, value: 'miljoni' },
                { number: 1000, value: 'tūkstoši' },
                { number: 900, value: 'deviņi simti' },
                { number: 800, value: 'astoņi simti' },
                { number: 700, value: 'septiņi simti' },
                { number: 600, value: 'seši simti' },
                { number: 500, value: 'pieci simti' },
                { number: 400, value: 'četri simti' },
                { number: 300, value: 'trīs simti' },
                { number: 200, value: 'divi simti' },
                { number: 100, value: 'simtu' },
                { number: 90, value: 'deviņdesmit' },
                { number: 80, value: 'astoņdesmit' },
                { number: 70, value: 'septiņdesmit' },
                { number: 60, value: 'sešdesmit' },
                { number: 50, value: 'piecdesmit' },
                { number: 40, value: 'četrdesmit' },
                { number: 30, value: 'trīsdesmit' },
                { number: 20, value: 'divdesmit' },
                { number: 19, value: 'deviņpadsmit' },
                { number: 18, value: 'astoņpadsmit' },
                { number: 17, value: 'septiņpadsmit' },
                { number: 16, value: 'sešpadsmit' },
                { number: 15, value: 'piecpadsmit' },
                { number: 14, value: 'četrdpadsmit' },
                { number: 13, value: 'trīspadsmit' },
                { number: 12, value: 'divpadsmit' },
                { number: 11, value: 'vienpadsmit' },
                { number: 10, value: 'desmit' },
                { number: 9, value: 'deviņi' },
                { number: 8, value: 'astoņi' },
                { number: 7, value: 'septiņi' },
                { number: 6, value: 'seši' },
                { number: 5, value: 'pieci' },
                { number: 4, value: 'četri' },
                { number: 3, value: 'trīs' },
                { number: 2, value: 'divi' },
                { number: 1, value: 'viens' },
                { number: 0, value: 'nulle' },
            ],
            ignoreOneForWords: [
                'simtu',
                'divi simti',
                'trīs simti',
                'četri simti',
                'pieci simti',
                'seši simti',
                'septiņi simti',
                'astoņi simti',
                'deviņi simti',
            ],
        };
    }
}
exports.default = Locale;