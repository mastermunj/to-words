import { LocaleConfig, LocaleInterface } from '../types';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'रुपया',
      plural: 'रुपये',
      singular: 'रुपया',
      symbol: '₹',
      fractionalUnit: {
        name: 'पैसा',
        singular: 'पैसा',
        plural: 'पैसे',
        symbol: '',
      },
    },
    texts: {
      and: 'और',
      minus: 'ऋण',
      only: '',
      point: 'दशांश',
    },
    numberWordsMapping: [
      { number: 10000000, value: 'करोड़' },
      { number: 100000, value: 'लाख' },
      { number: 1000, value: 'हज़ार' },
      { number: 100, value: 'सौ' },
      { number: 99, value: 'निन्यानवे' },
      { number: 98, value: 'अट्ठानवे' },
      { number: 97, value: 'सत्तानवे' },
      { number: 96, value: 'छियानवे' },
      { number: 95, value: 'पचानवे' },
      { number: 94, value: 'चौरानवे' },
      { number: 93, value: 'तिरानवे' },
      { number: 92, value: 'बानवे' },
      { number: 91, value: 'इक्यानबे' },
      { number: 90, value: 'नब्बे' },
      { number: 89, value: 'नवासी' },
      { number: 88, value: 'अठासी' },
      { number: 87, value: 'सतासी' },
      { number: 86, value: 'छियासी' },
      { number: 85, value: 'पचासी' },
      { number: 84, value: 'चौरासी' },
      { number: 83, value: 'तिरासी' },
      { number: 82, value: 'बयासी' },
      { number: 81, value: 'इक्यासी' },
      { number: 80, value: 'अस्सी' },
      { number: 79, value: 'उनासी' },
      { number: 78, value: 'अठहत्तर' },
      { number: 77, value: 'सतहत्तर' },
      { number: 76, value: 'छिहत्तर' },
      { number: 75, value: 'पचहत्तर' },
      { number: 74, value: 'चौहत्तर' },
      { number: 73, value: 'तिहत्तर' },
      { number: 72, value: 'बहत्तर' },
      { number: 71, value: 'इकहत्तर' },
      { number: 70, value: 'सत्तर' },
      { number: 69, value: 'उनहत्तर' },
      { number: 68, value: 'अड़सठ' },
      { number: 67, value: 'सड़सठ' },
      { number: 66, value: 'छियासठ' },
      { number: 65, value: 'पैंसठ' },
      { number: 64, value: 'चौंसठ' },
      { number: 63, value: 'तिरसठ' },
      { number: 62, value: 'बासठ' },
      { number: 61, value: 'इकसठ' },
      { number: 60, value: 'साठ' },
      { number: 59, value: 'उनसठ' },
      { number: 58, value: 'अट्ठावन' },
      { number: 57, value: 'सत्तावन' },
      { number: 56, value: 'छप्पन' },
      { number: 55, value: 'पचपन' },
      { number: 54, value: 'चौबन' },
      { number: 53, value: 'तिरेपन' },
      { number: 52, value: 'बावन' },
      { number: 51, value: 'इक्याबन' },
      { number: 50, value: 'पचास' },
      { number: 49, value: 'उनचास' },
      { number: 48, value: 'अड़तालीस' },
      { number: 47, value: 'सैंतालीस' },
      { number: 46, value: 'छियालीस' },
      { number: 45, value: 'पैंतालीस' },
      { number: 44, value: 'चौंतालीस' },
      { number: 43, value: 'तैंतालीस' },
      { number: 42, value: 'बयालीस' },
      { number: 41, value: 'इकतालीस' },
      { number: 40, value: 'चालीस' },
      { number: 39, value: 'उनतालीस' },
      { number: 38, value: 'अड़तीस' },
      { number: 37, value: 'सैंतीस' },
      { number: 36, value: 'छत्तीस' },
      { number: 35, value: 'पैंतीस' },
      { number: 34, value: 'चौंतीस' },
      { number: 33, value: 'तैंतीस' },
      { number: 32, value: 'बत्तीस' },
      { number: 31, value: 'इकतीस' },
      { number: 30, value: 'तीस' },
      { number: 29, value: 'उनतीस' },
      { number: 28, value: 'अट्ठाईस' },
      { number: 27, value: 'सत्ताईस' },
      { number: 26, value: 'छब्बीस' },
      { number: 25, value: 'पच्चीस' },
      { number: 24, value: 'चौबीस' },
      { number: 23, value: 'तेईस' },
      { number: 22, value: 'बाईस' },
      { number: 21, value: 'इक्कीस' },
      { number: 20, value: 'बीस' },
      { number: 19, value: 'उन्नीस' },
      { number: 18, value: 'अठारह' },
      { number: 17, value: 'सत्रह' },
      { number: 16, value: 'सोलह' },
      { number: 15, value: 'पंद्रह' },
      { number: 14, value: 'चौदह' },
      { number: 13, value: 'तेरह' },
      { number: 12, value: 'बारह' },
      { number: 11, value: 'ग्यारह' },
      { number: 10, value: 'दस' },
      { number: 9, value: 'नौ' },
      { number: 8, value: 'आठ' },
      { number: 7, value: 'सात' },
      { number: 6, value: 'छह' },
      { number: 5, value: 'पांच' },
      { number: 4, value: 'चार' },
      { number: 3, value: 'तीन' },
      { number: 2, value: 'दो' },
      { number: 1, value: 'एक' },
      { number: 0, value: 'शून्य' },
    ],
  };
}
