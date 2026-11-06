import { beforeEach, describe, expect, it } from 'vitest';
import { SYMBOL_POSITION } from '../../constants/symbols';
import { Currency, CurrencyError } from '../../core/Currency';
import type { CurrencyConfig } from '../../types/currency';

describe('Currency', () => {
  const customCurrency: CurrencyConfig = {
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

  beforeEach(() => {
    // Reset currency registry before each test
    Currency.initialize();
  });

  describe('singleton instance', () => {
    it('maintains a single instance', () => {
      const instance1 = Currency.getInstance();
      const instance2 = Currency.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('built-in currencies', () => {
    it('provides access to USD configuration', () => {
      expect(Currency.USD).toBeDefined();
      expect(Currency.USD?.code).toBe('USD');
      expect(Currency.USD?.symbol).toBe('$');
    });

    it('provides access to EUR configuration', () => {
      expect(Currency.EUR).toBeDefined();
      expect(Currency.EUR?.code).toBe('EUR');
      expect(Currency.EUR?.symbol).toBe('€');
    });

    it('provides access to GBP configuration', () => {
      expect(Currency.GBP).toBeDefined();
      expect(Currency.GBP?.code).toBe('GBP');
      expect(Currency.GBP?.symbol).toBe('£');
    });

    it('provides access to JPY configuration', () => {
      expect(Currency.JPY).toBeDefined();
      expect(Currency.JPY?.code).toBe('JPY');
      expect(Currency.JPY?.symbol).toBe('¥');
    });

    it('provides access to BTC configuration', () => {
      expect(Currency.BTC).toBeDefined();
      expect(Currency.BTC?.code).toBe('BTC');
      expect(Currency.BTC?.symbol).toBe('₿');
      expect(Currency.BTC?.isCrypto).toBe(true);
    });

    it('provides access to ETH configuration', () => {
      expect(Currency.ETH).toBeDefined();
      expect(Currency.ETH?.code).toBe('ETH');
      expect(Currency.ETH?.symbol).toBe('Ξ');
      expect(Currency.ETH?.isCrypto).toBe(true);
    });
  });

  describe('currency registration', () => {
    it('registers a single currency', () => {
      Currency.register(customCurrency);
      const registered = Currency.getCurrency('CTK');
      expect(registered).toEqual(customCurrency);
    });

    it('registers multiple currencies', () => {
      const currencies = [
        customCurrency,
        {
          ...customCurrency,
          code: 'CTK2',
          symbol: '✨',
        },
      ];
      Currency.register(currencies);
      expect(Currency.getCurrency('CTK')).toEqual(currencies[0]);
      expect(Currency.getCurrency('CTK2')).toEqual(currencies[1]);
    });

    it('throws error for invalid currency config', () => {
      const invalid = { ...customCurrency, code: '' };
      expect(() => Currency.register(invalid)).toThrow(CurrencyError);
    });

    it('overwrites existing currency', () => {
      Currency.register(customCurrency);
      const modified = { ...customCurrency, symbol: '✨' };
      Currency.register(modified);
      expect(Currency.getCurrency('CTK')).toEqual(modified);
    });
  });

  describe('currency unregistration', () => {
    it('unregisters a single currency', () => {
      Currency.register(customCurrency);
      Currency.unregister(customCurrency);
      expect(Currency.getCurrency('CTK')).toBeUndefined();
    });

    it('unregisters multiple currencies', () => {
      const currencies = [
        customCurrency,
        {
          ...customCurrency,
          code: 'CTK2',
          symbol: '✨',
        },
      ];
      Currency.register(currencies);
      Currency.unregister(currencies);
      expect(Currency.getCurrency('CTK')).toBeUndefined();
      expect(Currency.getCurrency('CTK2')).toBeUndefined();
    });
  });

  describe('currency retrieval', () => {
    it('gets all registered currencies', () => {
      const initialCount = Currency.currencies.length;
      Currency.register(customCurrency);
      expect(Currency.currencies).toHaveLength(initialCount + 1);
      expect(Currency.currencies).toContainEqual(customCurrency);
    });

    it('gets currency by code', () => {
      Currency.register(customCurrency);
      const currency = Currency.getCurrency('CTK');
      expect(currency).toEqual(customCurrency);
    });

    it('returns undefined for unknown currency', () => {
      expect(Currency.getCurrency('UNKNOWN')).toBeUndefined();
    });
  });

  describe('currency initialization', () => {
    it('initializes with default currencies', () => {
      Currency.initialize();
      expect(Currency.USD).toBeDefined();
      expect(Currency.EUR).toBeDefined();
      expect(Currency.currencies.length).toBeGreaterThan(0);
    });

    it('initializes with specific currencies', () => {
      Currency.initialize([customCurrency]);
      expect(Currency.currencies).toHaveLength(1);
      expect(Currency.getCurrency('CTK')).toEqual(customCurrency);
      expect(Currency.getCurrency('USD')).toBeUndefined();
    });

    it('clears existing currencies on initialization', () => {
      Currency.register(customCurrency);
      Currency.initialize();
      expect(Currency.getCurrency('CTK')).toBeUndefined();
    });
  });

  describe('currency validation', () => {
    it('validates required properties', () => {
      const invalid = [
        { ...customCurrency, code: '' },
        { ...customCurrency, symbol: '' },
        { ...customCurrency, name: '' },
      ];

      invalid.forEach((config) => {
        expect(() => Currency.register(config)).toThrow(CurrencyError);
      });
    });

    it('accepts valid configurations', () => {
      expect(() => Currency.register(customCurrency)).not.toThrow();
    });
  });
});
