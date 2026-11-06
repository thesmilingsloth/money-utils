import type { ROUNDING_MODE } from '../constants/money';

/**
 * Type representing the available rounding modes for monetary calculations.
 * Uses decimal.js rounding modes for precise decimal arithmetic.
 *
 * @see {@link https://mikemcl.github.io/decimal.js/#modes}
 */
export type RoundingMode = (typeof ROUNDING_MODE)[keyof typeof ROUNDING_MODE];

/**
 * Represents a serializable money object.
 * Used for JSON serialization and data transfer.
 */
export type MoneyObject = {
  /** The currency code (e.g., "USD", "EUR") */
  currency: string;

  /** The currency symbol (e.g., "$", "€") */
  symbol: string;

  /** Number of decimal places for calculations */
  decimals: number;

  /** Number of decimal places for display */
  displayDecimals: number;

  /** Raw string value of the amount */
  value: string;

  /** Formatted value with currency symbol */
  prettyValue: string;
};

/**
 * Configuration options for creating Money instances.
 *
 * @example
 * ```typescript
 * const options: MoneyOptions = {
 *   symbol: "$",
 *   decimals: 2,
 *   displayDecimals: 2,
 *   roundingMode: ROUNDING_MODE.ROUND_HALF_UP
 * };
 * const money = new Money("100.50", "USD", options);
 * ```
 */
export type MoneyOptions = {
  /** Custom currency symbol to use instead of the default */
  symbol?: string;

  /** Number of decimal places for calculations */
  decimals?: number;

  /** Number of decimal places for display formatting */
  displayDecimals?: number;

  /** Rounding mode for calculations */
  roundingMode?: RoundingMode;
};

/**
 * Result object for comparing two Money instances.
 * Contains boolean flags for different comparison operations.
 */
export type MoneyComparisonResult = {
  /** Whether the two amounts are equal */
  equal: boolean;

  /** Whether the first amount is greater than the second */
  greaterThan: boolean;

  /** Whether the first amount is less than the second */
  lessThan: boolean;
};

/**
 * Valid input types for creating Money instances.
 * Accepts either string or number values.
 */
export type ValidMoneyInput = string | number;

/**
 * Result of validating a money input value.
 * Used to check if a value can be used to create a valid Money instance.
 */
export interface MoneyValidationResult {
  /** Whether the input is valid */
  isValid: boolean;

  /** Error message if validation failed */
  error?: string;
}
