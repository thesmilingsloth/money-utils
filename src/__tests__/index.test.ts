import { describe, expect, it } from 'vitest';
import {
  // Crypto currencies
  CRYPTO_CURRENCY_CONFIGS,
  Currency,
  CurrencyError,
  ERROR_MESSAGES,
  // Fiat currencies
  FIAT_CURRENCY_CONFIGS,
  isCurrencyConfig,
  isMoney,
  isValidCurrencyCode,
  // Core exports
  Money,
  // Error exports
  MoneyError,
  // Type exports (we can't test these directly as they're types)
  // MoneyOptions,
  // MoneyComparisonResult,
  // ValidMoneyInput,
  // CurrencyConfig,
  // SymbolPosition,

  // Constants
  ROUNDING_MODE,
  SYMBOL_POSITION,
  // Utility exports
  validateMoneyInput,
} from '../index';

describe('Index exports', () => {
  it('exports core functionality', () => {
    expect(Money).toBeDefined();
    expect(Currency).toBeDefined();
  });

  it('exports constants', () => {
    expect(ROUNDING_MODE).toBeDefined();
    expect(SYMBOL_POSITION).toBeDefined();
  });

  it('exports currency configurations', () => {
    expect(FIAT_CURRENCY_CONFIGS).toBeDefined();
    expect(FIAT_CURRENCY_CONFIGS.USD_CONFIG).toBeDefined();
    expect(CRYPTO_CURRENCY_CONFIGS).toBeDefined();
    expect(CRYPTO_CURRENCY_CONFIGS.BTC_CONFIG).toBeDefined();
  });

  it('exports error types and messages', () => {
    expect(MoneyError).toBeDefined();
    expect(CurrencyError).toBeDefined();
    expect(ERROR_MESSAGES).toBeDefined();
  });

  it('exports utility functions', () => {
    expect(validateMoneyInput).toBeDefined();
    expect(isMoney).toBeDefined();
    expect(isCurrencyConfig).toBeDefined();
    expect(isValidCurrencyCode).toBeDefined();
  });

  // Test actual usage of exports
  it('can create Money instance using exports', () => {
    const money = new Money('100', 'USD');
    expect(money).toBeInstanceOf(Money);
    expect(money.toString()).toBe('$100.00');
  });

  it('can validate currency code using exports', () => {
    expect(isValidCurrencyCode('USD')).toBe(true);
    expect(isValidCurrencyCode('invalid')).toBe(false);
  });

  it('can use rounding modes from exports', () => {
    const money = new Money('100.555', 'USD', {
      roundingMode: ROUNDING_MODE.ROUND_UP,
    });
    expect(money.toString()).toBe('$100.56');
  });
});
