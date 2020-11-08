export interface LocaleInterface {
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
    options?: {
        namedLessThan1000?: boolean;
        splitWord?: string;
        ignoreZeroInDecimals?: boolean;
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
    decimalLengthWordMapping?: {
        [decimalLength: number]: string;
    };
}
