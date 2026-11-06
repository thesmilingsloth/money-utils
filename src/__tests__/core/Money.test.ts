import { describe, expect, it } from 'vitest';
import { ROUNDING_MODE } from '../../constants/money';
import { Currency } from '../../core/Currency';
import { Money } from '../../core/Money';
import { MoneyError } from '../../errors/MoneyErrors';

describe('Money', () => {
  describe('constructor', () => {
    it('creates a valid Money instance with string value', () => {
      const money = new Money('100.50', 'USD');

      expect(money.value()).toBe('100.5');
      expect(money.toString()).toBe('$100.50');
    });

    it('creates a valid Money instance with number value', () => {
      const money = new Money(100.5, 'USD');

      expect(money.value()).toBe('100.5');
      expect(money.toString()).toBe('$100.50');
    });

    it('throws error for invalid amount', () => {
      expect(() => new Money('invalid', 'USD')).toThrow(MoneyError);
      expect(() => new Money(NaN, 'USD')).toThrow(MoneyError);
      expect(() => new Money(Infinity, 'USD')).toThrow(MoneyError);
    });

    it('throws error for invalid currency', () => {
      expect(() => new Money('100.50', 'INVALID')).toThrow();
    });

    it('respects custom options', () => {
      const money = new Money('100.50', 'USD', {
        symbol: 'USD',
        decimals: 3,
        displayDecimals: 1,
        roundingMode: ROUNDING_MODE.ROUND_UP,
      });

      expect(money.toString()).toBe('USD100.5');
    });
  });

  describe('static methods with options', () => {
    it('creates zero value instance', () => {
      const zero = Money.zero('USD');

      expect(zero.isZero()).toBe(true);
      expect(zero.toString()).toBe('$0.00');
    });

    it('creates instance from value', () => {
      const money = Money.from('100.50', 'USD');

      expect(money.value()).toBe('100.5');
      expect(money.toString()).toBe('$100.50');
    });
  });

  describe('arithmetic operations', () => {
    const money1 = new Money('100.50', 'USD');
    const money2 = new Money('50.25', 'USD');
    const diffCurrency = new Money('50.25', 'EUR');

    it('adds two Money instances', () => {
      const sum = money1.add(money2);

      expect(sum.value()).toBe('150.75');
    });

    it('subtracts two Money instances', () => {
      const difference = money1.subtract(money2);

      expect(difference.value()).toBe('50.25');
    });

    it('multiplies by a factor', () => {
      const product = money1.multiply(2);

      expect(product.value()).toBe('201');
    });

    it('divides by a divisor', () => {
      const quotient = money1.divide(2);

      expect(quotient.value()).toBe('50.25');
    });

    it('throws error when dividing by zero', () => {
      expect(() => money1.divide(0)).toThrow(MoneyError);
    });

    it('throws error when operating with different currencies', () => {
      expect(() => money1.add(diffCurrency)).toThrow();
      expect(() => money1.subtract(diffCurrency)).toThrow();
    });
  });

  describe('allocation', () => {
    it('allocates money equally', () => {
      const money = new Money('100', 'USD');
      const shares = money.allocate([1, 1, 1]);

      expect(shares).toHaveLength(3);
      expect(shares[0].toString()).toBe('$33.34');
      expect(shares[1].toString()).toBe('$33.33');
      expect(shares[2].toString()).toBe('$33.33');

      const total = shares.reduce(
        (sum, share) => sum.add(share),
        Money.zero('USD'),
      );
      expect(total.equals(money)).toBe(true);
    });

    it('allocates money by ratio', () => {
      const money = new Money('100', 'USD');
      const shares = money.allocate([2, 3, 5]);

      expect(shares[0].toString()).toBe('$20.00');
      expect(shares[1].toString()).toBe('$30.00');
      expect(shares[2].toString()).toBe('$50.00');

      const total = shares.reduce(
        (sum, share) => sum.add(share),
        Money.zero('USD'),
      );
      expect(total.equals(money)).toBe(true);
    });

    it('handles remainders correctly', () => {
      const money = new Money('100.01', 'USD');
      const shares = money.allocate([1, 1, 1]);

      expect(shares[0].toString()).toBe('$33.34');
      expect(shares[1].toString()).toBe('$33.34');
      expect(shares[2].toString()).toBe('$33.33');

      const total = shares.reduce(
        (sum, share) => sum.add(share),
        Money.zero('USD'),
      );
      expect(total.equals(money)).toBe(true);
    });

    it('handles various remainder cases', () => {
      // Case 1: Amount that divides evenly
      const money1 = new Money('100.00', 'USD');
      const shares1 = money1.allocate([1, 1, 1]);
      expect(shares1.map((s) => s.toString())).toEqual([
        '$33.34',
        '$33.33',
        '$33.33',
      ]);

      // Case 2: One cent remainder
      const money2 = new Money('100.01', 'USD');
      const shares2 = money2.allocate([1, 1, 1]);
      expect(shares2.map((s) => s.toString())).toEqual([
        '$33.34',
        '$33.34',
        '$33.33',
      ]);

      // Case 3: Two cents remainder
      const money3 = new Money('100.02', 'USD');
      const shares3 = money3.allocate([1, 1, 1]);
      expect(shares3.map((s) => s.toString())).toEqual([
        '$33.34',
        '$33.34',
        '$33.34',
      ]);

      // Case 4: Uneven ratios with remainder
      const money4 = new Money('100.01', 'USD');
      const shares4 = money4.allocate([1, 2, 1]);
      expect(shares4.map((s) => s.toString())).toEqual([
        '$25.00',
        '$50.01',
        '$25.00',
      ]);

      // Verify all totals
      [
        { money: money1, shares: shares1 },
        { money: money2, shares: shares2 },
        { money: money3, shares: shares3 },
        { money: money4, shares: shares4 },
      ].forEach(({ money, shares }) => {
        const total = shares.reduce(
          (sum, share) => sum.add(share),
          Money.zero('USD'),
        );
        expect(total.equals(money)).toBe(true);
      });
    });

    it('throws error for empty ratios', () => {
      const money = new Money('100', 'USD');
      expect(() => money.allocate([])).toThrow();
    });
  });

  describe('comparison operations', () => {
    const money1 = new Money('100.50', 'USD');
    const money2 = new Money('50.25', 'USD');
    const equal = new Money('100.50', 'USD');

    it('compares equality', () => {
      expect(money1.equals(equal)).toBe(true);
      expect(money1.equals(money2)).toBe(false);
    });

    it('compares greater than', () => {
      expect(money1.greaterThan(money2)).toBe(true);
      expect(money2.greaterThan(money1)).toBe(false);
    });

    it('compares less than', () => {
      expect(money2.lessThan(money1)).toBe(true);
      expect(money1.lessThan(money2)).toBe(false);
    });

    it('compares greater than or equal', () => {
      expect(money1.greaterThanOrEqual(equal)).toBe(true);
      expect(money1.greaterThanOrEqual(money2)).toBe(true);
      expect(money2.greaterThanOrEqual(money1)).toBe(false);
    });

    it('compares less than or equal', () => {
      expect(money1.lessThanOrEqual(equal)).toBe(true);
      expect(money2.lessThanOrEqual(money1)).toBe(true);
      expect(money1.lessThanOrEqual(money2)).toBe(false);
    });

    it('provides comprehensive comparison', () => {
      const comparison = money1.compare(money2);

      expect(comparison).toEqual({
        equal: false,
        greaterThan: true,
        lessThan: false,
      });
    });
  });

  describe('value checks', () => {
    it('checks for zero value', () => {
      expect(Money.zero('USD').isZero()).toBe(true);
      expect(new Money('0.00', 'USD').isZero()).toBe(true);
      expect(new Money('1.00', 'USD').isZero()).toBe(false);
    });

    it('checks for positive value', () => {
      expect(new Money('100.50', 'USD').isPositive()).toBe(true);
      expect(new Money('-100.50', 'USD').isPositive()).toBe(false);
      expect(Money.zero('USD').isPositive()).toBe(true);
    });

    it('checks for negative value', () => {
      expect(new Money('-100.50', 'USD').isNegative()).toBe(true);
      expect(new Money('100.50', 'USD').isNegative()).toBe(false);
      expect(Money.zero('USD').isNegative()).toBe(false);
    });
  });

  describe('formatting', () => {
    const money = new Money('1234567.89', 'USD');

    it('formats value without symbol', () => {
      expect(money.formattedValue()).toBe('1,234,567.89');
    });

    it('formats value with symbol', () => {
      expect(money.formattedValueWithSymbol()).toBe('$1,234,567.89');
    });

    it('formats using toString', () => {
      expect(money.toString()).toBe('$1,234,567.89');
    });

    it('formats using locale string', () => {
      expect(money.toLocaleString('en-US')).toBe('$1,234,567.89');
      expect(money.toLocaleString('de-DE')).toBe('1.234.567,89\u00A0$');
    });

    it('handles custom format options', () => {
      expect(money.toLocaleString('en-US', { currencyDisplay: 'code' })).toBe(
        'USD\u00A01,234,567.89',
      );
    });
  });

  describe('serialization', () => {
    const money = new Money('1234.56', 'USD');

    it('converts to JSON', () => {
      const json = money.toJSON();

      expect(json).toEqual({
        currency: 'USD',
        symbol: '$',
        decimals: 2,
        displayDecimals: 2,
        value: '1234.56',
        prettyValue: '$1,234.56',
      });
    });

    it('works with JSON.stringify', () => {
      const obj = { price: money };
      const json = JSON.stringify(obj);

      expect(JSON.parse(json).price.value).toBe('1234.56');
    });
  });

  describe('edge cases', () => {
    it('handles very large numbers', () => {
      const large = new Money('999999999999.99', 'USD');

      expect(large.toString()).toBe('$999,999,999,999.99');
    });

    it('handles very small numbers', () => {
      const small = new Money('0.00000001', 'BTC');

      expect(small.toString()).toBe('₿0.00000001');
    });

    it('handles negative zero', () => {
      const negativeZero = new Money('-0.00', 'USD');

      expect(negativeZero.toString()).toBe('-$0.00');
      expect(negativeZero.isZero()).toBe(true);
    });
  });

  describe('formatting methods', () => {
    const money = new Money('1234567.89', 'USD');

    it('formats with different locales', () => {
      expect(money.toLocaleString('en-US')).toBe('$1,234,567.89');
      expect(money.toLocaleString('de-DE')).toBe('1.234.567,89\u00A0$');
      expect(money.toLocaleString('ja-JP')).toBe('$1,234,567.89');
    });

    it('formats crypto values', () => {
      const btc = new Money('1.23456789', 'BTC');

      expect(btc.toLocaleString()).toBe('₿1.23456789');
    });

    it('formats with custom options', () => {
      expect(money.toLocaleString('en-US', { currencyDisplay: 'code' })).toBe(
        'USD\u00A01,234,567.89',
      );
    });

    it('formats abbreviated values', () => {
      const amounts = [
        { value: '1234', expected: '$1.2K' },
        { value: '1234567', expected: '$1.2M' },
        { value: '1234567890', expected: '$1.2B' },
        { value: '1234567890123', expected: '$1.2T' },
      ];

      amounts.forEach(({ value, expected }) => {
        const money = new Money(value, 'USD');

        expect(money.abbreviatedValue(1, true)).toBe(expected);
      });
    });

    it('formats abbreviated values without symbols', () => {
      const money = new Money('1234567', 'USD');

      expect(money.abbreviatedValue(1, false)).toBe('1.2M');
    });

    it('formats negative abbreviated values', () => {
      const money = new Money('-1234567', 'USD');

      expect(money.abbreviatedValue(1, true)).toBe('-$1.2M');
    });

    it('formats with only integer part', () => {
      const money = new Money('1234', 'USD');

      expect(money.formattedValue()).toBe('1,234.00');
    });

    it('formats with different separators', () => {
      Currency.register({
        name: 'Custom Format',
        code: 'CFT',
        symbol: '¤',
        symbolPosition: 'prefix',
        decimalSeparator: ',',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: '.',
      });

      const money = new Money('1234567.89', 'CFT');
      expect(money.formattedValue()).toBe('1.234.567,89');
    });
  });

  describe('conversion operations', () => {
    it('converts between currencies', () => {
      const usd = new Money('100.00', 'USD');
      const rate = new Money('0.85', 'EUR'); // 1 USD = 0.85 EUR
      const eur = usd.convertTo(rate);

      expect(eur.toString()).toBe('€85.00');
    });

    it('throws error for invalid conversion rate', () => {
      const usd = new Money('100.00', 'USD');
      const zeroRate = new Money('0', 'EUR');
      const negativeRate = new Money('-1', 'EUR');

      expect(() => usd.convertTo(zeroRate)).toThrow(MoneyError);
      expect(() => usd.convertTo(negativeRate)).toThrow(MoneyError);
    });
  });

  describe('rounding operations', () => {
    it('rounds with different modes', () => {
      const roundingModes = [
        { mode: ROUNDING_MODE.ROUND_UP, expected: '100.56' },
        { mode: ROUNDING_MODE.ROUND_DOWN, expected: '100.55' },
        { mode: ROUNDING_MODE.ROUND_CEIL, expected: '100.56' },
        { mode: ROUNDING_MODE.ROUND_FLOOR, expected: '100.55' },
        { mode: ROUNDING_MODE.ROUND_HALF_UP, expected: '100.56' },
        { mode: ROUNDING_MODE.ROUND_HALF_DOWN, expected: '100.55' },
        { mode: ROUNDING_MODE.ROUND_HALF_EVEN, expected: '100.56' },
      ];

      roundingModes.forEach(({ mode, expected }) => {
        const rounded = new Money('100.555', 'USD', { roundingMode: mode });

        expect(rounded.toString()).toBe(`$${expected}`);
      });
    });

    it('rounds with specific decimals', () => {
      const money = new Money('100.555', 'USD');

      expect(money.round().value()).toBe('100.56');
      expect(money.round(3).value()).toBe('100.555');
      expect(money.round(1).value()).toBe('100.6');
      expect(money.round(0).value()).toBe('101');
    });
  });

  describe('allocation edge cases', () => {
    it('handles zero amount allocation', () => {
      const money = Money.zero('USD');
      const shares = money.allocate([1, 1, 1]);

      expect(shares.map((s) => s.toString())).toEqual([
        '$0.00',
        '$0.00',
        '$0.00',
      ]);
    });

    it('handles allocation with single ratio', () => {
      const money = new Money('100', 'USD');
      const shares = money.allocate([1]);

      expect(shares).toHaveLength(1);
      expect(shares[0].toString()).toBe('$100.00');
    });

    it('handles allocation with zero ratios', () => {
      const money = new Money('100', 'USD');
      const shares = money.allocate([0, 0, 1]);

      expect(shares.map((s) => s.toString())).toEqual([
        '$0.00',
        '$0.00',
        '$100.00',
      ]);
    });

    it('handles allocation with very small amounts', () => {
      const money = new Money('0.01', 'USD');
      const shares = money.allocate([1, 1, 1]);
      const total = shares.reduce(
        (sum, share) => sum.add(share),
        Money.zero('USD'),
      );

      expect(total.equals(new Money('0.01', 'USD'))).toBe(true);
    });
  });

  describe('JSON serialization', () => {
    it('serializes to JSON correctly', () => {
      const money = new Money('123.45', 'USD');
      const json = JSON.stringify({ price: money });
      const parsed = JSON.parse(json);

      expect(parsed.price).toEqual({
        currency: 'USD',
        symbol: '$',
        decimals: 2,
        displayDecimals: 2,
        value: '123.45',
        prettyValue: '$123.45',
      });
    });
  });

  describe('error cases', () => {
    it('throws error for invalid amount strings', () => {
      const invalidAmounts = ['abc', '12.34.56', '', '.', '-'];

      invalidAmounts.forEach((amount) => {
        expect(() => new Money(amount, 'USD')).toThrow(MoneyError);
      });
    });

    it('throws error for invalid number inputs', () => {
      const invalidAmounts = [NaN, Infinity, -Infinity];

      invalidAmounts.forEach((amount) => {
        expect(() => new Money(amount, 'USD')).toThrow(MoneyError);
      });
    });

    it('throws error for operations with different currencies', () => {
      const usd = new Money('100', 'USD');
      const eur = new Money('100', 'EUR');

      expect(() => usd.add(eur)).toThrow();
      expect(() => usd.subtract(eur)).toThrow();
      expect(() => usd.equals(eur)).toThrow();
      expect(() => usd.greaterThan(eur)).toThrow();
      expect(() => usd.lessThan(eur)).toThrow();
    });

    it('throws error for invalid currency', () => {
      expect(() => new Money('100', 'INVALID')).toThrow();
    });
  });

  describe('value extraction', () => {
    const money = new Money('123.45', 'USD');
    const negative = new Money('-123.45', 'USD');

    it('extracts raw value', () => {
      expect(money.value()).toBe('123.45');
      expect(negative.value()).toBe('-123.45');
    });

    it('extracts absolute value', () => {
      expect(money.absoluteValue()).toBe('123.45');
      expect(negative.absoluteValue()).toBe('123.45');
    });

    it('extracts negated value', () => {
      expect(money.negatedValue()).toBe('-123.45');
      expect(negative.negatedValue()).toBe('123.45');
    });

    it('checks value signs', () => {
      expect(money.isPositive()).toBe(true);
      expect(money.isNegative()).toBe(false);
      expect(negative.isPositive()).toBe(false);
      expect(negative.isNegative()).toBe(true);
    });

    it('handles zero values correctly', () => {
      const zero = Money.zero('USD');
      const negativeZero = new Money('-0', 'USD');

      expect(zero.isZero()).toBe(true);
      expect(negativeZero.isZero()).toBe(true);
      expect(zero.isPositive()).toBe(true);
      expect(negativeZero.isNegative()).toBe(true);
    });
  });

  describe('additional comparison methods', () => {
    const money = new Money('100.00', 'USD');
    const same = new Money('100.00', 'USD');
    const less = new Money('50.00', 'USD');
    const more = new Money('150.00', 'USD');

    it('compares greater than or equal', () => {
      expect(money.greaterThanOrEqual(less)).toBe(true);
      expect(money.greaterThanOrEqual(same)).toBe(true);
      expect(money.greaterThanOrEqual(more)).toBe(false);
    });

    it('compares less than or equal', () => {
      expect(money.lessThanOrEqual(more)).toBe(true);
      expect(money.lessThanOrEqual(same)).toBe(true);
      expect(money.lessThanOrEqual(less)).toBe(false);
    });

    it('provides comprehensive comparison result', () => {
      expect(money.compare(same)).toEqual({
        equal: true,
        greaterThan: false,
        lessThan: false,
      });
      expect(money.compare(less)).toEqual({
        equal: false,
        greaterThan: true,
        lessThan: false,
      });
      expect(money.compare(more)).toEqual({
        equal: false,
        greaterThan: false,
        lessThan: true,
      });
    });
  });

  describe('allocation errors', () => {
    it('throws error for empty ratios array', () => {
      const money = new Money('100', 'USD');

      expect(() => money.allocate([])).toThrow(
        'Money: Cannot allocate to empty ratios',
      );
    });
  });

  describe('symbol position handling', () => {
    it('handles prefix symbol position', () => {
      const money = new Money('100', 'USD');

      expect(money.toString()).toBe('$100.00');
      expect(money.formattedValueWithSymbol()).toBe('$100.00');
    });

    it('handles suffix symbol position', () => {
      // Create a custom currency with suffix symbol position
      Currency.register({
        name: 'Test Currency',
        code: 'TST',
        symbol: '¤',
        symbolPosition: 'suffix',
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
      });

      const money = new Money('100', 'TST');

      expect(money.toString()).toBe('100.00¤');
      expect(money.formattedValueWithSymbol()).toBe('100.00¤');
    });
  });

  describe('additional formatting cases', () => {
    it('formats zero values correctly', () => {
      const zero = Money.zero('USD');

      expect(zero.formattedValue()).toBe('0.00');
      expect(zero.formattedValueWithSymbol()).toBe('$0.00');
      expect(zero.toString()).toBe('$0.00');
    });

    it('formats negative values correctly', () => {
      const negative = new Money('-100', 'USD');

      expect(negative.formattedValue()).toBe('-100.00');
      expect(negative.formattedValueWithSymbol()).toBe('-$100.00');
      expect(negative.toString()).toBe('-$100.00');
    });

    it('handles custom decimal and thousand separators', () => {
      // Create a custom currency with different separators
      Currency.register({
        name: 'Custom Sep',
        code: 'CSP',
        symbol: '¤',
        symbolPosition: 'prefix',
        decimalSeparator: ',',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: '.',
      });

      const money = new Money('1234567.89', 'CSP');

      expect(money.formattedValue()).toBe('1.234.567,89');
      expect(money.formattedValueWithSymbol()).toBe('¤1.234.567,89');
    });

    it('handles different display decimals', () => {
      const money = new Money('100.555', 'USD', { displayDecimals: 3 });

      expect(money.toString()).toBe('$100.555');
      expect(money.formattedValue()).toBe('100.555');
    });
  });

  describe('static methods', () => {
    it('creates zero amount with options', () => {
      const zero = Money.zero('USD', {
        symbol: 'USD',
        decimals: 3,
        displayDecimals: 3,
      });

      expect(zero.toString()).toBe('USD0.000');
    });

    it('creates from static method with options', () => {
      const money = Money.from('100.555', 'USD', {
        symbol: 'USD',
        decimals: 3,
        displayDecimals: 3,
      });

      expect(money.toString()).toBe('USD100.555');
    });
  });

  describe('arithmetic operations edge cases', () => {
    it('handles addition with zero', () => {
      const money = new Money('100', 'USD');
      const zero = Money.zero('USD');

      expect(money.add(zero).toString()).toBe('$100.00');
      expect(zero.add(money).toString()).toBe('$100.00');
    });

    it('handles subtraction with zero', () => {
      const money = new Money('100', 'USD');
      const zero = Money.zero('USD');

      expect(money.subtract(zero).toString()).toBe('$100.00');
      expect(zero.subtract(money).toString()).toBe('-$100.00');
    });

    it('handles multiplication with zero', () => {
      const money = new Money('100', 'USD');

      expect(money.multiply(0).toString()).toBe('$0.00');
    });

    it('handles multiplication with one', () => {
      const money = new Money('100', 'USD');

      expect(money.multiply(1).toString()).toBe('$100.00');
    });

    it('handles division with one', () => {
      const money = new Money('100', 'USD');

      expect(money.divide(1).toString()).toBe('$100.00');
    });
  });

  describe('formatting with different options', () => {
    it('handles custom display decimals with rounding', () => {
      const money = new Money('100.555', 'USD', {
        displayDecimals: 2,
        roundingMode: ROUNDING_MODE.ROUND_HALF_UP,
      });

      expect(money.toString()).toBe('$100.56');
    });

    it('handles different decimals for calculations and display', () => {
      const money = new Money('100.555', 'USD', {
        decimals: 3,
        displayDecimals: 2,
      });

      expect(money.value()).toBe('100.555');
      expect(money.toString()).toBe('$100.56');
    });

    it('handles custom formatting options', () => {
      const money = new Money('1234.5', 'USD', {
        displayDecimals: 0,
        decimals: 1,
      });

      expect(money.toString()).toBe('$1,234'); // since default rounding mode is ROUND_HALF_EVEN
      expect(money.value()).toBe('1234.5');
      expect(money.formattedValue()).toBe('1,234'); // since default rounding mode is ROUND_HALF_EVEN
    });

    it('formats with different symbol positions', () => {
      Currency.register({
        name: 'Suffix Test',
        code: 'SFX',
        symbol: '§',
        symbolPosition: 'suffix',
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
      });

      const money = new Money('-1234.56', 'SFX');

      expect(money.toString()).toBe('-1,234.56§');
      expect(money.formattedValueWithSymbol()).toBe('-1,234.56§');
    });
  });

  describe('formatting edge cases', () => {
    it('handles empty decimal part', () => {
      const money = new Money('1234', 'USD');

      expect(money.formattedValue()).toBe('1,234.00');
    });

    it('handles zero value with different formats', () => {
      const zero = new Money('0', 'USD');
      const negZero = new Money('-0', 'USD');

      expect(zero.formattedValue()).toBe('0.00');
      expect(negZero.formattedValue()).toBe('-0.00');
      expect(zero.formattedValueWithSymbol()).toBe('$0.00');
      expect(negZero.formattedValueWithSymbol()).toBe('-$0.00');
    });

    it('handles negative values with different formats', () => {
      const negative = new Money('-1234.56', 'USD');

      expect(negative.formattedValue()).toBe('-1,234.56');
      expect(negative.formattedValueWithSymbol()).toBe('-$1,234.56');
    });

    it('handles custom separators with empty decimal part', () => {
      Currency.register({
        name: 'Custom Sep Empty',
        code: 'CSE',
        symbol: '¤',
        symbolPosition: 'prefix',
        decimalSeparator: ',',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: '.',
      });

      const money = new Money('1234', 'CSE');

      expect(money.formattedValue()).toBe('1.234,00');
    });
  });

  describe('value handling edge cases', () => {
    it('handles negative zero in various formats', () => {
      const negativeZero = new Money('-0', 'USD');

      expect(negativeZero.value()).toBe('0');
      expect(negativeZero.absoluteValue()).toBe('0');
      expect(negativeZero.negatedValue()).toBe('0');
    });

    it('handles zero comparison edge cases', () => {
      const zero = Money.zero('USD');
      const negativeZero = new Money('-0', 'USD');
      const smallNegative = new Money('-0.00000001', 'USD');
      const smallPositive = new Money('0.00000001', 'USD');

      expect(zero.equals(negativeZero)).toBe(true);
      expect(zero.greaterThan(smallNegative)).toBe(true);
      expect(zero.lessThan(smallPositive)).toBe(true);
    });
  });

  describe('formatting internals', () => {
    it('handles integer-only values with custom separators', () => {
      Currency.register({
        name: 'Test Format',
        code: 'TFT',
        symbol: '†',
        symbolPosition: 'prefix',
        decimalSeparator: ';', // unusual separator to test edge case
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: '~', // unusual separator to test edge case
      });

      const money = new Money('1234567', 'TFT');
      expect(money.formattedValue()).toBe('1~234~567;00');
    });

    it('formats values without symbols', () => {
      const positive = new Money('1234.56', 'USD');
      const negative = new Money('-1234.56', 'USD');

      expect(positive.abbreviatedValue(2, false)).toBe('1.23K');
      expect(negative.abbreviatedValue(2, false)).toBe('-1.23K');
    });

    it('handles zero values with and without symbols', () => {
      const zero = new Money('0', 'USD');
      const negZero = new Money('-0', 'USD');

      expect(zero.abbreviatedValue(2, false)).toBe('0');
      expect(negZero.abbreviatedValue(2, false)).toBe('-0');
      expect(zero.abbreviatedValue(2, true)).toBe('$0');
      expect(negZero.abbreviatedValue(2, true)).toBe('-$0');
    });

    it('formats abbreviated values with different symbol positions', () => {
      // Test prefix symbol
      const positivePrefix = new Money('1234', 'USD');
      const negativePrefix = new Money('-1234', 'USD');
      expect(positivePrefix.abbreviatedValue(1, true)).toBe('$1.2K'); // hits first branch of formatNumberWithSign
      expect(negativePrefix.abbreviatedValue(1, true)).toBe('-$1.2K'); // hits second branch of formatNumberWithSign

      // Test suffix symbol
      Currency.register({
        name: 'Test Format Suffix',
        code: 'TFS',
        symbol: '¤',
        symbolPosition: 'suffix',
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
      });

      const positiveSuffix = new Money('1234', 'TFS');
      const negativeSuffix = new Money('-1234', 'TFS');
      expect(positiveSuffix.abbreviatedValue(1, true)).toBe('1.2K¤'); // hits first branch of formatNumberWithSign
      expect(negativeSuffix.abbreviatedValue(1, true)).toBe('-1.2K¤'); // hits second branch of formatNumberWithSign
    });
  });

  describe('sign handling and formatting', () => {
    it('handles positive values without symbols', () => {
      const money = new Money('100', 'USD');
      expect(money.formattedValue()).toBe('100.00');
      expect(money.formattedValueWithSymbol()).toBe('$100.00'); // test without symbol
    });

    it('handles negative values without symbols', () => {
      const money = new Money('-100', 'USD');
      expect(money.formattedValue()).toBe('-100.00');
      expect(money.formattedValueWithSymbol()).toBe('-$100.00'); // test without symbol
    });

    it('handles sign placement with different symbol positions', () => {
      Currency.register({
        name: 'Test Sign',
        code: 'TSG',
        symbol: '¤',
        symbolPosition: 'suffix',
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
      });

      const positive = new Money('100', 'TSG');
      const negative = new Money('-100', 'TSG');

      // Test both with and without symbols
      expect(positive.formattedValue()).toBe('100.00');
      expect(negative.formattedValue()).toBe('-100.00');
      expect(positive.formattedValueWithSymbol()).toBe('100.00¤');
      expect(negative.formattedValueWithSymbol()).toBe('-100.00¤');
    });

    it('handles zero values with different sign and symbol combinations', () => {
      const zero = new Money('0', 'USD');
      const negZero = new Money('-0', 'USD');

      // Test with and without symbols
      expect(zero.formattedValue()).toBe('0.00');
      expect(negZero.formattedValue()).toBe('-0.00');
      expect(zero.formattedValueWithSymbol()).toBe('$0.00');
      expect(negZero.formattedValueWithSymbol()).toBe('-$0.00');
    });
  });

  describe('sign formatting', () => {
    it('formats signs correctly with symbols', () => {
      // Test prefix symbol
      const positivePrefix = new Money('100', 'USD');
      const negativePrefix = new Money('-100', 'USD');
      expect(positivePrefix.formattedValueWithSymbol()).toBe('$100.00'); // hits first branch
      expect(negativePrefix.formattedValueWithSymbol()).toBe('-$100.00'); // hits second branch

      // Test suffix symbol to ensure we're using formatNumberWithSign
      Currency.register({
        name: 'Test Sign',
        code: 'SGN',
        symbol: '¤',
        symbolPosition: 'suffix',
        decimalSeparator: '.',
        decimals: 2,
        minorUnits: '100',
        thousandsSeparator: ',',
      });

      const positiveSuffix = new Money('100', 'SGN');
      const negativeSuffix = new Money('-100', 'SGN');
      expect(positiveSuffix.formattedValueWithSymbol()).toBe('100.00¤'); // hits first branch
      expect(negativeSuffix.formattedValueWithSymbol()).toBe('-100.00¤'); // hits second branch
    });
  });
});
