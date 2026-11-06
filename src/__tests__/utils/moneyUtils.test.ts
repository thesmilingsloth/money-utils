import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES } from '../../errors/MoneyErrors';
import { validateMoneyInput } from '../../utils/moneyUtils';

describe('Money Utilities', () => {
  describe('validateMoneyInput', () => {
    it('validates valid string inputs', () => {
      const validStrings = [
        '0',
        '100',
        '-100',
        '100.00',
        '-100.00',
        '0.123456789',
        '999999999999.99',
      ];

      validStrings.forEach((value) => {
        const result = validateMoneyInput(value);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('validates valid number inputs', () => {
      const validNumbers = [
        0, 100, -100, 100.0, -100.0, 0.123456789, 999999999999.99,
      ];

      validNumbers.forEach((value) => {
        const result = validateMoneyInput(value);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('rejects invalid string inputs', () => {
      const invalidStrings = [
        '',
        'abc',
        '123abc',
        'abc123',
        '100,00',
        '100.00.00',
        '.',
        '-',
        '+',
      ];

      invalidStrings.forEach((value) => {
        const result = validateMoneyInput(value);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
      });
    });

    it('rejects invalid number inputs', () => {
      const invalidNumbers = [NaN, Infinity, -Infinity];

      invalidNumbers.forEach((value) => {
        const result = validateMoneyInput(value);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
      });
    });

    it('handles edge cases', () => {
      // Very large numbers
      expect(validateMoneyInput('1e+20').isValid).toBe(true);
      expect(validateMoneyInput(1e20).isValid).toBe(true);

      // Very small numbers
      expect(validateMoneyInput('1e-20').isValid).toBe(true);
      expect(validateMoneyInput(1e-20).isValid).toBe(true);

      // Scientific notation
      expect(validateMoneyInput('1.23e+5').isValid).toBe(true);
      expect(validateMoneyInput(1.23e5).isValid).toBe(true);
    });

    it('handles precision edge cases', () => {
      // Numbers with many decimal places
      expect(validateMoneyInput('0.1234567890123456789').isValid).toBe(true);
      expect(validateMoneyInput(Number('0.1234567890123456789')).isValid).toBe(
        true,
      );

      // Very precise calculations
      expect(validateMoneyInput('0.1234567890123456789').isValid).toBe(true);
      expect(validateMoneyInput(Number('0.1234567890123456789')).isValid).toBe(
        true,
      );
    });
  });
});
