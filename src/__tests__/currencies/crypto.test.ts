import { describe, expect, it } from 'vitest';
import { SYMBOL_POSITION } from '../../constants/symbols';
import { BTC_CONFIG, ETH_CONFIG } from '../../currencies/crypto';

describe('Crypto Currency Configurations', () => {
  describe('BTC Configuration', () => {
    it('has correct properties', () => {
      expect(BTC_CONFIG).toEqual({
        name: 'Bitcoin',
        code: 'BTC',
        symbol: '₿',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 8,
        minorUnits: '100000000',
        thousandsSeparator: ',',
        isCrypto: true,
      });
    });
  });

  describe('ETH Configuration', () => {
    it('has correct properties', () => {
      expect(ETH_CONFIG).toEqual({
        name: 'Ethereum',
        code: 'ETH',
        symbol: 'Ξ',
        symbolPosition: SYMBOL_POSITION.PREFIX,
        decimalSeparator: '.',
        decimals: 18,
        minorUnits: '1000000000000000000',
        thousandsSeparator: ',',
        isCrypto: true,
      });
    });
  });
});
