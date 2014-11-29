/*global $:true, kind:true, module:true, test:true, ok:true */
$(function() {
    'use strict';

    module('kind');

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

    test('Built-in special objects', function() {
        ok(kind(new Date()) === 'date', 'Date');
        ok(kind(/regular\sexpression/) === 'regexp', 'Regular expression (literal)');
        ok(kind(new RegExp('regular\\sexpression')) === 'regexp', 'Regular expression (constructor)');
        ok(kind(new Error('err')) === 'error', 'Error');
        ok(kind(Math) === 'math', 'Math');
    });

    test('Elements and nodes', function() {
        var testDiv = document.getElementById('comment-sibling'),
            elems = document.getElementsByTagName('*');

        console.log(kind(elems) === 'nodelist');

        ok(kind(elems[0]) === 'element', 'Single item from nodelist detected as an element');
        ok(kind(elems) === 'nodelist', 'getElementsByTagName\'s results are detected as a nodelist');
        ok(kind(testDiv) === 'element', 'Div detected as an element');
        ok(kind(testDiv.nextSibling) === 'node', 'Comment detected as a node');
        ok(kind(document.getElementsByTagName('nonexistent')[0]) === 'undefined', 'Empty nodelist item detected as undefined');
    });

    test('Plain object', function() {
        var divs = document.getElementsByTagName('div');

        ok(kind({}) === 'object', 'Standard empty object properly detected');
        ok(kind({foo:'bar'}) === 'object', 'Standard object properly detected');
        ok(kind([1,2]) !== 'object', 'Array not considered an object');
        ok(kind(new Object()) === 'object', 'Object constructor detected');
        ok(kind(divs) !== 'object', 'Nodelist not considered an object');
        ok(kind(divs[0]) !== 'object', 'Element not considered an array');
        ok(kind(document.createTextNode('')) !== 'object', 'Text node not considered an array');
    });
});
