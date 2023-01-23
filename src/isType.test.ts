import kind from '.'
import isType from './isType'

describe('Identity checks', () => {
    describe('String', () => {
        test('Non-empty', () => {
            expect(isType('{}', 'string')).toBe(true)
            expect(isType('{}', 'emptystring')).toBe(false)
        })

        test('Empty', () => {
            expect(isType('', 'emptystring')).toBe(true)
            expect(isType('', 'string')).toBe(false)
        })
    })

    test('Undefined', () => {
        expect(isType(undefined, 'undefined')).toBe(true)
    })

    test('Anonymous function', () => {
        const foo = function () {}

        expect(isType(foo, 'function')).toBe(true)

        if (isType(foo, 'function')) {
            const bar = foo
            expect(isType(bar, 'function')).toBe(true)
        }
    })

    test('Arrow function', () => {
        const myFunc = () => {}

        expect(isType(myFunc, 'function')).toBe(true)

        if (isType(myFunc, 'function')) {
            const bar = myFunc
            expect(isType(bar, 'function')).toBe(true)
        }
    })

    test('Defined function', () => {
        expect(isType(kind, 'function')).toBe(true)

        function myFunc() {
            return
        }

        expect(isType(myFunc, 'function')).toBe(true)
    })

    test('DOM method', () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const foo = document.getElementById

        expect(isType(foo, 'function')).toBe(true)

        if (isType(foo, 'function')) {
            const bar = foo

            expect(isType(bar, 'function')).toBe(true)
        }
    })

    test('Boolean', () => {
        const foo = document ? true : false

        expect(isType(foo, 'boolean')).toBe(true)

        if (isType(foo, 'boolean')) {
            const bar = foo

            expect(isType(bar, 'boolean')).toBe(true)
        }
    })

    test('Boolean (coerced)', () => {
        const foo = !null

        expect(isType(foo, 'boolean')).toBe(true)

        if (isType(foo, 'boolean')) {
            const bar = foo

            expect(isType(bar, 'boolean')).toBe(true)
        }
    })

    describe('Number', () => {
        test('Integer', () => {
            const foo = 1

            expect(isType(foo, 'integer')).toBe(true)

            if (isType(foo, 'integer')) {
                const bar = foo

                expect(isType(bar, 'integer')).toBe(true)
            }
        })

        test('Float', () => {
            const foo = 1.21

            expect(isType(foo, 'float')).toBe(true)

            if (isType(foo, 'float')) {
                const bar = foo

                expect(isType(bar, 'float')).toBe(true)
            }
        })
    })

    test('Null', () => {})
})

describe('Null', function () {
    test('Literal null', () => {
        const foo = null

        expect(isType(foo, 'null')).toBe(true)

        if (isType(foo, 'null')) {
            const bar = foo

            expect(isType(bar, 'null')).toBe(true)
        }
    })

    test('No element found with given ID', () => {
        const foo = document.getElementById('nonexistent')

        expect(isType(foo, 'null')).toBe(true)

        if (isType(foo, 'null')) {
            const bar = foo

            expect(isType(bar, 'null')).toBe(true)
        }
    })
})

describe('Arrays', function () {
    test('Standard array is properly detected', () => {
        const foo = [1, 2, 3]

        expect(isType(foo, 'array')).toBe(true)

        if (isType(foo, 'array')) {
            const bar = foo

            expect(isType(bar, 'array')).toBe(true)
        }
    })

    test('Empty array is properly detected', () => {
        const foo: [] = []

        expect(isType(foo, 'array')).toBe(true)

        if (isType(foo, 'array')) {
            const bar = foo

            expect(isType(bar, 'array')).toBe(true)
        }
    })

    test('Array created by the constructor is detected', () => {
        const foo = new Array(1)

        expect(isType(foo, 'array')).toBe(true)

        if (isType(foo, 'array')) {
            const bar = foo

            expect(isType(bar, 'array')).toBe(true)
        }
    })

    test('Nodelist is not considered an array', () => {
        const foo = document.getElementsByTagName('div')

        expect(isType(foo, 'array')).toBe(false)
    })

    test('String with `length` is not considered an array', () => {
        const foo = 'str'

        expect(isType(foo, 'array')).toBe(false)
    })
})

describe('Array-like objects', function () {
    test('Arguments is considered to be array-like', () => {
        // eslint-disable-next-line prefer-rest-params
        const foo = arguments

        expect(isType(foo, 'arraylike')).toBe(true)

        if (isType(foo, 'arraylike')) {
            const bar = foo

            expect(isType(bar, 'arraylike')).toBe(true)
        }
    })

    test('Standard array is not considered array-like', () => {
        const foo = [1, 2, 3]

        expect(isType(foo, 'arraylike')).toBe(false)
    })

    test('Nodelist is not considered array-like', () => {
        const foo = document.getElementsByTagName('div')

        expect(isType(foo, 'arraylike')).toBe(false)
    })
})

