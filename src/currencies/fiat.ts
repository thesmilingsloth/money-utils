import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_DECIMAL_SEPARATOR,
  DEFAULT_MINOR_UNITS,
  DEFAULT_THOUSANDS_SEPARATOR,
  SYMBOL_POSITION,
} from '../constants/symbols';
import { CurrencyConfig } from '../types/currency';

export const USD_CONFIG: CurrencyConfig = {
  name: 'United States Dollar',
  code: 'USD',
  symbol: '$',
  symbolPosition: SYMBOL_POSITION.PREFIX,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  decimals: DEFAULT_DECIMAL_PLACES,
  minorUnits: DEFAULT_MINOR_UNITS,
  thousandsSeparator: DEFAULT_THOUSANDS_SEPARATOR,
  isCrypto: false,
} as const;

export const EUR_CONFIG: CurrencyConfig = {
  name: 'Euro',
  code: 'EUR',
  symbol: '€',
  symbolPosition: SYMBOL_POSITION.PREFIX,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  decimals: DEFAULT_DECIMAL_PLACES,
  minorUnits: DEFAULT_MINOR_UNITS,
  thousandsSeparator: DEFAULT_THOUSANDS_SEPARATOR,
  isCrypto: false,
} as const;

export const JPY_CONFIG: CurrencyConfig = {
  name: 'Japanese Yen',
  code: 'JPY',
  symbol: '¥',
  symbolPosition: SYMBOL_POSITION.PREFIX,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  decimals: DEFAULT_DECIMAL_PLACES,
  minorUnits: DEFAULT_MINOR_UNITS,
  thousandsSeparator: DEFAULT_THOUSANDS_SEPARATOR,
  isCrypto: false,
} as const;

export const GBP_CONFIG: CurrencyConfig = {
  name: 'British Pound',
  code: 'GBP',
  symbol: '£',
  symbolPosition: SYMBOL_POSITION.PREFIX,
  decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
  decimals: DEFAULT_DECIMAL_PLACES,
  minorUnits: DEFAULT_MINOR_UNITS,
  thousandsSeparator: DEFAULT_THOUSANDS_SEPARATOR,
  isCrypto: false,
} as const;
