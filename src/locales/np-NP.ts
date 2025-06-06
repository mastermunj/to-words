import { LocaleConfig, LocaleInterface } from '../types';

export default class Locale implements LocaleInterface {
  public config: LocaleConfig = {
    currency: {
      name: 'रुपैयाँ',
      plural: 'रुपैयाँ',
      singular: 'रुपैयाँ',
      symbol: 'रु',
      fractionalUnit: {
        name: 'पैसा',
        singular: 'पैसा',
        plural: 'पैसा',
        symbol: '',
      },
    },
    texts: {
      and: 'र',
      minus: 'माइनस',
      only: 'मात्र',
      point: 'दशमलब',
    },
    numberWordsMapping: [
      { number: 1_00_00_00_00_000, value: 'खर्ब' },
      { number: 1_00_00_00_000, value: 'अर्ब' },
      { number: 1_00_00_000, value: 'करोड' },
      { number: 1_00_000, value: 'लाख' },
      { number: 1_000, value: 'हजार' },
      { number: 100, value: 'सय' },
      { number: 99, value: 'उनान्सय' },
      { number: 98, value: 'अन्ठानब्बे' },
      { number: 97, value: 'सन्तानब्बे' },
      { number: 96, value: 'छयानब्बे' },
      { number: 95, value: 'पन्चानब्बे' },
      { number: 94, value: 'चौरानब्बे' },
      { number: 93, value: 'त्रियानब्बे' },
      { number: 92, value: 'बयान्नब्बे' },
      { number: 91, value: 'एकानब्बे' },
      { number: 90, value: 'नब्बे' },
      { number: 89, value: 'उनान्नब्बे' },
      { number: 88, value: 'अठासी' },
      { number: 87, value: 'सतासी' },
      { number: 86, value: 'छयासी' },
      { number: 85, value: 'पचासी' },
      { number: 84, value: 'चौरासी' },
      { number: 83, value: 'त्रियासी' },
      { number: 82, value: 'बयासी' },
      { number: 81, value: 'एकासी' },
      { number: 80, value: 'अस्सी' },
      { number: 79, value: 'उनासी' },
      { number: 78, value: 'अठहत्तर' },
      { number: 77, value: 'सतहत्तर' },
      { number: 76, value: 'छयहत्तर' },
      { number: 75, value: 'पचहत्तर' },
      { number: 74, value: 'चौहत्तर' },
      { number: 73, value: 'त्रिहत्तर' },
      { number: 72, value: 'बहत्तर' },
      { number: 71, value: 'एकहत्तर' },
      { number: 70, value: 'सत्तरी' },
      { number: 69, value: 'उनन्सत्तरी' },
      { number: 68, value: 'अठसट्ठी' },
      { number: 67, value: 'सड्सट्ठी' },
      { number: 66, value: 'छैंसट्ठी' },
      { number: 65, value: 'पैंसट्ठी' },
      { number: 64, value: 'चौंसट्ठी' },
      { number: 63, value: 'त्रिसट्ठी' },
      { number: 62, value: 'बइसट्ठी' },
      { number: 61, value: 'एकसट्ठी' },
      { number: 60, value: 'साठी' },
      { number: 59, value: 'उनन्साठी' },
      { number: 58, value: 'अन्ठाउन्न' },
      { number: 57, value: 'सन्ताउन्न' },
      { number: 56, value: 'छपन्न' },
      { number: 55, value: 'पचपन्न' },
      { number: 54, value: 'चवन्न' },
      { number: 53, value: 'त्रिपन्न' },
      { number: 52, value: 'बाउन्न' },
      { number: 51, value: 'एकाउन्न' },
      { number: 50, value: 'पचास' },
      { number: 49, value: 'उनन्चास' },
      { number: 48, value: 'अठचालीस' },
      { number: 47, value: 'सट्चालीस' },
      { number: 46, value: 'छयालीस' },
      { number: 45, value: 'पैंतालीस' },
      { number: 44, value: 'चवालीस' },
      { number: 43, value: 'त्रिचालीस' },
      { number: 42, value: 'बयालीस' },
      { number: 41, value: 'एकचालीस' },
      { number: 40, value: 'चालीस' },
      { number: 39, value: 'उनन्चालीस' },
      { number: 38, value: 'अठतीस' },
      { number: 37, value: 'सैंतीस' },
      { number: 36, value: 'छत्तीस' },
      { number: 35, value: 'पैंतीस' },
      { number: 34, value: 'चौँतीस' },
      { number: 33, value: 'तेत्तीस' },
      { number: 32, value: 'बत्तीस' },
      { number: 31, value: 'एकतीस' },
      { number: 30, value: 'तीस' },
      { number: 29, value: 'उनन्तिस' },
      { number: 28, value: 'अठ्ठाइस' },
      { number: 27, value: 'सत्ताइस' },
      { number: 26, value: 'छब्बिस' },
      { number: 25, value: 'पच्चिस' },
      { number: 24, value: 'चौबीस' },
      { number: 23, value: 'तेइस' },
      { number: 22, value: 'बाइस' },
      { number: 21, value: 'एक्काइस' },
      { number: 20, value: 'बीस' },
      { number: 19, value: 'उन्नाइस' },
      { number: 18, value: 'अठार' },
      { number: 17, value: 'सत्र' },
      { number: 16, value: 'सोह्र' },
      { number: 15, value: 'पन्ध्र' },
      { number: 14, value: 'चौध' },
      { number: 13, value: 'तेह्र' },
      { number: 12, value: 'बाह्र' },
      { number: 11, value: 'एघार' },
      { number: 10, value: 'दश' },
      { number: 9, value: 'नौ' },
      { number: 8, value: 'आठ' },
      { number: 7, value: 'सात' },
      { number: 6, value: 'छ' },
      { number: 5, value: 'पाँच' },
      { number: 4, value: 'चार' },
      { number: 3, value: 'तीन' },
      { number: 2, value: 'दुई' },
      { number: 1, value: 'एक' },
      { number: 0, value: 'शून्य' },
    ],
    exactWordsMapping: [{ number: 100, value: 'एक सय' }],
  };
}
