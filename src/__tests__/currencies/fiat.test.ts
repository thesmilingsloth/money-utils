import { describe, expect, it } from 'vitest';
import { SYMBOL_POSITION } from '../../constants/symbols';
import {
  EUR_CONFIG,
  GBP_CONFIG,
  JPY_CONFIG,
  USD_CONFIG,
} from '../../currencies/fiat';

describe('Fiat Currency Configurations', () => {
  describe('USD Configuration', () => {
    it('has correct properties', () => {
      expect(USD_CONFIG).toEqual({
        name: 'United States Dollar',
        code: 'USD',
        symbol: '$',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
        isCrypto: false,
      });
    });
  });

  describe('EUR Configuration', () => {
    it('has correct properties', () => {
      expect(EUR_CONFIG).toEqual({
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
        isCrypto: false,
      });
    });
  });

  describe('GBP Configuration', () => {
    it('has correct properties', () => {
      expect(GBP_CONFIG).toEqual({
        name: 'British Pound',
        code: 'GBP',
        symbol: '£',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
        isCrypto: false,
      });
    });
  });

  describe('JPY Configuration', () => {
    it('has correct properties', () => {
      expect(JPY_CONFIG).toEqual({
        name: 'Japanese Yen',
        code: 'JPY',
        symbol: '¥',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
        isCrypto: false,
      });
    });
  });
});
