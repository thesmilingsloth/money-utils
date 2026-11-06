// Core exports
export { Money } from './core/Money';
export { Currency } from './core/Currency';

// Type exports
export type {
  MoneyOptions,
  MoneyComparisonResult,
  ValidMoneyInput,
  MoneyValidationResult,
} from './types/money';
export type { CurrencyConfig, SymbolPosition } from './types/currency';

// Constants exports
export {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_DECIMAL_SEPARATOR,
  DEFAULT_MINOR_UNITS,
  DEFAULT_THOUSANDS_SEPARATOR,
  SYMBOL_POSITION,
} from './constants/symbols';

// Fiat currencies (tree-shakeable)
export * as FIAT_CURRENCY_CONFIGS from './currencies/fiat';

// Crypto currencies (optional import)
export * as CRYPTO_CURRENCY_CONFIGS from './currencies/crypto';

// Other exports
export { ROUNDING_MODE } from './constants/money';
export * from './errors/MoneyErrors';
export * from './utils/moneyUtils';
export * from './types/guards';
