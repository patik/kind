function isDomNode(thing: unknown): thing is Node {
    return Boolean(thing) && thing instanceof Node && 'nodeName' in thing
}

type KnownType =
    | 'null'
    | 'function'
    | 'undefined'
    | 'boolean'
    | 'symbol'
    | 'string'
    | 'number'
    | 'emptystring'
    | 'bigint'
    | 'integer'
    | 'float'
    | 'array'
    | 'date'
    | 'error'
    | 'errorevent'
    | 'event'
    | 'map'
    | 'math'
    | 'promise'
    | 'regexp'
    | 'set'
    | 'url'
    | 'urlsearchparams'
    | 'event'
    | 'element'
    | 'attribute'
    | 'text'
    | 'cdata'
    | 'entityreference'
    | 'entity'
    | 'processinginstruction'
    | 'comment'
    | 'document'
    | 'documenttype'
    | 'documentfragment'
    | 'notation'
    | 'node'
    | 'nodelist'
    | 'arraylike'
    | 'object'
    | 'unknown'

/**
 * @abstract Determine a variable's precise type
 * @description Objects are clarified if they're a common type (array, element, null, etc)
 * @param    thing  Some variable to test
 * @param    deep   Whether to dive deeper into some types to return a more specific type
 * @return          Lowercase name for the variable's type
 */
function kind(thing: unknown = undefined, deep = false): KnownType {
    /////////////////////////////
    // Basic, non-object types //
    /////////////////////////////

    // Null
    if (thing === null) {
        return 'null'
    }

    // Standard types except string and number
    if ((['function', 'undefined', 'boolean', 'symbol', 'bigint'] as Array<KnownType>).includes(typeof thing)) {
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
        const specialTypes = [
            'Array',
            'Date',
            'Error',
            'ErrorEvent',
            'Event',
            'Map',
            'Math',
            'Promise',
            'RegExp',
            'Set',
            'URL',
            'URLSearchParams',
        ]
        let i = specialTypes.length

        while (i--) {
            if (objectType === `[object ${specialTypes[i]}]`) {
                return specialTypes[i].toLowerCase() as KnownType
            }
        }

        // Events
        if (/\[object\s(\w+Event)\]/.test(objectType)) {
            if (deep) {
                const result = /\[object\s(\w+Event)\]/.exec(objectType)

                if (result && result[1]) {
                    return result[1].toLowerCase() as KnownType
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
                    return nodeTypes[thing.nodeType] as KnownType
                }

                return 'node'
            }

            // DOM Level 1
            if ('nodeType' in thing && typeof thing.nodeType === 'number' && typeof thing.nodeName === 'string') {
                if (deep && thing.nodeType.toString() in nodeTypes) {
                    return nodeTypes[thing.nodeType] as KnownType
                }

                return 'node'
            }
        }

        // Node lists
        if (
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(objectType) &&
            'length' in thing &&
            typeof thing.length === 'number' &&
            'item' in thing &&
            typeof thing.item !== 'undefined'
        ) {
            if (thing.length === 0) {
                return 'nodelist'
            }

            if ('0' in thing && typeof thing[0] === 'object') {
                const firstElement = thing[0]

                if (firstElement && 'nodeType' in firstElement && firstElement.nodeType && firstElement.nodeType > 0) {
                    return 'nodelist'
                }
            }
        }

        // Array-like object
        if (
            'length' in thing &&
            Object.prototype.hasOwnProperty.call(thing, 'length') &&
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

export function identify<T>(thing: unknown, expectedType: KnownType): thing is T {
    return kind(thing, true) === expectedType
}
