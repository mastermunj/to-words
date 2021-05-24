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
    numberWordsMapping: {
        number: number;
        value: string;
    }[];
}
