export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyError';
  }
}

export class CurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurrencyError';
  }
}

export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Invalid amount provided',
  CURRENCY_MISMATCH: (current: string, other: string) => {
    return `Cannot operate on different currencies (current: "${current}", other: "${other}")`;
  },
  CURRENCY_NOT_FOUND: (code: string) => {
    return `Currency config for ${code} not found. Config can be registered with "Currency.register(<CurrencyConfig>)"`;
  },
  INVALID_CURRENCY_CONFIG: 'Invalid currency configuration',
  EMPTY_RATIOS: 'Cannot allocate to empty ratios',
  DIVISION_BY_ZERO: 'Division by zero is not allowed',
} as const;
