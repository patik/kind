import { kind } from '../src'

describe('Standard types', () => {
    describe('String', () => {
        test('Non-empty', () => {
            expect(kind('{}')).toBe('string')
            expect(kind('{}', true)).toBe('string')
        })

        test('Empty', () => {
            expect(kind('')).toBe('string')
            expect(kind('', true)).toBe('emptystring')
        })
    })

    test('Undefined', () => {
        expect(kind()).toBe('undefined')
    })

    test('Anonymous function', () => {
        expect(kind(function () {})).toBe('function')
    })

    test('Arrow function', () => {
        expect(kind(() => {})).toBe('function')
    })

    test('Defined function', () => {
        expect(kind(kind)).toBe('function')
    })

    test('DOM method', () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(kind(document.getElementById)).toBe('function')
    })

    test('Boolean', () => {
        expect(kind(false)).toBe('boolean')
    })

    test('Boolean (coerced)', () => {
        expect(kind(!null)).toBe('boolean')
    })

    describe('Number', () => {
        test('Integer', () => {
            expect(kind(1)).toBe('number')
            expect(kind(1, true)).toBe('integer')
        })

        test('Float', () => {
            expect(kind(1.21)).toBe('number')
            expect(kind(1.21, true)).toBe('float')
        })
    })

    test('Null', () => {
        expect(kind(null)).toBe('null')
    })

    test('Undefined', () => {
        expect(kind(undefined)).toBe('undefined')
    })
})

describe('Null', function () {
    test('Literal null', () => {
        expect(kind(null)).toBe('null')
    })

    test('No element found with given ID', () => {
        expect(kind(document.getElementById('nonexistent'))).toBe('null')
    })
})

describe('Array', function () {
    test('Standard array properly detected', () => {
        expect(kind([1, 2, 3])).toBe('array')
    })

    test('Empty array properly detected', () => {
        expect(kind([])).toBe('array')
    })

    test('Array constructor detected', () => {
        expect(kind(new Array(1))).toBe('array')
    })

    test('Nodelist not considered an array', () => {
        expect(kind(document.getElementsByTagName('div'))).not.toBe('array')
    })

    test('String with `length` not considered an array', () => {
        expect(kind('str')).not.toBe('array')
    })
})

describe('Array-like objects', function () {
    test('Arguments', () => {
        // eslint-disable-next-line prefer-rest-params
        expect(kind(arguments)).toBe('arraylike')
    })

    test('Standard array not considered arraylike', () => {
        expect(kind([1, 2, 3])).not.toBe('arraylike')
    })

    test('Nodelist not considered arraylike', () => {
        expect(kind(document.getElementsByTagName('div'))).not.toBe('arraylike')
    })
})

describe('Built-in special objects', function () {
    test('Date', () => {
        expect(kind(new Date())).toBe('date')
    })

    describe('Regular expression', () => {
        test('Literal', () => {
            expect(kind(/regular\sexpression/)).toBe('regexp')
        })

        test('Constructor', () => {
            expect(kind(new RegExp('regular\\sexpression'))).toBe('regexp')
        })
    })

    test('Error', () => {
        expect(kind(new Error('foo'))).toBe('error')
    })

    test('Math', () => {
        expect(kind(Math)).toBe('math')
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

    test('Array', () => {
        expect(kind(Array)).toBe('function')
    })
})

describe('Elements and nodes', function () {
    const elems = document.getElementsByTagName('*')

    test('Single item from nodelist detected as an element', () => {
        expect(kind(elems[0])).toBe('element')
    })

    test('getElementById result is an element', () => {
        expect(kind(document.createElement('div'))).toBe('element')
    })

    xtest('Result of getElementsByTagName is a nodelist', () => {
        expect(kind(elems)).toBe('nodelist')
    })

    test('document.body is an element', () => {
        expect(kind(document.body)).toBe('element')
    })
    test('document.documentElement is an element', () => {
        expect(kind(document.documentElement)).toBe('element')
    })
    test('Empty nodelist item detected as undefined', () => {
        expect(kind(document.getElementsByTagName('nonexistent')[0])).toBe('undefined')
    })
})

describe('Elements and nodes (deep)', function () {
    xtest('Comment is detected', () => {
        expect(kind(document.createElement('div').nextSibling, true)).toBe('comment')
    })

    xtest('document is a node', () => {
        expect(kind(document, true)).toBe('document')
    })
})

describe('Plain object', function () {
    test('Standard object declaration', () => {
        expect(kind({ foo: 'bar' })).toBe('object')
    })

    test('Standard object declaration (empty)', () => {
        expect(kind({})).toBe('object')
    })

    test('Object constructor', () => {
        expect(kind(new Object())).toBe('object')
    })

    test('Array not considered an object', () => {
        expect(kind([1, 2])).not.toBe('object')
    })

    const elems = document.getElementsByTagName('*')

    xtest('Nodelist not considered an object', () => {
        expect(kind(elems)).not.toBe('object')
    })

    test('Element not considered an object', () => {
        expect(kind(elems[0])).not.toBe('object')
    })

    xtest('Text node not considered an object', () => {
        expect(kind(document.createTextNode(''))).not.toBe('object')
    })
})
