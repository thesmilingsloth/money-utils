import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_DECIMAL_SEPARATOR,
  DEFAULT_MINOR_UNITS,
  DEFAULT_THOUSANDS_SEPARATOR,
  SYMBOL_POSITION,
} from '../../constants/symbols';

describe('Symbol Constants', () => {
  it('has correct default values', () => {
    expect(DEFAULT_DECIMAL_PLACES).toBe(2);
    expect(DEFAULT_DECIMAL_SEPARATOR).toBe('.');
    expect(DEFAULT_MINOR_UNITS).toBe('100');
    expect(DEFAULT_THOUSANDS_SEPARATOR).toBe(',');
  });

  it('has correct symbol positions', () => {
    expect(SYMBOL_POSITION.PREFIX).toBe('prefix');
    expect(SYMBOL_POSITION.SUFFIX).toBe('suffix');
  });
});