describe('Built-in special objects', function () {
    test('Date', () => {
        const foo = new Date()

        expect(isType(foo, 'date')).toBe(true)

        if (isType(foo, 'date')) {
            const bar = foo

            expect(isType(bar, 'date')).toBe(true)
        }
    })

    describe('Regular expression', () => {
        test('Literal', () => {
            expect(kind(/regular\sexpression/)).toBe('regexp')
            expect(kind(/regular\sexpression/, true)).toBe('regexp')
        })

        test('Constructor', () => {
            expect(kind(new RegExp('regular\\sexpression'))).toBe('regexp')
            expect(kind(new RegExp('regular\\sexpression'), true)).toBe('regexp')
        })
    })

    test('Error', () => {
        expect(kind(new Error('foo'))).toBe('error')
        expect(kind(new Error('foo'), true)).toBe('error')
    })

    test('Math', () => {
        expect(kind(Math)).toBe('math')
        expect(kind(Math, true)).toBe('math')
    })

    test('Event', () => {
        const testDiv = document.createElement('div')

        testDiv.addEventListener(
            'click',
            function (evt) {
                expect(kind(evt)).toBe('event')
                expect(kind(evt, true)).toBe('mouseevent')
            },
            false,
        )

        testDiv.click()
    })

    test('Array (constructor)', () => {
        expect(kind(Array)).toBe('function')
        expect(kind(Array, true)).toBe('function')
    })

    test('Promise', () => {
        expect(kind(new Promise(() => undefined))).toBe('promise')
        expect(kind(new Promise(() => undefined), true)).toBe('promise')
    })

    test('Set', () => {
        expect(kind(new Set())).toBe('set')
        expect(kind(new Set(), true)).toBe('set')
    })

    test('URL', () => {
        expect(kind(new URL('https://www.example.com'))).toBe('url')
        expect(kind(new URL('https://www.example.com'), true)).toBe('url')
    })

    test('URLSearchParams', () => {
        expect(kind(new URLSearchParams('https://www.example.com'))).toBe('urlsearchparams')
        expect(kind(new URLSearchParams('https://www.example.com'), true)).toBe('urlsearchparams')
    })

    test('Map', () => {
        expect(kind(new Map())).toBe('map')
        expect(kind(new Map(), true)).toBe('map')
    })

    test('Symbol', () => {
        expect(kind(Symbol())).toBe('symbol')
        expect(kind(Symbol(), true)).toBe('symbol')
    })
})

describe('Elements and nodes', function () {
    const elems = document.getElementsByTagName('*')

    test('Single item from nodelist detected as an element', () => {
        expect(kind(elems[0])).toBe('element')
        expect(kind(elems[0], true)).toBe('element')
    })

    test('getElementById result is an element', () => {
        expect(kind(document.createElement('div'))).toBe('element')
        expect(kind(document.createElement('div'), true)).toBe('element')
    })

    test('Result of getElementsByTagName is a nodelist', () => {
        expect(kind(elems)).toBe('nodelist')
        expect(kind(elems, true)).toBe('nodelist')
    })

    test('document.body is an element', () => {
        expect(kind(document.body)).toBe('element')
        expect(kind(document.body, true)).toBe('element')
    })
    test('document.documentElement is an element', () => {
        expect(kind(document.documentElement)).toBe('element')
        expect(kind(document.documentElement, true)).toBe('element')
    })
    test('Empty nodelist item detected as undefined', () => {
        expect(kind(document.getElementsByTagName('nonexistent')[0])).toBe('undefined')
        expect(kind(document.getElementsByTagName('nonexistent')[0], true)).toBe('undefined')
    })
})

describe('Elements and nodes (deep)', function () {
    test('Comment is detected', () => {
        const div = document.createElement('div')

        div.innerHTML = '<p>hello</p><!-- here is a comment -->'

        expect(kind(div.firstChild, true)).toBe('element')
        expect(kind(div.childNodes[1], true)).toBe('comment')
    })

    test('document is correctly identified', () => {
        expect(kind(document, true)).toBe('document')
    })
})

describe('Plain object', function () {
    test('Standard object declaration', () => {
        expect(kind({ foo: 'bar' })).toBe('object')
        expect(kind({ foo: 'bar' }, true)).toBe('object')
    })

    test('Standard object declaration (empty)', () => {
        expect(kind({})).toBe('object')
        expect(kind({}, true)).toBe('object')
    })

    test('Object constructor', () => {
        expect(kind(new Object())).toBe('object')
        expect(kind(new Object(), true)).toBe('object')
    })

    test('Array not considered an object', () => {
        expect(kind([1, 2])).not.toBe('object')
        expect(kind([1, 2], true)).not.toBe('object')
    })

    const elems = document.getElementsByTagName('*')

    test('Nodelist not considered an object', () => {
        expect(kind(elems)).not.toBe('object')
        expect(kind(elems, true)).not.toBe('object')
    })

    test('Element not considered an object', () => {
        expect(kind(elems[0])).not.toBe('object')
        expect(kind(elems[0], true)).not.toBe('object')
    })

    test('Text node not considered an object', () => {
        expect(kind(document.createTextNode(''))).not.toBe('object')
        expect(kind(document.createTextNode(''), true)).not.toBe('object')
    })
})
