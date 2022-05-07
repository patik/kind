# kindjs

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

> My awesome module

## Install

```bash
npm install kindjs
```

## Usage

```ts
import { kind } from 'kindjs';

kind('hello');
//=> 'string'
```

## API

### kind(input, options?)

#### input

Type: `string`

Lorem ipsum.

#### options

Type: `object`

##### postfix

Type: `string`
Default: `rainbows`

Lorem ipsum.

[build-img]: https://github.com/patik/typescript-npm-package-template/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/patik/typescript-npm-package-template/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/typescript-npm-package-template
[downloads-url]: https://www.npmtrends.com/typescript-npm-package-template
[npm-img]: https://img.shields.io/npm/v/typescript-npm-package-template
[npm-url]: https://www.npmjs.com/package/typescript-npm-package-template
[issues-img]: https://img.shields.io/github/issues/patik/typescript-npm-package-template
[issues-url]: https://github.com/patik/typescript-npm-package-template/issues
[codecov-img]: https://codecov.io/gh/patik/typescript-npm-package-template/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/patik/typescript-npm-package-template
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://patik.com"><img src="https://avatars.githubusercontent.com/u/9534477?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Craig Patik</b></sub></a><br /><a href="https://github.com/patik/typescript-npm-package-template/commits?author=patik" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

# Kind

**A more precise version of JavaScript's `typeof`**

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

## Installation

**npm**: `npm install kindjs`

**Bower**: `bower install kind`

Or just download [kind.js](https://github.com/patik/kind/blob/master/kind.js) and reference it in your page with a `<script>` tag.

## Usage

Available as a CommonJS module (e.g with RequireJS) or as a global method, `kind()`.

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
- Excellent browser support
    + IE 6+ (and maybe older)
    + Chrome
    + Firefox
    + Safari
    + Android 1+
    + Opera
    + Netscape 4 (in theory!)
    + Probably anything that runs JavaScript and supports regular expressions
