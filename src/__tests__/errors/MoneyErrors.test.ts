import { describe, expect, it } from 'vitest';
import {
  CurrencyError,
  ERROR_MESSAGES,
  MoneyError,
} from '../../errors/MoneyErrors';

describe('Money Errors', () => {
  describe('MoneyError', () => {
    it('creates error with correct name and message', () => {
      const error = new MoneyError('test error');

      expect(error.name).toBe('MoneyError');
      expect(error.message).toBe('test error');
    });
  });

  describe('CurrencyError', () => {
    it('creates error with correct name and message', () => {
      const error = new CurrencyError('test error');

      expect(error.name).toBe('CurrencyError');
      expect(error.message).toBe('test error');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('generates correct currency mismatch message', () => {
      const message = ERROR_MESSAGES.CURRENCY_MISMATCH('USD', 'EUR');

      expect(message).toBe(
        'Cannot operate on different currencies (current: "USD", other: "EUR")',
      );
    });

    it('generates correct currency not found message', () => {
      const message = ERROR_MESSAGES.CURRENCY_NOT_FOUND('XYZ');

      expect(message).toBe(
        'Currency config for XYZ not found. Config can be registered with "Currency.register(<CurrencyConfig>)"',
      );
    });
  });
});
