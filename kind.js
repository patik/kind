/** @description Precise type-checker for JavaScript
 * @version 1.0.4
 * @date 2015-03-20
 * @copyright 2015
 * @see https://github.com/patik/kind
 */

/*global define: true */
(function (name, definition) {
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    }
    // Fall back to a global variable
    else {
        window[name] = definition();
    }
}('kind',
    function() {
        /**
         * Determine a variable's precise type
         * Objects are clarified if they're a common type (array, element, null, etc)
         * @param   {Mixed}    thing  Some variable to test
         * @param   {Boolean}  deep   Whether to dive deeper into some types to return a more specific type
         * @return  {String}          Lowercase name for the variable's type
         */
        var kind = function _kind(thing, deep) {
            var objectType, specialTypes, nodeTypes, i;

            /////////////////////////////
            // Basic, non-object types //
            /////////////////////////////

            // Null
            if (thing === null) {
                return 'null';
            }

            // Standard types except string and number
            if (/^function$|^undefined$|^boolean$/.test(typeof thing)) {
                return typeof thing;
            }

            // String and number can be deep-searched
            if (/^string$|^number$/.test(typeof thing)) {
                if (deep) {
                    // Strings
                    if (typeof thing === 'string') {
                        if (!thing.length) {
                            return 'emptystring';
                        }
                        else {
                            return 'string';
                        }
                    }

                    // Numbers
                    if (typeof thing === 'number') {
                        // Integer
                        if (parseInt(thing, 10) === thing) {
                            return 'integer';
                        }

                        // Float
                        if (parseFloat(thing) === thing) {
                            return 'float';
                        }
                    }
                }
                else {
                    return typeof thing;
                }
            }

            /////////////
            // Objects //
            /////////////

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

                // Events
                if (/\[object\s(\w+Event)\]/.test(objectType)) {
                    if (deep) {
                        return /\[object\s(\w+Event)\]/.exec(objectType)[1].toLowerCase();
                    }
                    else {
                        return 'event';
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
                nodeTypes = {
                    '1': 'element',
                    '2': 'attribute',
                    '3': 'text',
                    '4': 'cdata',
                    '5': 'entityreference',
                    '6': 'entity',
                    '7': 'processinginstruction',
                    '8': 'comment',
                    '9': 'document',
                    '10': 'documenttype',
                    '11': 'documentfragment',
                    '12': 'notation'
                };

                // DOM Level 2
                if (typeof Node === 'object' && thing instanceof Node) {
                    if (deep && thing.nodeType.toString() in nodeTypes) {
                        return nodeTypes[thing.nodeType];
                    }

                    return 'node';
                }

                // DOM Level 1
                if (typeof thing.nodeType === 'number' && typeof thing.nodeName === 'string') {
                    if (deep && thing.nodeType.toString() in nodeTypes) {
                        return nodeTypes[thing.nodeType];
                    }

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
                if (typeof thing.length === 'number' && thing !== window) {
                    return 'arraylike';
                }

                // Some other type of object, possible a plain object
                return 'object';
            }

            return 'unknown';
        };

        return kind;
    }
));
