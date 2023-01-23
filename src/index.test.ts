import kind from '.'

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
        expect(kind(undefined)).toBe('undefined')
        expect(kind(undefined, true)).toBe('undefined')
    })

    test('Anonymous function', () => {
        expect(kind(function () {})).toBe('function')
        expect(kind(function () {}, true)).toBe('function')
    })

    test('Arrow function', () => {
        expect(kind(() => {})).toBe('function')
        expect(kind(() => {}, true)).toBe('function')
    })

    test('Defined function', () => {
        expect(kind(kind)).toBe('function')
        expect(kind(kind, true)).toBe('function')
    })

    test('DOM method', () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(kind(document.getElementById)).toBe('function')
    })

    test('Boolean', () => {
        expect(kind(false)).toBe('boolean')
        expect(kind(false, true)).toBe('boolean')
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
        expect(kind(null, true)).toBe('null')
    })

    test('Undefined', () => {
        expect(kind(undefined)).toBe('undefined')
        expect(kind(undefined, true)).toBe('undefined')
    })
})

describe('Null', function () {
    test('Literal null', () => {
        expect(kind(null)).toBe('null')
        expect(kind(null, true)).toBe('null')
    })

    test('No element found with given ID', () => {
        expect(kind(document.getElementById('nonexistent'))).toBe('null')
        expect(kind(document.getElementById('nonexistent'), true)).toBe('null')
    })
})

describe('Arrays', function () {
    test('Standard array is properly detected', () => {
        expect(kind([1, 2, 3])).toBe('array')
        expect(kind([1, 2, 3], true)).toBe('array')
    })

    test('Empty array is properly detected', () => {
        expect(kind([])).toBe('array')
        expect(kind([], true)).toBe('array')
    })

    test('Array created by the constructor is detected', () => {
        expect(kind(new Array(1))).toBe('array')
        expect(kind(new Array(1), true)).toBe('array')
    })

    test('Nodelist is not considered an array', () => {
        expect(kind(document.getElementsByTagName('div'))).not.toBe('array')
        expect(kind(document.getElementsByTagName('div'), true)).not.toBe('array')
    })

    test('String with `length` is not considered an array', () => {
        expect(kind('str')).not.toBe('array')
        expect(kind('str', true)).not.toBe('array')
    })
})

describe('Array-like objects', function () {
    test('Arguments', () => {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments

        expect(kind(args)).toBe('arraylike')
        expect(kind(args, true)).toBe('arraylike')
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
        expect(kind(new Date(), true)).toBe('date')
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
