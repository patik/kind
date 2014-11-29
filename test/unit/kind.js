/*global $:true, kind:true, module:true, test:true, ok:true, console:true */
$(function() {
    'use strict';

    module('kind');

    var testDiv = document.getElementById('comment-sibling');

    test('Standard types', function() {
        ok(kind('{}') === 'string', 'String');
        ok(kind('') === 'string', 'String (empty)');
        ok(kind() === 'undefined', 'Undefined');
        ok(kind(function(){}) === 'function', 'Anonymous function');
        ok(kind(kind) === 'function', 'Defined function');
        ok(kind(document.getElementById) === 'function', 'Method');
        ok(kind(false) === 'boolean', 'Boolean');
        ok(kind(!null) === 'boolean', 'Boolean (coerced)');
        ok(kind(1) === 'number', 'Number (integer)');
        ok(kind(1.21) === 'number', 'Number (float)');
    });

    test('Null', function() {
        ok(kind(null) === 'null', 'Literal null');
        ok(kind(document.getElementById('nonexistent')) === 'null', 'No element found with given ID');
    });

    test('Array', function() {
        ok(kind([1,2,3]) === 'array', 'Standard array properly detected');
        ok(kind([]) === 'array', 'Empty array properly detected');
        ok(kind(new Array(1)) === 'array', 'Array constructor detected');
        ok(kind(document.getElementsByTagName('div')) !== 'array', 'Nodelist not considered an array');
        ok(kind('str') !== 'array', 'String with `length` not considered an array');
    });

    test('Array-like objects', function() {
        ok(kind(arguments) === 'arraylike', 'Arguments');
        ok(kind([1,2,3]) !== 'arraylike', 'Standard array not considered arraylike');
        ok(kind(document.getElementsByTagName('div')) !== 'arraylike', 'Nodelist not considered arraylike');
    });

    test('Built-in special objects', function() {
        ok(kind(new Date()) === 'date', 'Date');
        ok(kind(/regular\sexpression/) === 'regexp', 'Regular expression (literal)');
        ok(kind(new RegExp('regular\\sexpression')) === 'regexp', 'Regular expression (constructor)');
        ok(kind(new Error('err')) === 'error', 'Error');
        ok(kind(Math) === 'math', 'Math');

        if (navigator.userAgent.indexOf('PhantomJS') === -1) {
            if (testDiv.addEventListener) {
                testDiv.addEventListener('click', function(evt) {
                    ok(kind(evt) === 'event', 'Event');
                }, false);

                testDiv.click();
            }
            else {
                testDiv.attachEvent('onclick', function(evt) {
                    ok(kind(evt) === 'event', 'Event');
                });

                testDiv.onclick();
            }
        }
    });

    test('Elements and nodes', function() {
        var elems = document.getElementsByTagName('*');

        ok(kind(elems[0]) === 'element', 'Single item from nodelist detected as an element');
        ok(kind(testDiv) === 'element', 'getElementById result is an element');

        // PhantomJS returns an incorrect value for this test, but it works correctly in browsers
        if (navigator.userAgent.indexOf('PhantomJS') !== -1) {
            // PhantomJS
            ok(kind(elems) === 'function', 'Result of getElementsByTagName is a nodelist');
        }
        else {
            // Browser
            ok(kind(elems) === 'nodelist', 'Result of getElementsByTagName is a nodelist');
        }

        ok(kind(document.body) === 'element', 'document.body is an element');
        ok(kind(document.documentElement) === 'element', 'document.documentElement is an element');
        ok(kind(document.getElementsByTagName('nonexistent')[0]) === 'undefined', 'Empty nodelist item detected as undefined');
    });

    test('Elements and nodes (deep)', function() {
        ok(kind(testDiv.nextSibling, true) === 'comment', 'Comment is detected');
        ok(kind(document, true) === 'document', 'document is a node');
    });

    test('Plain object', function() {
        var elems = document.getElementsByTagName('*');

        ok(kind({foo:'bar'}) === 'object', 'Standard object declaration');
        ok(kind({}) === 'object', 'Standard object declaration (empty)');
        ok(kind(new Object()) === 'object', 'Object constructor');
        ok(kind([1,2]) !== 'object', 'Array not considered an object');
        ok(kind(elems) !== 'object', 'Nodelist not considered an object');
        ok(kind(elems[0]) !== 'object', 'Element not considered an object');
        ok(kind(document.createTextNode('')) !== 'object', 'Text node not considered an object');
    });
});
