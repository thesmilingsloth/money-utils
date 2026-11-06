import type { SYMBOL_POSITION } from '../constants/symbols';

/**
 * Represents the position of a currency symbol relative to the amount.
 * Can be either 'prefix' (before the amount) or 'suffix' (after the amount).
 */
export type SymbolPosition =
  (typeof SYMBOL_POSITION)[keyof typeof SYMBOL_POSITION];

/**
 * Configuration interface for defining currency properties.
 * Used to register new currencies or modify existing ones.
 *
 * @example
 * ```typescript
 * const customCurrency: CurrencyConfig = {
 *   name: "Custom Token",
 *   code: "CTK",
 *   symbol: "⚡",
 *   symbolPosition: "prefix",
 *   decimalSeparator: ".",
 *   decimals: 6,
 *   minorUnits: "1000000",
 *   thousandsSeparator: ",",
 *   isCrypto: true
 * };
 * ```
 */
export interface CurrencyConfig {
  /** Full name of the currency (e.g., "United States Dollar") */
  name: string;

  /** ISO 4217 currency code or custom code for cryptocurrencies (e.g., "USD", "BTC") */
  code: string;

  /** Currency symbol (e.g., "$", "€", "£", "₿") */
  symbol: string;

  /** Position of the currency symbol relative to the amount */
  symbolPosition: SymbolPosition;

  /** Character used to separate decimal places (e.g., "." or ",") */
  decimalSeparator: string;

  /** Number of decimal places for the currency */
  decimals: number;

  /** Number of minor units in the main unit (e.g., "100" for dollars/cents) */
  minorUnits: string;

  /** Character used to separate thousands (e.g., "," or ".") */
  thousandsSeparator: string;

  /** Whether the currency is a cryptocurrency */
  isCrypto?: boolean;
}
