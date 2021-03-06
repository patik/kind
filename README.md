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
