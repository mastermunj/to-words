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

  splitters?: {
    splitWord?: string;
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
