import { LocaleInterface } from './locale.interface';
export declare class Locale implements LocaleInterface {
    currency: {
        name: string;
        plural: string;
        symbol: string;
        fractionalUnit: {
            name: string;
            plural: string;
            symbol: string;
        };
    };
    texts: {
        and: string;
        minus: string;
        only: string;
        point: string;
    };
    options: {
        namedLessThan1000: boolean;
        splitWord: string;
        ignoreZeroInDecimals: boolean;
    };
    decimalLengthWordMapping: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
    };
    numberWordsMapping: {
        number: number;
        value: string;
    }[];
}
