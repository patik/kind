# Kind

**A more precise version of JavaScript's `typeof`**

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]


## Description

`kind()` returns a *useful* name for a variable's type. It breaks down objects into more precise terms: array, null, element, etc.

Examples:

| Input | *typeof* | *kind* |
|:---------------|:--------|:------------|
| `[1, 2, 3]` | `"object"` | `"array"` |
| `null` | `"object"` | `"null"` |
| `document.getElementById('id')` | `"object"` | `"element"` |
| `document.getElementsByTagName('div')` | `"object"` | `"nodelist"` |
| `document.createTextNode('')` | `"object"` | `"node"` |
| `new Date()` | `"object"` | `"date"` |
| `{}` | `"object"` | `"object"` (if no special type was detected &mdash; see full list below) |

## Install

**yarn**: `yarn add kindjs`

**npm**: `npm install kindjs`

## Usage


```ts
import kind from 'kindjs';

kind(['hello', 'world']);
//=> 'array'
```

### Basic

```js
// Objects that aren't *really* objects
kind(null);       // "null"
kind([1, 2, 3]);  // "array"
kind(arguments);  // "arraylike"
kind(new Date()); // "date"
kind(document.getElementById('id'));        // "element"
kind(document.getElementsByTagName('div')); // "nodelist"

// This one's actually just an object
kind({});         // "object"

// Also works on standard types
kind("text");     // "string"
kind(2);          // "number"
kind(alert);      // "function"
```

### "Deep" option

You may add a second, boolean parameter to tell `kind` to perform a deeper test for some types. For example, instead of "number" it could return "integer" or "float".

```js
kind(1);          // "number"
kind(1, true);    // "integer"

kind(1.21);       // "number"
kind(1.21, true); // "float"

kind(evt);        // "event"
kind(evt, true);  // "mouseevent" (i.e. if the event was a click)
```

A complete list is noted below

## Supported types

- All standard types normally returned by `typeof`:
    + `function`, `undefined`, `boolean`
    + `string`
        * Deep option returns either `string` or `emptystring`
    + `number`
        * Deep option returns either `integer` or `float`
- `array`
- `arraylike`
    + A non-array object with a `.length` property
- `null`
- `element`
- `node`
    + Deep options from [this list](https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType) (e.g. `text`, `comment`)
- `nodelist`
- `event`
    + Deep options from [this list](https://developer.mozilla.org/en-US/docs/Web/Events) (e.g. `mouseevent`, `keyboardevent`)
- `regexp`
- `date`
- `error`
- `errorevent`
- `math`

## Features

- Works with any type, not just objects
- Always returns a simple lowercase string, just like the native `typeof`
- Handles undefined or undeclared variables
- Optimized to check for the most common types first
- Excellent browser support, including many very old browsers
    + IE 6+ (and maybe older)
    + Chrome
    + Firefox
    + Safari
    + Android 1+
    + Opera (pre-Blink)
    + Netscape 4 (in theory!)
    + Probably anything that runs JavaScript and supports regular expressions

[build-img]: https://github.com/patik/kind/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/patik/kind/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/kindjs
[downloads-url]: https://www.npmtrends.com/kindjs
[npm-img]: https://img.shields.io/npm/v/kindjs
[npm-url]: https://www.npmjs.com/package/kindjs
[issues-img]: https://img.shields.io/github/issues/patik/kind
[issues-url]: https://github.com/patik/kind/issues
[codecov-img]: https://codecov.io/gh/patik/kind/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/patik/kind
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release

