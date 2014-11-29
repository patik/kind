/** @description Precise type-checker for JavaScript
 * @version 1.0.1
 * @date 2014-11-29
 * @copyright 2014
 * https://github.com/patik/kind
 */

/**
 * Determine a variable's precise type
 * Objects are clarified if they're a common type (array, element, null, etc)
 * @param   {Any}     thing  Some variable to test
 * @return  {String}         Lowercase name for the variable's type
 */
window.kind = function _kind(thing) {
    var objectType, specialTypes, i;

    // Basic, non-object types:

    // Null
    if (thing === null) {
        return 'null';
    }

    // Other standard types
    if (/function|undefined|string|boolean|number/.test(typeof thing)) {
        return typeof thing;
    }

    // Objects:
    if (typeof thing === 'object') {
        objectType = Object.prototype.toString.call(thing);

        // Special JavaScript types that inherit from Object
        specialTypes = ['Math', 'ErrorEvent', 'Error', 'Date', 'RegExp', 'Event', 'Array'];
        i = specialTypes.length;

        while (i--) {
            if (objectType === '[object ' + specialTypes[i] + ']') {
                return specialTypes[i].toLowerCase();
            }
        }

        // DOM element:

        // DOM Level 2
        if (typeof HTMLElement === 'object' && thing instanceof HTMLElement) {
            return 'element';
        }

        // DOM Level 1
        if (typeof thing.nodeName === 'string' && thing.nodeType === 1) {
            return 'element';
        }

        // DOM node:

        // DOM Level 2
        if (typeof Node === 'object' && thing instanceof Node) {
            return 'node';
        }

        // DOM Level 1
        if (typeof thing.nodeType === 'number' && typeof thing.nodeName === 'string') {
            return 'node';
        }

        // Node lists
        if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(objectType) &&
            typeof thing.length === 'number' &&
            typeof thing.item !== 'undefined' &&
            (thing.length === 0 || (typeof thing[0] === 'object' && thing[0].nodeType > 0))) {
            return 'nodelist';
        }

        // Array-like object
        if (typeof thing.length === 'number') {
            return 'arraylike';
        }

        // Some other type of object
        return 'object';
    }

    return 'unknown';
};
