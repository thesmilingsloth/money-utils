import { describe, expect, it } from 'vitest';
import { SYMBOL_POSITION } from '../../constants/symbols';
import { Money } from '../../core/Money';
import { CurrencyConfig } from '../../types/currency';
import {
  isCurrencyConfig,
  isMoney,
  isValidCurrencyCode,
} from '../../types/guards';

describe('Type Guards', () => {
  describe('isMoney', () => {
    it('identifies Money instances', () => {
      const money = new Money('100', 'USD');

      expect(isMoney(money)).toBe(true);
    });

    it('rejects non-Money values', () => {
      const values = [
        null,
        undefined,
        100,
        '100',
        {},
        { amount: 100, currency: 'USD' },
      ];

      values.forEach((value) => {
        expect(isMoney(value)).toBe(false);
      });
    });
  });

  describe('isCurrencyConfig', () => {
    const validConfig: CurrencyConfig = {
      name: 'Custom Token',
      code: 'CTK',
      symbol: '⚡',
      symbolPosition: SYMBOL_POSITION.PREFIX,
      decimalSeparator: '.',
      decimals: 6,
      minorUnits: '1000000',
      thousandsSeparator: ',',
      isCrypto: true,
    };

    it('identifies valid CurrencyConfig objects', () => {
      expect(isCurrencyConfig(validConfig)).toBe(true);
    });

    it('rejects objects missing required properties', () => {
      const invalid = [
        { symbol: '$', name: 'US Dollar' }, // missing code
        { code: 'USD', name: 'US Dollar' }, // missing symbol
        { code: 'USD', symbol: '$' }, // missing name
      ];

      invalid.forEach((config) => {
        expect(isCurrencyConfig(config)).toBe(false);
      });
    });

    it('accepts objects with required properties regardless of their values', () => {
      const configs = [
        { code: '', symbol: '', name: '' }, // empty strings
        { code: null, symbol: null, name: null }, // null values
        { code: undefined, symbol: undefined, name: undefined }, // undefined values
        { code: 123, symbol: true, name: {} }, // wrong types
      ];

      configs.forEach((config) => {
        expect(isCurrencyConfig(config)).toBe(true);
      });
    });

    it('rejects non-object values', () => {
      const values = [null, undefined, 'USD', 100, [], true];

      values.forEach((value) => {
        expect(isCurrencyConfig(value)).toBe(false);
      });
    });
  });

  describe('isValidCurrencyCode', () => {
    it('accepts valid currency codes', () => {
      const validCodes = ['USD', 'EUR', 'GBP', 'JPY', 'BTC', 'ETH'];

      validCodes.forEach((code) => {
        expect(isValidCurrencyCode(code)).toBe(true);
      });
    });

    it('rejects invalid currency codes', () => {
      const invalidCodes = [
        '',
        'US',
        'USDD',
        'usd',
        '123',
        'US1',
        'USD ',
        ' USD',
        'U$D',
      ];

      invalidCodes.forEach((code) => {
        expect(isValidCurrencyCode(code)).toBe(false);
      });
    });
  });
});
