"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Locale {
    constructor() {
        this.config = {
            currency: {
                name: 'Zloty',
                plural: 'Zlotys',
                symbol: 'zł',
                fractionalUnit: {
                    name: 'Grosz',
                    plural: 'Groszy',
                    symbol: 'gr',
                },
            },
            texts: {
                and: 'Oraz',
                minus: 'Minus',
                only: 'Tylko',
                point: 'Punkt',
            },
            numberWordsMapping: [
                { number: 1000000000000000, value: 'Quadrillion' },
                { number: 1000000000000, value: 'Trylion' },
                { number: 1000000000, value: 'Miliard' },
                { number: 1000000, value: 'Milion' },
                { number: 1000, value: 'Thousand' },
                { number: 100, value: 'Sto' },
                { number: 90, value: 'Dziewięćdziesiąt' },
                { number: 80, value: 'Osiemdziesiąt' },
                { number: 70, value: 'Siedemdziesiąt' },
                { number: 60, value: 'Sześćdziesiąt' },
                { number: 50, value: 'Pięćdziesiąt' },
                { number: 40, value: 'Czterdzieści' },
                { number: 30, value: 'Trzydzieści' },
                { number: 20, value: 'Dwadzieścia' },
                { number: 19, value: 'Dziewiętnaście' },
                { number: 18, value: 'Osiemnaście' },
                { number: 17, value: 'Siedemnaście' },
                { number: 16, value: 'Szesnaście' },
                { number: 15, value: 'Piętnaście' },
                { number: 14, value: 'Czternaście' },
                { number: 13, value: 'Trzynaście' },
                { number: 12, value: 'Dwanaście' },
                { number: 11, value: 'Jedenaście' },
                { number: 10, value: 'Ten' },
                { number: 9, value: 'Dziewięć' },
                { number: 8, value: 'Osiem' },
                { number: 7, value: 'Siedem' },
                { number: 6, value: 'Sześć' },
                { number: 5, value: 'Pięć' },
                { number: 4, value: 'Cztery' },
                { number: 3, value: 'Trzy' },
                { number: 2, value: 'Dwa' },
                { number: 1, value: 'Jeden' },
                { number: 0, value: 'Zero' },
            ],
            exactWordsMapping: [{ number: 100, value: 'Sto' }],
        };
    }
}
exports.default = Locale;
