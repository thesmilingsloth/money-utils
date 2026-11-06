# @thesmilingsloth/money-utils

A robust, type-safe money handling utility for JavaScript/TypeScript applications with support for both fiat and cryptocurrency operations.

<!-- [![npm downloads](https://img.shields.io/npm/dm/@thesmilingsloth/money-utils.svg?style=flat)](https://www.npmjs.com/package/@thesmilingsloth/money-utils) -->

[![npm version](https://img.shields.io/npm/v/@thesmilingsloth/money-utils.svg?style=flat)](https://www.npmjs.com/package/@thesmilingsloth/money-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@thesmilingsloth/money-utils)](https://bundlephobia.com/package/@thesmilingsloth/money-utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`@thesmilingsloth/money-utils` is a comprehensive solution for handling monetary calculations in JavaScript/TypeScript applications. It provides precise decimal arithmetic, supports both fiat and cryptocurrencies, and ensures type safety throughout your financial operations.

## Features

- 🎯 **Type-safe**: Written in TypeScript with comprehensive type definitions
- 💰 **Precise calculations**: Uses [decimal.js](https://github.com/MikeMcl/decimal.js/) for accurate decimal arithmetic
- 🌍 **Internationalization**: Built-in support for formatting and localization
- 🔄 **Currency conversion**: Support for both fiat and cryptocurrencies
- 🛡️ **Immutable operations**: All operations return new instances
- 🎨 **Customizable**: Configurable decimal places, rounding modes, and formatting options
- 🌲 **Tree-shakeable**: Import only what you need
- 0️⃣ **Minimal dependencies**: Only includes decimal.js for precise calculations

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Money Class](#money-class)
  - [Currency Management](#currency-management)
- [Default Options & Configurations](#default-options-and-configurations)
  - [Money Options](#money-options)
  - [Currency Defaults](#currency-defaults)
  - [Formatting Defaults](#formatting-defaults)
  - [Rounding Defaults](#rounding-defaults)
- [Advanced Usage](#advanced-usage)
  - [Custom Currencies](#custom-currencies)
  - [Rounding Modes](#rounding-modes)
  - [Allocation](#allocation)
  - [Formatting](#formatting)
  - [Comparison Operations](#comparison-operations)
  - [Value Extraction](#value-extraction)
  - [Serialization](#serialization)
- [API Documentation](#api-documentation)
  - [Money Class API](#money-class-api)
  - [Currency Class API](#currency-class-api)
  - [Types](#types)
  - [Constants](#constants)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)

## Installation

```bash
# Using npm
npm install @thesmilingsloth/money-utils

# Using yarn
yarn add @thesmilingsloth/money-utils

# Using pnpm
pnpm add @thesmilingsloth/money-utils
```

> **Note**: `decimal.js` is included as a dependency and will be automatically installed. No need to install it separately.

## Quick Start

```typescript
import { Money, Currency } from '@thesmilingsloth/money-utils';

// Create money instances
const price = new Money('99.99', 'USD');
const quantity = 2;

// Perform calculations
const subtotal = price.multiply(quantity);
const tax = subtotal.multiply('0.2'); // 20% tax
const total = subtotal.add(tax);

// Format output
console.log(total.toString()); // "$239.98"
console.log(total.toLocaleString('de-DE')); // "239,98 $"

// Work with different currencies
const euro = new Money('100', 'EUR');
const yen = new Money('10000', 'JPY');

// Compare amounts (same currency)
console.log(price.lessThan(total)); // true
```

## Core Concepts

### Money Class

The `Money` class is immutable and handles all monetary operations:

```typescript
// Basic operations
const amount = new Money('100.50', 'USD');
const doubled = amount.multiply(2);
const withTax = doubled.add(doubled.multiply('0.1')); // Add 10% tax

// Comparison
const isExpensive = withTax.greaterThan(new Money('200', 'USD'));

// Formatting
console.log(withTax.toString()); // "$221.10"
console.log(withTax.toLocaleString('ja-JP')); // "￥221.10"
```

### Currency Management

Manage currencies using the `Currency` class:

```typescript
// Built-in currencies
const usd = Currency.USD;
const eur = Currency.EUR;
const btc = Currency.BTC;

// Custom currency registration
Currency.register({
  name: 'Custom Token',
  code: 'CTK',
  symbol: '⚡',
  symbolPosition: 'prefix',
  decimals: 6,
  minorUnits: '1000000',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  isCrypto: true,
});

// Use custom currency
const tokenAmount = new Money('1000.123456', 'CTK');
```

## Default Options & Configurations

### Money Options

When creating a new `Money` instance, you can provide options to customize its behavior. Here are the default values:

```typescript
const defaultMoneyOptions = {
  decimals: undefined, // Uses the currency's default decimals
  displayDecimals: undefined, // Uses the currency's default decimals
  roundingMode: ROUNDING_MODE.ROUND_HALF_UP,
  symbol: undefined, // Uses the currency's default symbol
};

// Example with custom options
const amount = new Money('100.555', 'USD', {
  decimals: 3, // Override default decimal places
  displayDecimals: 2, // Show only 2 decimals in formatting
  roundingMode: ROUNDING_MODE.ROUND_DOWN,
  symbol: 'USD', // Custom symbol instead of "$"
});
```

### Currency Defaults

Built-in currencies come with pre-configured defaults. Here are some examples:

```typescript
// USD Configuration
const USDDefaults = {
  name: 'US Dollar',
  code: 'USD',
  symbol: '$',
  symbolPosition: 'prefix',
  decimals: 2,
  minorUnits: '100',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  isCrypto: false,
};

// BTC Configuration
const BTCDefaults = {
  name: 'Bitcoin',
  code: 'BTC',
  symbol: '₿',
  symbolPosition: 'prefix',
  decimals: 8,
  minorUnits: '100000000',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  isCrypto: true,
};

// Example of using defaults vs custom options
const defaultUSD = new Money('100', 'USD'); // Uses USD defaults
const customUSD = new Money('100', 'USD', {
  decimals: 4, // Override default 2 decimals
  symbol: 'US$', // Override default "$" symbol
});
```

### Formatting Defaults

The library uses the following default formatting behavior:

```typescript
// Default toString() behavior
const amount = new Money('1234.56', 'USD');
console.log(amount.toString()); // "$1,234.56"

// Default toLocaleString() options
console.log(amount.toLocaleString()); // Uses browser's default locale
console.log(amount.toLocaleString('en-US')); // "$1,234.56"
console.log(amount.toLocaleString('de-DE')); // "1.234,56 $"

// Custom format options
console.log(
  amount.toLocaleString('en-US', {
    style: 'currency',
    currencyDisplay: 'name', // "1,234.56 US dollars"
  }),
);
```

### Rounding Defaults

```typescript
// Default rounding mode is ROUND_HALF_UP
const amount = new Money('100.555', 'USD');
console.log(amount.toString()); // "$100.56"

// Different rounding modes
const roundDown = new Money('100.555', 'USD', {
  roundingMode: ROUNDING_MODE.ROUND_DOWN,
});
console.log(roundDown.toString()); // "$100.55"

const roundUp = new Money('100.555', 'USD', {
  roundingMode: ROUNDING_MODE.ROUND_UP,
});
console.log(roundUp.toString()); // "$100.56"
```

## Advanced Usage

### Rounding Modes

```typescript
import { Money, ROUNDING_MODE } from '@thesmilingsloth/money-utils';

const amount = new Money('100.555', 'USD', {
  roundingMode: ROUNDING_MODE.ROUND_HALF_UP,
  decimals: 2,
});

// Different rounding behaviors
console.log(amount.toString()); // "$100.56"
console.log(amount.round(1).toString()); // "$100.60"
```

### Allocation

Split amounts while handling remainders:

```typescript
const total = new Money('100', 'USD');

// Split by ratios
const shares = total.allocate([2, 3, 5]); // 20:30:50 ratio
console.log(shares.map((s) => s.toString()));
// ["$20.00", "$30.00", "$50.00"]

// Equal distribution
const equalShares = total.allocate([1, 1, 1]);
// ["$33.34", "$33.33", "$33.33"]
```

### Formatting

Flexible formatting options:

```typescript
const amount = new Money('1234567.89', 'USD');

// Basic formatting
console.log(amount.toString()); // "$1,234,567.89"
console.log(amount.formattedValue()); // "1,234,567.89"
console.log(amount.formattedValueWithSymbol()); // "$1,234,567.89"

// Localized formatting
console.log(amount.toLocaleString('en-US')); // "$1,234,567.89"
console.log(amount.toLocaleString('de-DE')); // "1.234.567,89 $"
console.log(amount.toLocaleString('ja-JP')); // "￥1,234,567.89"

// Custom format options
console.log(
  amount.toLocaleString('en-US', {
    style: 'currency',
    currencyDisplay: 'name',
  }),
); // "1,234,567.89 US dollars"
```

### Comparison Operations

Compare money instances:

```typescript
const amount1 = new Money('100.00', 'USD');
const amount2 = new Money('200.00', 'USD');

// Simple comparisons
const isEqual = amount1.equals(amount2); // false
const isGreater = amount1.greaterThan(amount2); // false
const isLess = amount1.lessThan(amount2); // true

// Combined comparison
const comparison = amount1.compare(amount2);
console.log(comparison); // { equal: false, greaterThan: false, lessThan: true }

// Value checks
const isZero = amount1.isZero(); // false
const isPositive = amount1.isPositive(); // true
const isNegative = amount1.isNegative(); // false
```

### Value Extraction

Access the underlying values:

```typescript
const amount = new Money('1234.56', 'USD');

// Get raw values
console.log(amount.value()); // "1234.56"
console.log(amount.absoluteValue()); // "1234.56"
console.log(amount.negatedValue()); // "-1234.56"

// Get formatted values
console.log(amount.formattedValue()); // "1,234.56"
console.log(amount.formattedValueWithSymbol()); // "$1,234.56"
```

### Serialization

Convert to and from JSON:

```typescript
const amount = new Money('1234.56', 'USD');

// Convert to JSON
const json = amount.toJSON();
console.log(json);
// {
//   currency: "USD",
//   symbol: "$",
//   decimals: 2,
//   displayDecimals: 2,
//   value: "1234.56",
//   prettyValue: "$1,234.56",
//   negative: false
// }

// Use in JSON.stringify()
const jsonString = JSON.stringify({ price: amount });
```

## API Documentation

### Money Class API

#### Constructor

```typescript
constructor(value: string | number, currency: string, options?: MoneyOptions)
```

Creates a new Money instance.

**Parameters:**

- `value`: The monetary value (string or number)
- `currency`: Currency code (e.g., "USD", "EUR")
- `options`: Optional configuration object

  ```typescript
  interface MoneyOptions {
    symbol?: string; // Custom currency symbol
    decimals?: number; // Decimal places for calculations
    displayDecimals?: number; // Decimal places for display
    roundingMode?: RoundingMode; // Rounding mode for calculations
  }
  ```

#### Static Methods

```typescript
static zero(currency: string, options?: MoneyOptions): Money
```

Creates a zero-value Money instance.

```typescript
static from(value: string | number, currency: string, options?: MoneyOptions): Money
```

Alternative constructor method.

#### Arithmetic Methods

```typescript
add(other: Money): Money              // Add two Money instances
subtract(other: Money): Money         // Subtract Money instances
multiply(factor: number): Money       // Multiply by a number
divide(divisor: number): Money        // Divide by a number
allocate(ratios: number[]): Money[]   // Split into proportional parts
```

#### Comparison Methods

```typescript
equals(other: Money): boolean
greaterThan(other: Money): boolean
lessThan(other: Money): boolean
greaterThanOrEqual(other: Money): boolean
lessThanOrEqual(other: Money): boolean
compare(other: Money): MoneyComparisonResult
```

#### Value Methods

```typescript
value(): string                      // Raw value as string
absoluteValue(): string              // Absolute value
negatedValue(): string               // Negated value
isZero(): boolean                    // Check if zero
isPositive(): boolean                // Check if positive
isNegative(): boolean                // Check if negative
```

#### Formatting Methods

```typescript
toString(): string                  // Format with symbol
formattedValue(): string            // Format without symbol
formattedValueWithSymbol(): string  // Format with symbol
toLocaleString(locale?: string, options?: Intl.NumberFormatOptions): string
```

### Currency Class API

#### Static Methods

```typescript
static register(currency: CurrencyConfig | CurrencyConfig[]): void
```

Register new currency configurations.

```typescript
static unregister(currency: CurrencyConfig | CurrencyConfig[]): void
```

Remove currency configurations.

```typescript
static getCurrency(code: string): CurrencyConfig | undefined
```

Get currency configuration by code.

```typescript
static initialize(currencies?: CurrencyConfig[]): void
```

Initialize currency registry.

#### Static Properties

```typescript
static readonly USD: CurrencyConfig  // US Dollar configuration
static readonly EUR: CurrencyConfig  // Euro configuration
static readonly GBP: CurrencyConfig  // British Pound configuration
static readonly JPY: CurrencyConfig  // Japanese Yen configuration
static readonly BTC: CurrencyConfig  // Bitcoin configuration
static readonly ETH: CurrencyConfig  // Ethereum configuration
```

### Types

#### CurrencyConfig

```typescript
interface CurrencyConfig {
  name: string; // Full currency name
  code: string; // Currency code
  symbol: string; // Currency symbol
  symbolPosition: string; // 'prefix' or 'suffix'
  decimalSeparator: string; // Decimal point character
  decimals: number; // Number of decimal places
  minorUnits: string; // Minor units in main unit
  thousandsSeparator: string; // Thousands separator
  isCrypto?: boolean; // Is cryptocurrency
}
```

#### MoneyComparisonResult

```typescript
interface MoneyComparisonResult {
  equal: boolean;
  greaterThan: boolean;
  lessThan: boolean;
}
```

### Constants

#### ROUNDING_MODE

```typescript
const ROUNDING_MODE = {
  ROUND_UP: 0, // Round away from zero
  ROUND_DOWN: 1, // Round toward zero
  ROUND_CEIL: 2, // Round toward +Infinity
  ROUND_FLOOR: 3, // Round toward -Infinity
  ROUND_HALF_UP: 4, // Round half away from zero
  ROUND_HALF_DOWN: 5, // Round half toward zero
  ROUND_HALF_EVEN: 6, // Round half to even
  ROUND_HALF_CEIL: 7, // Round half toward +Infinity
  ROUND_HALF_FLOOR: 8, // Round half toward -Infinity
} as const;
```

#### SYMBOL_POSITION

```typescript
const SYMBOL_POSITION = {
  PREFIX: 'prefix', // Symbol before amount
  SUFFIX: 'suffix', // Symbol after amount
} as const;
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Run linter
pnpm lint

# Check types
pnpm typecheck
```

## Testing

We use Vitest for testing. Run the test suite:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## License

MIT © [Smiling Sloth](https://github.com/thesmilingsloth)

## Acknowledgments

- [decimal.js](https://github.com/MikeMcl/decimal.js/) for precise decimal arithmetic
- Inspired by various money handling libraries in the JavaScript ecosystem
