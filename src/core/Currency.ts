import { BTC_CONFIG, ETH_CONFIG } from '../currencies/crypto';
import {
  EUR_CONFIG,
  GBP_CONFIG,
  JPY_CONFIG,
  USD_CONFIG,
} from '../currencies/fiat';
import { CurrencyConfig } from '../types/currency';

const DEFAULT_CURRENCIES = [
  USD_CONFIG,
  EUR_CONFIG,
  GBP_CONFIG,
  JPY_CONFIG,

  BTC_CONFIG,
  ETH_CONFIG,
];

/**
 * Error class for currency-related operations.
 */
export class CurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurrencyError';
  }
}

/**
 * Manages currency configurations and provides a singleton registry for currency operations.
 * Implements the Singleton pattern to ensure a single source of truth for currency configurations.
 *
 * @example
 * ```typescript
 * // Register a new currency
 * Currency.register({
 *   name: 'Custom Token',
 *   code: 'CTK',
 *   symbol: '⚡',
 *   symbolPosition: 'prefix',
 *   decimalSeparator: '.',
 *   decimals: 6,
 *   minorUnits: '1000000',
 *   thousandsSeparator: ',',
 *   isCrypto: true
 * });
 *
 * // Get a currency configuration
 * const usd = Currency.getCurrency('USD');
 * ```
 */
export class Currency {
  private static instance: Currency | null = null;
  private readonly _currencies: Map<string, CurrencyConfig>;

  /**
   * Private constructor to prevent direct construction calls with 'new'.
   * Part of the Singleton pattern implementation.
   */
  private constructor() {
    // Initialize the map with default currencies directly, without using register
    this._currencies = new Map(
      DEFAULT_CURRENCIES.map((currency) => [currency.code, currency]),
    );
  }

  /**
   * Gets the singleton instance of the Currency class.
   * Creates a new instance if one doesn't exist.
   *
   * @returns The singleton Currency instance
   */
  static getInstance(): Currency {
    if (!Currency.instance) {
      Currency.instance = new Currency();
    }

    return Currency.instance;
  }

  /**
   * Registers one or more currency configurations.
   *
   * @param currency - Single currency config or array of configs to register
   * @returns The registered currency configuration(s)
   * @throws {CurrencyError} If the currency configuration is invalid
   *
   * @example
   * ```typescript
   * Currency.register({
   *   name: 'Custom Currency',
   *   code: 'XCC',
   *   symbol: '¤',
   *   symbolPosition: 'prefix',
   *   decimalSeparator: '.',
   *   decimals: 2,
   *   minorUnits: '100',
   *   thousandsSeparator: ','
   * });
   * ```
   */
  static register(currency: CurrencyConfig | CurrencyConfig[]) {
    return Currency.getInstance().registerCurrency(currency);
  }

  /**
   * Internal method to register currency configurations.
   *
   * @param currency - Currency config(s) to register
   * @returns The registered currency configuration(s)
   * @throws {CurrencyError} If the currency configuration is invalid
   */
  private registerCurrency(currency: CurrencyConfig | CurrencyConfig[]) {
    if (Array.isArray(currency)) {
      currency.forEach((curr) => {
        this.validateCurrencyConfig(curr);
        this._currencies.set(curr.code, curr);
      });
    } else {
      this.validateCurrencyConfig(currency);
      this._currencies.set(currency.code, currency);
    }

    return currency;
  }

  /**
   * Unregisters one or more currency configurations.
   *
   * @param currency - Currency config(s) to unregister
   */
  static unregister(currency: CurrencyConfig | CurrencyConfig[]) {
    Currency.getInstance().unregisterCurrency(currency);
  }

  /**
   * Internal method to unregister currency configurations.
   *
   * @param currency - Currency config(s) to unregister
   */
  private unregisterCurrency(currency: CurrencyConfig | CurrencyConfig[]) {
    if (Array.isArray(currency)) {
      currency.forEach((curr) => this._currencies.delete(curr.code));
    } else {
      this._currencies.delete(currency.code);
    }
  }

  /**
   * Gets all registered currency configurations.
   *
   * @returns Array of all registered currency configurations
   */
  static get currencies(): CurrencyConfig[] {
    return Currency.getInstance().getAllCurrencies();
  }

  /**
   * Internal method to get all registered currencies.
   *
   * @returns Array of all registered currency configurations
   */
  private getAllCurrencies(): CurrencyConfig[] {
    return Array.from(this._currencies.values());
  }

  /**
   * Gets a specific currency configuration by its code.
   *
   * @param code - The currency code to look up
   * @returns The currency configuration or undefined if not found
   *
   * @example
   * ```typescript
   * const usd = Currency.getCurrency('USD');
   * if (usd) {
   *   console.log(usd.symbol); // "$"
   * }
   * ```
   */
  static getCurrency(code: string): CurrencyConfig | undefined {
    return Currency.getInstance()._currencies.get(code);
  }

  /** Pre-configured USD currency configuration */
  static readonly USD = Currency.getCurrency(USD_CONFIG.code);
  /** Pre-configured EUR currency configuration */
  static readonly EUR = Currency.getCurrency(EUR_CONFIG.code);
  /** Pre-configured GBP currency configuration */
  static readonly GBP = Currency.getCurrency(GBP_CONFIG.code);
  /** Pre-configured JPY currency configuration */
  static readonly JPY = Currency.getCurrency(JPY_CONFIG.code);
  /** Pre-configured BTC currency configuration */
  static readonly BTC = Currency.getCurrency(BTC_CONFIG.code);
  /** Pre-configured ETH currency configuration */
  static readonly ETH = Currency.getCurrency(ETH_CONFIG.code);

  /**
   * Initializes the currency registry with specified currencies or defaults.
   * Clears all existing currencies before initialization.
   *
   * @param currencies - Optional array of currency configurations to initialize with
   *
   * @example
   * ```typescript
   * // Initialize with only USD and EUR
   * Currency.initialize([Currency.USD, Currency.EUR]);
   * ```
   */
  static initialize(currencies?: CurrencyConfig[]) {
    Currency.getInstance().initializeCurrencies(currencies);
  }

  /**
   * Internal method to initialize currencies.
   *
   * @param currencies - Optional array of currency configurations
   */
  private initializeCurrencies(currencies?: CurrencyConfig[]) {
    this._currencies.clear();

    if (currencies) {
      this.registerCurrency(currencies);
    } else {
      this.registerCurrency(DEFAULT_CURRENCIES);
    }
  }

  /**
   * Validates a currency configuration.
   *
   * @param config - The currency configuration to validate
   * @throws {CurrencyError} If the configuration is invalid
   */
  private validateCurrencyConfig(config: CurrencyConfig) {
    if (!config.code || !config.symbol || !config.name) {
      throw new CurrencyError('Invalid currency configuration');
    }
  }
}
