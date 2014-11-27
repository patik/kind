# Kind

**A more precise version of JavaScript's `typeof`**

`kind()` returns a *useful* name for a variable's type. It breaks down objects into more precise terms: array, null, element, etc.

Examples:

| Input | Native `typeof` | **Kind** |
|:---------------|:--------|:------------|
| `[1, 2, 3]` | `"object"` | `"array"` |
| `null` | `"object"` | `"null"` |
| `document.getElementById('id')` | `"object"` | `"element"` |
| `document.getElementsByTagName('div')` | `"object"` | `"node"` |
| `new Date()` | `"object"` | `"date"` |
| `{}` | `"object"` | `"object"` (if no special type was detected &mdash; see full list below) |

## Usage

```js
// Objects that aren't *really* objects
kind(null);       // "null"
kind([1, 2, 3]);  // "array"
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

## Supported types

- All standard types normally returned by `typeof`
    + function, undefined, string, boolean, number
- array
- null
- element
- nodelist
- event
- regexp
- date
- error
- errorevent
- math

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
    + Probably anything that runs JavaScript
