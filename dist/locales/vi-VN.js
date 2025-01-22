"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Locale {
    constructor() {
        this.config = {
            currency: {
                name: 'Việt Nam Đồng',
                plural: 'Việt Nam Đồng',
                singular: 'Dong',
                symbol: '₫',
                fractionalUnit: {
                    name: '',
                    plural: '',
                    singular: '',
                    symbol: '',
                },
            },
            texts: {
                and: 'Và',
                minus: 'Âm',
                only: 'Chỉ',
                point: 'Phẩy',
            },
            numberWordsMapping: [
                { number: 1000000000000000, value: 'Ngàn triệu tỷ' },
                { number: 1000000000000, value: 'Nghìn tỷ' },
                { number: 1000000000, value: 'Tỷ' },
                { number: 1000000, value: 'Triệu' },
                { number: 1000, value: 'Nghìn' },
                { number: 100, value: 'Trăm' },
                { number: 90, value: 'Chín mươi' },
                { number: 80, value: 'Tám mươi' },
                { number: 70, value: 'Bảy mươi' },
                { number: 60, value: 'Sáu mươi' },
                { number: 50, value: 'Năm mươi' },
                { number: 40, value: 'Bốn mươi' },
                { number: 30, value: 'Ba mươi' },
                { number: 20, value: 'Hai mươi' },
                { number: 19, value: 'Mười chín' },
                { number: 18, value: 'Mười tám' },
                { number: 17, value: 'Mười bảy' },
                { number: 16, value: 'Mười sáu' },
                { number: 15, value: 'Mười lăm' },
                { number: 14, value: 'Mười bốn' },
                { number: 13, value: 'Mười ba' },
                { number: 12, value: 'Mười hai' },
                { number: 11, value: 'Mười một' },
                { number: 10, value: 'Mười' },
                { number: 9, value: 'Chín' },
                { number: 8, value: 'Tám' },
                { number: 7, value: 'Bảy' },
                { number: 6, value: 'Sáu' },
                { number: 5, value: 'Năm' },
                { number: 4, value: 'Bốn' },
                { number: 3, value: 'Ba' },
                { number: 2, value: 'Hai' },
                { number: 1, value: 'Một' },
                { number: 0, value: 'Không' },
            ],
            exactWordsMapping: [
                { number: 100, value: 'Một trăm' },
                { number: 1000, value: 'Một nghìn' },
                { number: 1000000, value: 'Một triệu' },
                { number: 1000000000, value: 'Một tỷ' },
                { number: 1000000000000, value: 'Một nghìn tỷ' },
                { number: 1000000000000000, value: 'Một triệu tỷ' },
            ],
        };
    }
}
exports.default = Locale;
