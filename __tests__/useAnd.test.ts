import { describe, expect, test } from 'vitest';
import { ToWords } from '../src/ToWords.js';

describe('useAnd option', () => {
  describe('English (en-US) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'en-US' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('One Hundred And One');
    });

    test('101 without useAnd (default)', () => {
      expect(toWords.convert(101)).toBe('One Hundred One');
    });

    test('150 with useAnd', () => {
      expect(toWords.convert(150, { useAnd: true })).toBe('One Hundred And Fifty');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('One Thousand And One');
    });

    test('1050 with useAnd', () => {
      expect(toWords.convert(1050, { useAnd: true })).toBe('One Thousand And Fifty');
    });

    test('1099 with useAnd', () => {
      expect(toWords.convert(1099, { useAnd: true })).toBe('One Thousand And Ninety Nine');
    });

    test('1100 with useAnd — remainder >= 100, no "and"', () => {
      expect(toWords.convert(1100, { useAnd: true })).toBe('One Thousand One Hundred');
    });

    test('1101 with useAnd — "and" before final sub-100', () => {
      expect(toWords.convert(1101, { useAnd: true })).toBe('One Thousand One Hundred And One');
    });

    test('round numbers unaffected', () => {
      expect(toWords.convert(100, { useAnd: true })).toBe('One Hundred');
      expect(toWords.convert(1000, { useAnd: true })).toBe('One Thousand');
      expect(toWords.convert(1000000, { useAnd: true })).toBe('One Million');
    });

    test('small numbers unaffected', () => {
      expect(toWords.convert(1, { useAnd: true })).toBe('One');
      expect(toWords.convert(99, { useAnd: true })).toBe('Ninety Nine');
    });

    test('zero unaffected', () => {
      expect(toWords.convert(0, { useAnd: true })).toBe('Zero');
    });
  });

  describe('English (en-IN) — no splitWord, Indian numbering', () => {
    const toWords = new ToWords({ localeCode: 'en-IN' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('One Hundred And One');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('One Thousand And One');
    });
  });

  describe('German (de-DE) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'de-DE' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Hundert Und Eins');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('Tausend Und Eins');
    });
  });

  describe('French (fr-FR) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'fr-FR' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Cent Et Un');
    });
  });

  describe('Russian (ru-RU) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'ru-RU' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toContain('И');
    });
  });

  describe('Portuguese (pt-BR) — has splitWord "E"', () => {
    const toWords = new ToWords({ localeCode: 'pt-BR' });

    test('useAnd does not double-insert when splitWord exists', () => {
      const withAnd = toWords.convert(101, { useAnd: true });
      const without = toWords.convert(101);
      // Portuguese already uses "E" as splitWord, so useAnd should not change output
      expect(withAnd).toBe(without);
    });
  });

  describe('Locales with empty connector token', () => {
    const locales = ['ja-JP', 'zh-CN', 'zh-TW', 'yue-HK'] as const;

    test.each(locales)('useAnd is a no-op for %s', (localeCode) => {
      const toWords = new ToWords({ localeCode });
      expect(toWords.convert(101, { useAnd: true })).toBe(toWords.convert(101));
      expect(toWords.convert(1001, { useAnd: true })).toBe(toWords.convert(1001));
    });
  });

  describe('Dutch (nl-NL) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'nl-NL' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Een Honderd En Een');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('Een Duizend En Een');
    });
  });

  describe('Swedish (sv-SE) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'sv-SE' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Hundra Och Ett');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('Tusen Och Ett');
    });
  });

  describe('Hindi (hi-IN) — no splitWord', () => {
    const toWords = new ToWords({ localeCode: 'hi-IN' });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('एक सौ और एक');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('एक हज़ार और एक');
    });
  });

  describe('Italian (it-IT) — useAnd inserts texts.and', () => {
    const toWords = new ToWords({ localeCode: 'it-IT' });

    test('101 default (no and)', () => {
      expect(toWords.convert(101)).toBe('Cento Uno');
    });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Cento E Uno');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('Mila E Uno');
    });
  });

  describe('Spanish (es-ES) — useAnd inserts texts.and', () => {
    const toWords = new ToWords({ localeCode: 'es-ES' });

    test('101 default (no and)', () => {
      expect(toWords.convert(101)).toBe('Ciento Uno');
    });

    test('101 with useAnd', () => {
      expect(toWords.convert(101, { useAnd: true })).toBe('Ciento Y Uno');
    });

    test('1001 with useAnd', () => {
      expect(toWords.convert(1001, { useAnd: true })).toBe('Mil Y Uno');
    });
  });

  describe('useAnd with currency (en-US)', () => {
    const toWords = new ToWords({ localeCode: 'en-US' });

    test('101 currency', () => {
      expect(toWords.convert(101, { useAnd: true, currency: true })).toBe('One Hundred And One Dollars Only');
    });

    test('1001 currency', () => {
      expect(toWords.convert(1001, { useAnd: true, currency: true })).toBe('One Thousand And One Dollars Only');
    });

    test('1101 currency', () => {
      expect(toWords.convert(1101, { useAnd: true, currency: true })).toBe(
        'One Thousand One Hundred And One Dollars Only',
      );
    });
  });

  describe('useAnd with large numbers (en-US)', () => {
    const toWords = new ToWords({ localeCode: 'en-US' });

    test('1000001', () => {
      expect(toWords.convert(1000001, { useAnd: true })).toBe('One Million And One');
    });

    test('1000101', () => {
      expect(toWords.convert(1000101, { useAnd: true })).toBe('One Million One Hundred And One');
    });

    test('1001001', () => {
      expect(toWords.convert(1001001, { useAnd: true })).toBe('One Million One Thousand And One');
    });

    test('10000001', () => {
      expect(toWords.convert(10000001, { useAnd: true })).toBe('Ten Million And One');
    });

    test('100000001', () => {
      expect(toWords.convert(100000001, { useAnd: true })).toBe('One Hundred Million And One');
    });
  });

  describe('useAnd with negative and float (en-US)', () => {
    const toWords = new ToWords({ localeCode: 'en-US' });

    test('negative: -101', () => {
      expect(toWords.convert(-101, { useAnd: true })).toBe('Minus One Hundred And One');
    });

    test('negative: -1001', () => {
      expect(toWords.convert(-1001, { useAnd: true })).toBe('Minus One Thousand And One');
    });

    test('float: 101.5', () => {
      expect(toWords.convert(101.5, { useAnd: true })).toBe('One Hundred And One Point Five');
    });
  });

  describe('useAnd via constructor options', () => {
    test('useAnd can be set in constructor converterOptions', () => {
      const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: { useAnd: true },
      });
      expect(toWords.convert(101)).toBe('One Hundred And One');
    });

    test('per-call useAnd overrides constructor', () => {
      const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: { useAnd: true },
      });
      expect(toWords.convert(101, { useAnd: false })).toBe('One Hundred One');
    });
  });

  describe('useAnd combined with gender', () => {
    test('Spanish 201 with useAnd and feminine', () => {
      const toWords = new ToWords({ localeCode: 'es-ES' });
      const result = toWords.convert(201, { useAnd: true, gender: 'feminine' });
      expect(result).toBe('Doscientas Y Una');
    });
  });
});
