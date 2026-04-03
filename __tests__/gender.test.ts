import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords.js';

describe('Gender-aware cardinals', () => {
  describe('Spanish (es-ES)', () => {
    const toWords = new ToWords({ localeCode: 'es-ES' });

    const testCases: [number, string, string][] = [
      // [input, masculine (default), feminine]
      [1, 'Uno', 'Una'],
      [21, 'Veintiuno', 'Veintiuna'],
      [200, 'Doscientos', 'Doscientas'],
      [300, 'Trescientos', 'Trescientas'],
      [400, 'Cuatrocientos', 'Cuatrocientas'],
      [500, 'Quinientos', 'Quinientas'],
      [600, 'Seiscientos', 'Seiscientas'],
      [700, 'Setecientos', 'Setecientas'],
      [800, 'Ochocientos', 'Ochocientas'],
      [900, 'Novecientos', 'Novecientas'],
    ];

    test.each(testCases)('convert %d: default=%s, feminine=%s', (input, masculine, feminine) => {
      expect(toWords.convert(input)).toBe(masculine);
      expect(toWords.convert(input, { gender: 'feminine' })).toBe(feminine);
      expect(toWords.convert(input, { gender: 'masculine' })).toBe(masculine);
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Doscientas Una');
    });

    test('composite: 521 feminine', () => {
      expect(toWords.convert(521, { gender: 'feminine' })).toBe('Quinientas Veintiuna');
    });

    test('composite: 1001 feminine', () => {
      // "Mil" is a scale word — quotient does NOT get gender
      expect(toWords.convert(1001, { gender: 'feminine' })).toBe('Mil Una');
    });

    test('zero is ungendered', () => {
      expect(toWords.convert(0, { gender: 'feminine' })).toBe('Cero');
    });

    test('non-gendered numbers unchanged', () => {
      expect(toWords.convert(10, { gender: 'feminine' })).toBe('Diez');
      expect(toWords.convert(50, { gender: 'feminine' })).toBe('Cincuenta');
      expect(toWords.convert(100, { gender: 'feminine' })).toBe('Cien');
    });
  });

  describe('Spanish (es-MX)', () => {
    const toWords = new ToWords({ localeCode: 'es-MX' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('200 feminine', () => {
      expect(toWords.convert(200, { gender: 'feminine' })).toBe('Doscientas');
    });
  });

  describe('Spanish (es-CO)', () => {
    const toWords = new ToWords({ localeCode: 'es-CO' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
      expect(toWords.convert(1, { gender: 'masculine' })).toBe('Uno');
    });

    test('21 feminine', () => {
      expect(toWords.convert(21, { gender: 'feminine' })).toBe('Veintiuna');
    });

    test('200 feminine', () => {
      expect(toWords.convert(200, { gender: 'feminine' })).toBe('Doscientas');
    });

    test('composite: 521 feminine', () => {
      expect(toWords.convert(521, { gender: 'feminine' })).toBe('Quinientas Veintiuna');
    });
  });

  describe('Spanish (es-CL)', () => {
    const toWords = new ToWords({ localeCode: 'es-CL' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Doscientas Una');
    });
  });

  describe('Spanish (es-AR)', () => {
    const toWords = new ToWords({ localeCode: 'es-AR' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('500 feminine', () => {
      expect(toWords.convert(500, { gender: 'feminine' })).toBe('Quinientas');
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Doscientas Una');
    });
  });

  describe('Spanish (es-VE)', () => {
    const toWords = new ToWords({ localeCode: 'es-VE' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('21 feminine', () => {
      expect(toWords.convert(21, { gender: 'feminine' })).toBe('Veintiuna');
    });

    test('composite: 521 feminine', () => {
      expect(toWords.convert(521, { gender: 'feminine' })).toBe('Quinientas Veintiuna');
    });
  });

  describe('Spanish (es-US)', () => {
    const toWords = new ToWords({ localeCode: 'es-US' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('200 feminine', () => {
      expect(toWords.convert(200, { gender: 'feminine' })).toBe('Doscientas');
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Doscientas Una');
    });
  });

  describe('Portuguese (pt-BR)', () => {
    const toWords = new ToWords({ localeCode: 'pt-BR' });

    const testCases: [number, string, string][] = [
      [1, 'Um', 'Uma'],
      [2, 'Dois', 'Duas'],
      [200, 'Duzentos', 'Duzentas'],
      [300, 'Trezentos', 'Trezentas'],
      [400, 'Quatrocentos', 'Quatrocentas'],
      [500, 'Quinhentos', 'Quinhentas'],
      [600, 'Seiscentos', 'Seiscentas'],
      [700, 'Setecentos', 'Setecentas'],
      [800, 'Oitocentos', 'Oitocentas'],
      [900, 'Novecentos', 'Novecentas'],
    ];

    test.each(testCases)('convert %d: default=%s, feminine=%s', (input, masculine, feminine) => {
      expect(toWords.convert(input)).toBe(masculine);
      expect(toWords.convert(input, { gender: 'feminine' })).toBe(feminine);
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Duzentas E Uma');
    });

    test('composite: 502 feminine', () => {
      expect(toWords.convert(502, { gender: 'feminine' })).toBe('Quinhentas E Duas');
    });
  });

  describe('Portuguese (pt-PT)', () => {
    const toWords = new ToWords({ localeCode: 'pt-PT' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Uma');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Duas');
    });

    test('300 feminine', () => {
      expect(toWords.convert(300, { gender: 'feminine' })).toBe('Trezentas');
    });
  });

  describe('Portuguese (pt-AO)', () => {
    const toWords = new ToWords({ localeCode: 'pt-AO' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Uma');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Duas');
    });

    test('200 feminine', () => {
      expect(toWords.convert(200, { gender: 'feminine' })).toBe('Duzentas');
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Duzentas E Uma');
    });

    test('composite: 502 feminine', () => {
      expect(toWords.convert(502, { gender: 'feminine' })).toBe('Quinhentas E Duas');
    });
  });

  describe('Portuguese (pt-MZ)', () => {
    const toWords = new ToWords({ localeCode: 'pt-MZ' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Uma');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Duas');
    });

    test('500 feminine', () => {
      expect(toWords.convert(500, { gender: 'feminine' })).toBe('Quinhentas');
    });

    test('composite: 201 feminine', () => {
      expect(toWords.convert(201, { gender: 'feminine' })).toBe('Duzentas E Uma');
    });
  });

  describe('Russian (ru-RU)', () => {
    const toWords = new ToWords({ localeCode: 'ru-RU' });

    test('1 default is masculine', () => {
      expect(toWords.convert(1)).toBe('Один');
    });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Одна');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Две');
    });

    test('2 masculine', () => {
      expect(toWords.convert(2, { gender: 'masculine' })).toBe('Два');
    });

    test('21 feminine', () => {
      expect(toWords.convert(21, { gender: 'feminine' })).toContain('Одна');
    });

    test('non-gendered numbers unchanged', () => {
      expect(toWords.convert(3, { gender: 'feminine' })).toBe(toWords.convert(3));
      expect(toWords.convert(10, { gender: 'feminine' })).toBe(toWords.convert(10));
    });
  });

  describe('Ukrainian (uk-UA)', () => {
    const toWords = new ToWords({ localeCode: 'uk-UA' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Одна');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Дві');
    });
  });

  describe('Polish (pl-PL)', () => {
    const toWords = new ToWords({ localeCode: 'pl-PL' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Jedna');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dwie');
    });
  });

  describe('Czech (cs-CZ)', () => {
    const toWords = new ToWords({ localeCode: 'cs-CZ' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Jedna');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dvě');
    });
  });

  describe('Croatian (hr-HR)', () => {
    const toWords = new ToWords({ localeCode: 'hr-HR' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Jedna');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dvije');
    });
  });

  describe('Slovak (sk-SK)', () => {
    const toWords = new ToWords({ localeCode: 'sk-SK' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Jedna');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dve');
    });
  });

  describe('Serbian (sr-RS)', () => {
    const toWords = new ToWords({ localeCode: 'sr-RS' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Jedna');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dve');
    });
  });

  describe('Belarusian (be-BY)', () => {
    const toWords = new ToWords({ localeCode: 'be-BY' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Адна');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Дзве');
    });
  });

  describe('Bulgarian (bg-BG)', () => {
    const toWords = new ToWords({ localeCode: 'bg-BG' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Една');
    });
  });

  describe('Catalan (ca-ES)', () => {
    const toWords = new ToWords({ localeCode: 'ca-ES' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dues');
    });

    test('200 feminine', () => {
      expect(toWords.convert(200, { gender: 'feminine' })).toBe('Dues-Centes');
    });

    test('500 feminine', () => {
      expect(toWords.convert(500, { gender: 'feminine' })).toBe('Cinc-Centes');
    });

    test('900 feminine', () => {
      expect(toWords.convert(900, { gender: 'feminine' })).toBe('Nou-Centes');
    });
  });

  describe('Romanian (ro-RO)', () => {
    const toWords = new ToWords({ localeCode: 'ro-RO' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Una');
    });
  });

  describe('Latvian (lv-LV)', () => {
    const toWords = new ToWords({ localeCode: 'lv-LV' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('viena');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('divas');
    });
  });

  describe('Lithuanian (lt-LT)', () => {
    const toWords = new ToWords({ localeCode: 'lt-LT' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Viena');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dvi');
    });
  });

  describe('Arabic (ar-AE)', () => {
    const toWords = new ToWords({ localeCode: 'ar-AE' });

    const testCases: [number, string, string][] = [
      [1, 'واحد', 'واحدة'],
      [2, 'اثنان', 'اثنتان'],
      [3, 'ثلاثة', 'ثلاث'],
      [5, 'خمسة', 'خمس'],
      [10, 'عشرة', 'عشر'],
      [11, 'أحد عشر', 'إحدى عشرة'],
      [13, 'ثلاثة عشر', 'ثلاث عشرة'],
    ];

    test.each(testCases)('convert %d: default=%s, feminine=%s', (input, masculine, feminine) => {
      expect(toWords.convert(input)).toBe(masculine);
      expect(toWords.convert(input, { gender: 'feminine' })).toBe(feminine);
    });

    test('composite: 21 feminine', () => {
      expect(toWords.convert(21, { gender: 'feminine' })).toBe('واحدة و عشرون');
    });

    test('composite: 99 feminine', () => {
      expect(toWords.convert(99, { gender: 'feminine' })).toBe('تسع و تسعون');
    });

    test('100 is ungendered', () => {
      expect(toWords.convert(100, { gender: 'feminine' })).toBe('مائة');
    });

    test('composite: 101 feminine', () => {
      expect(toWords.convert(101, { gender: 'feminine' })).toBe('مائة و واحدة');
    });

    test('composite: 1001 feminine', () => {
      expect(toWords.convert(1001, { gender: 'feminine' })).toBe('ألف و واحدة');
    });
  });

  describe('Arabic (ar-LB)', () => {
    const toWords = new ToWords({ localeCode: 'ar-LB' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('واحدة');
    });

    test('3 feminine', () => {
      expect(toWords.convert(3, { gender: 'feminine' })).toBe('ثلاث');
    });

    test('11 feminine', () => {
      expect(toWords.convert(11, { gender: 'feminine' })).toBe('إحدى عشرة');
    });

    test('composite: 101 feminine', () => {
      expect(toWords.convert(101, { gender: 'feminine' })).toBe('مائة و واحدة');
    });
  });

  describe('Arabic (ar-MA)', () => {
    const toWords = new ToWords({ localeCode: 'ar-MA' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('واحدة');
    });

    test('5 feminine', () => {
      expect(toWords.convert(5, { gender: 'feminine' })).toBe('خمس');
    });

    test('composite: 21 feminine', () => {
      expect(toWords.convert(21, { gender: 'feminine' })).toBe('واحدة و عشرون');
    });
  });

  describe('Arabic (ar-SA)', () => {
    const toWords = new ToWords({ localeCode: 'ar-SA' });

    test('1 feminine', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('واحدة');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('اثنتان');
    });

    test('10 feminine', () => {
      expect(toWords.convert(10, { gender: 'feminine' })).toBe('عشر');
    });

    test('composite: 1001 feminine', () => {
      expect(toWords.convert(1001, { gender: 'feminine' })).toBe('ألف و واحدة');
    });
  });

  describe('Hebrew (he-IL) — feminine default, masculineValue', () => {
    const toWords = new ToWords({ localeCode: 'he-IL' });

    test('1 default is feminine', () => {
      expect(toWords.convert(1)).toBe('אחת');
    });

    test('1 masculine', () => {
      expect(toWords.convert(1, { gender: 'masculine' })).toBe('אחד');
    });

    test('2 feminine (default)', () => {
      expect(toWords.convert(2)).toBe('שתיים');
    });

    test('2 masculine', () => {
      expect(toWords.convert(2, { gender: 'masculine' })).toBe('שניים');
    });

    test('3 masculine', () => {
      expect(toWords.convert(3, { gender: 'masculine' })).toBe('שלושה');
    });

    test('10 masculine', () => {
      expect(toWords.convert(10, { gender: 'masculine' })).toBe('עשרה');
    });

    test('11 masculine', () => {
      expect(toWords.convert(11, { gender: 'masculine' })).toBe('אחד עשר');
    });

    test('19 masculine', () => {
      expect(toWords.convert(19, { gender: 'masculine' })).toBe('תשעה עשר');
    });

    test('composite: 21 masculine', () => {
      expect(toWords.convert(21, { gender: 'masculine' })).toBe('עשרים ו אחד');
    });

    test('100 is ungendered', () => {
      expect(toWords.convert(100, { gender: 'masculine' })).toBe('מאה');
    });

    test('composite: 101 masculine', () => {
      expect(toWords.convert(101, { gender: 'masculine' })).toBe('אחת מאה ו אחד');
    });
  });

  describe('Hebrew Biblical (hbo-IL) — feminine default, masculineValue', () => {
    const toWords = new ToWords({ localeCode: 'hbo-IL' });

    test('1 masculine', () => {
      expect(toWords.convert(1, { gender: 'masculine' })).toBe('אחד');
    });

    test('2 masculine', () => {
      expect(toWords.convert(2, { gender: 'masculine' })).toBe('שנים');
    });

    test('3 masculine', () => {
      expect(toWords.convert(3, { gender: 'masculine' })).toBe('שלשה');
    });

    test('11 masculine', () => {
      expect(toWords.convert(11, { gender: 'masculine' })).toBe('אחד עשר');
    });

    test('composite: 21 masculine', () => {
      expect(toWords.convert(21, { gender: 'masculine' })).toBe('עשרים אחד');
    });
  });

  describe('Slovenian (sl-SI) — feminineValue and masculineValue', () => {
    const toWords = new ToWords({ localeCode: 'sl-SI' });

    test('1 default is feminine', () => {
      expect(toWords.convert(1)).toBe('Ena');
    });

    test('1 masculine', () => {
      expect(toWords.convert(1, { gender: 'masculine' })).toBe('Eden');
    });

    test('1 feminine (explicit)', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('Ena');
    });

    test('2 feminine', () => {
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Dve');
    });

    test('2 masculine (default)', () => {
      expect(toWords.convert(2)).toBe('Dva');
    });

    test('composite: 21 masculine', () => {
      expect(toWords.convert(21, { gender: 'masculine' })).toBe('Dvajset Eden');
    });

    test('composite: 101 masculine', () => {
      expect(toWords.convert(101, { gender: 'masculine' })).toBe('Sto Eden');
    });
  });

  describe('Gender does not affect non-gendered locales', () => {
    const toWords = new ToWords({ localeCode: 'en-US' });

    test('English is unaffected by gender option', () => {
      expect(toWords.convert(1, { gender: 'feminine' })).toBe('One');
      expect(toWords.convert(2, { gender: 'feminine' })).toBe('Two');
      expect(toWords.convert(100, { gender: 'feminine' })).toBe('One Hundred');
    });
  });

  describe('Gender with currency', () => {
    const toWords = new ToWords({ localeCode: 'es-ES' });

    test('currency with feminine gender', () => {
      const result = toWords.convert(1, { currency: true, gender: 'feminine' });
      expect(result).toContain('Euro');
    });
  });

  describe('Gender via constructor options', () => {
    test('gender can be set in constructor converterOptions', () => {
      const toWords = new ToWords({
        localeCode: 'es-ES',
        converterOptions: { gender: 'feminine' },
      });
      expect(toWords.convert(1)).toBe('Una');
      expect(toWords.convert(200)).toBe('Doscientas');
    });

    test('per-call gender overrides constructor gender', () => {
      const toWords = new ToWords({
        localeCode: 'es-ES',
        converterOptions: { gender: 'feminine' },
      });
      expect(toWords.convert(1, { gender: 'masculine' })).toBe('Uno');
    });
  });
});
