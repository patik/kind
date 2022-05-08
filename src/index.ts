/**
 * @name kind
 * @description Precise type-checker for JavaScript
 * @version 2.0.0
 * @date 2022-05-07
 * @copyright 2022
 * @link https://github.com/patik/kind
 */

function isDomNode(thing: unknown): thing is Node {
    return Boolean(thing) && thing instanceof Node && 'nodeName' in thing
}

/**
 * @abstract Determine a variable's precise type
 * @description Objects are clarified if they're a common type (array, element, null, etc)
 * @param    thing  Some variable to test
 * @param    deep   Whether to dive deeper into some types to return a more specific type
 * @return          Lowercase name for the variable's type
 */
function kind(thing: unknown = undefined, deep = false): string {
    /////////////////////////////
    // Basic, non-object types //
    /////////////////////////////

    // Null
    if (thing === null) {
        return 'null'
    }

    // Standard types except string and number
    if (['function', 'undefined', 'boolean'].includes(typeof thing)) {
        return typeof thing
    }

    // String and number can be deep-searched
    if (['string', 'number'].includes(typeof thing)) {
        if (!deep) {
            return typeof thing
        }

        // Strings
        if (typeof thing === 'string') {
            if (!thing.length) {
                return 'emptystring'
            } else {
                return 'string'
            }
        }

        // Numbers
        if (typeof thing === 'number') {
            // Integer
            if (parseInt(`${thing}`, 10) === thing) {
                return 'integer'
            }

            // Float
            if (parseFloat(`${thing}`) === thing) {
                return 'float'
            }
        }
    }

    /////////////
    // Objects //
    /////////////

    if (typeof thing === 'object') {
        const objectType = Object.prototype.toString.call(thing)

        // Special JavaScript types that inherit from Object
        const specialTypes = ['Math', 'ErrorEvent', 'Error', 'Date', 'RegExp', 'Event', 'Array']
        let i = specialTypes.length

        while (i--) {
            if (objectType === `[object ${specialTypes[i]}]`) {
                return specialTypes[i].toLowerCase()
            }
        }

        // Events
        if (/\[object\s(\w+Event)\]/.test(objectType)) {
            if (deep) {
                const result = /\[object\s(\w+Event)\]/.exec(objectType)

                if (result && result[1]) {
                    return result[1].toLowerCase()
                }
            }

            return 'event'
        }

        // DOM element:

        // DOM Level 2
        if (typeof HTMLElement === 'object' && thing instanceof HTMLElement) {
            return 'element'
        }

        // DOM Level 1
        if (isDomNode(thing) && 'nodeName' in thing && typeof thing.nodeName === 'string' && thing.nodeType === 1) {
            return 'element'
        }

        // DOM node:
        const nodeTypes: Record<number, string> = {
            1: 'element',
            2: 'attribute',
            3: 'text',
            4: 'cdata',
            5: 'entityreference',
            6: 'entity',
            7: 'processinginstruction',
            8: 'comment',
            9: 'document',
            10: 'documenttype',
            11: 'documentfragment',
            12: 'notation',
        }

        // DOM Level 2
        if (isDomNode(thing)) {
            if (typeof Node === 'object' && thing instanceof Node) {
                if (
                    deep &&
                    typeof thing.nodeType.toString === 'function' &&
                    thing.nodeType.toString() in nodeTypes &&
                    Object.keys(nodeTypes).map(Number).includes(thing.nodeType)
                ) {
                    return nodeTypes[thing.nodeType]
                }

                return 'node'
            }

            // DOM Level 1
            if (
                'nodeType' in thing &&
                Object.prototype.hasOwnProperty.call(thing, 'nodeType') &&
                typeof thing.nodeType === 'number' &&
                typeof thing.nodeName === 'string'
            ) {
                if (deep && thing.nodeType.toString() in nodeTypes) {
                    return nodeTypes[thing.nodeType]
                }

                return 'node'
            }
        }

        // Node lists
        if (
            thing instanceof NodeList &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(objectType) &&
            typeof thing.length === 'number' &&
            typeof thing.item !== 'undefined' &&
            (thing.length === 0 || (typeof thing[0] === 'object' && thing[0].nodeType > 0))
        ) {
            return 'nodelist'
        }

        // Array-like object
        if (
            'length' in thing &&
            Object.prototype.hasOwnProperty.call(thing, 'length') &&
            // @ts-ignore
            typeof thing.length === 'number' &&
            thing !== window
        ) {
            return 'arraylike'
        }

        // Some other type of object, possible a plain object
        return 'object'
    }

    return 'unknown'
}

export default kind
