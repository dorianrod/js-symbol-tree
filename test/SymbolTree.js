'use strict';

const SymbolTree = require('..');
const test = require('tape');

test('initialize', function(t) {
        const tree = new SymbolTree();
        const obj = {foo: 'bar'};

        t.equal(obj, tree.initialize(obj));
        t.deepEqual(['foo'], Object.getOwnPropertyNames(obj),
                'initialize() should not introduce any enumerable properties');

        t.end();
});

test('unassociated object', function(t) {
        const tree = new SymbolTree();
        const a = {};

        t.equal(true, tree.isEmpty(a));
        t.equal(null, tree.first  (a));
        t.equal(null, tree.last   (a));
        t.equal(null, tree.prev   (a));
        t.equal(null, tree.next   (a));
        t.equal(null, tree.parent (a));

        t.end();
});

test('insertBefore without parent or siblings', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};

        t.equal(a, tree.insertBefore(a, b));

        t.equal(true, tree.isEmpty(a));
        t.equal(null, tree.first  (a));
        t.equal(null, tree.last   (a));
        t.equal(null, tree.parent (a));
        t.equal(true, tree.isEmpty(b));
        t.equal(null, tree.first  (b));
        t.equal(null, tree.last   (b));
        t.equal(null, tree.parent (b));

        t.equal(null, tree.prev(a));
        t.equal(b   , tree.next(a));
        t.equal(a   , tree.prev(b));
        t.equal(null, tree.next(b));

        t.end();
});

test('insertAfter without parent or siblings', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};

        t.equal(b, tree.insertAfter(b, a));

        t.equal(true, tree.isEmpty(a));
        t.equal(null, tree.first  (a));
        t.equal(null, tree.last   (a));
        t.equal(null, tree.parent (a));
        t.equal(true, tree.isEmpty(b));
        t.equal(null, tree.first  (b));
        t.equal(null, tree.last   (b));
        t.equal(null, tree.parent (b));

        t.equal(null, tree.prev(a));
        t.equal(b   , tree.next(a));
        t.equal(a   , tree.prev(b));
        t.equal(null, tree.next(b));

        t.end();
});

test('insertFirst without children', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};

        t.equal(a, tree.insertFirst(a, parent));

        t.equal(true  , tree.isEmpty(a));
        t.equal(null  , tree.first  (a));
        t.equal(null  , tree.last   (a));
        t.equal(null  , tree.prev   (a));
        t.equal(null  , tree.next   (a));
        t.equal(parent, tree.parent (a));

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(a    , tree.last   (parent));
        t.equal(null , tree.prev   (a));
        t.equal(null , tree.next   (parent));
        t.equal(null , tree.parent (parent));

        t.end();
});

test('insertLast without children', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};

        t.equal(a, tree.insertLast(a, parent));

        t.equal(true  , tree.isEmpty(a));
        t.equal(null  , tree.first  (a));
        t.equal(null  , tree.last   (a));
        t.equal(null  , tree.prev   (a));
        t.equal(null  , tree.next   (a));
        t.equal(parent, tree.parent (a));

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(a    , tree.last   (parent));
        t.equal(null , tree.prev   (a));
        t.equal(null , tree.next   (parent));
        t.equal(null , tree.parent (parent));

        t.end();
});

test('insertFirst with children', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};
        const b = {};

        tree.insertFirst(b, parent);
        tree.insertFirst(a, parent);

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(b    , tree.last   (parent));

        t.equal(parent, tree.parent (a));
        t.equal(null  , tree.prev   (a));
        t.equal(b     , tree.next   (a));

        t.equal(parent, tree.parent (b));
        t.equal(a     , tree.prev   (b));
        t.equal(null  , tree.next   (b));
        t.end();
});

test('insertLast with children', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};
        const b = {};

        tree.insertLast(a, parent);
        tree.insertLast(b, parent);

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(b    , tree.last   (parent));

        t.equal(parent, tree.parent (a));
        t.equal(null  , tree.prev   (a));
        t.equal(b     , tree.next   (a));

        t.equal(parent, tree.parent (b));
        t.equal(a     , tree.prev   (b));
        t.equal(null  , tree.next   (b));
        t.end();
});

test('insertBefore with parent', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};
        const b = {};

        tree.insertFirst(b, parent);
        tree.insertBefore(a, b);

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(b    , tree.last   (parent));

        t.equal(parent, tree.parent (a));
        t.equal(null  , tree.prev   (a));
        t.equal(b     , tree.next   (a));

        t.equal(parent, tree.parent (b));
        t.equal(a     , tree.prev   (b));
        t.equal(null  , tree.next   (b));
        t.end();
});

test('insertAfter with parent', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};
        const b = {};

        tree.insertLast(a, parent);
        tree.insertAfter(b, a);

        t.equal(false, tree.isEmpty(parent));
        t.equal(a    , tree.first  (parent));
        t.equal(b    , tree.last   (parent));

        t.equal(parent, tree.parent (a));
        t.equal(null  , tree.prev   (a));
        t.equal(b     , tree.next   (a));

        t.equal(parent, tree.parent (b));
        t.equal(a     , tree.prev   (b));
        t.equal(null  , tree.next   (b));
        t.end();
});

test('insertBefore with siblings', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};
        const c = {};

        tree.insertBefore(a, c);
        tree.insertBefore(b, c);

        t.equal(null, tree.prev(a));
        t.equal(b   , tree.next(a));

        t.equal(a   , tree.prev(b));
        t.equal(c   , tree.next(b));

        t.equal(b   , tree.prev(c));
        t.equal(null, tree.next(c));

        t.end();
});

test('insertAfter with siblings', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};
        const c = {};

        tree.insertAfter(c, a);
        tree.insertAfter(b, a);

        t.equal(null, tree.prev(a));
        t.equal(b   , tree.next(a));

        t.equal(a   , tree.prev(b));
        t.equal(c   , tree.next(b));

        t.equal(b   , tree.prev(c));
        t.equal(null, tree.next(c));

        t.end();
});

test('remove with previous sibling', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};

        tree.insertAfter(b, a);
        tree.remove(b);

        t.equal(null, tree.prev   (a));
        t.equal(null, tree.next   (a));
        t.equal(null, tree.parent (a));

        t.equal(null, tree.prev   (b));
        t.equal(null, tree.next   (b));
        t.equal(null, tree.parent (b));

        t.end();
});

test('remove with next sibling', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};

        tree.insertAfter(b, a);
        tree.remove(a);

        t.equal(null, tree.prev   (a));
        t.equal(null, tree.next   (a));
        t.equal(null, tree.parent (a));

        t.equal(null, tree.prev   (b));
        t.equal(null, tree.next   (b));
        t.equal(null, tree.parent (b));

        t.end();
});

test('remove with siblings', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};
        const c = {};

        tree.insertAfter(b, a);
        tree.insertAfter(c, b);
        tree.remove(b);

        t.equal(null, tree.prev   (a));
        t.equal(c   , tree.next   (a));
        t.equal(null, tree.parent (a));

        t.equal(null, tree.prev   (b));
        t.equal(null, tree.next   (b));
        t.equal(null, tree.parent (b));

        t.equal(a   , tree.prev   (c));
        t.equal(null, tree.next   (c));
        t.equal(null, tree.parent (c));

        t.end();
});

test('remove with parent', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};

        tree.insertFirst(a, parent);
        tree.remove(a);

        t.equal(null, tree.parent(a));
        t.equal(null, tree.first(parent));
        t.equal(null, tree.last (parent));

        t.end();
});

test('remove with children', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};

        tree.insertFirst(a, parent);
        tree.remove(parent);

        t.equal(parent, tree.parent(a));
        t.equal(a, tree.first(parent));
        t.equal(a, tree.last (parent));

        t.end();
});

test('remove with parent and siblings', function(t) {
        const tree = new SymbolTree();
        const parent = {};
        const a = {};
        const b = {};
        const c = {};

        tree.insertFirst(a, parent);
        tree.insertAfter(b, a);
        tree.insertAfter(c, b);
        tree.remove(b);

        t.equal(a, tree.first(parent));
        t.equal(c, tree.last (parent));

        t.equal(null  , tree.prev   (a));
        t.equal(c     , tree.next   (a));
        t.equal(parent, tree.parent (a));

        t.equal(null  , tree.prev   (b));
        t.equal(null  , tree.next   (b));
        t.equal(null  , tree.parent (b));

        t.equal(a     , tree.prev   (c));
        t.equal(null  , tree.next   (c));
        t.equal(parent, tree.parent (c));

        t.end();
});

test('inserting an already associated object should fail', function(t) {
        const tree = new SymbolTree();
        const a = {};
        const b = {};

        tree.insertBefore(a, b);

        // jscs:disable requireBlocksOnNewline

        // `next` check
        t.throws(function() { tree.insertBefore(a, b); }, /already present/);
        t.throws(function() { tree.insertAfter (a, b); }, /already present/);
        t.throws(function() { tree.insertFirst (a, b); }, /already present/);
        t.throws(function() { tree.insertLast  (a, b); }, /already present/);

        // `prev` check
        t.throws(function() { tree.insertBefore(b, a); }, /already present/);
        t.throws(function() { tree.insertAfter (b, a); }, /already present/);
        t.throws(function() { tree.insertFirst (b, a); }, /already present/);
        t.throws(function() { tree.insertLast  (b, a); }, /already present/);

        tree.remove(a);

        tree.insertFirst(a, b);
        // `parent` check
        t.throws(function() { tree.insertBefore(a, b); }, /already present/);
        t.throws(function() { tree.insertAfter (a, b); }, /already present/);
        t.throws(function() { tree.insertFirst (a, b); }, /already present/);
        t.throws(function() { tree.insertLast  (a, b); }, /already present/);

        // jscs:enable requireBlocksOnNewline

        t.end();
});

test('Multiple SymbolTree instances should not conflict', function(t) {
        const tree1 = new SymbolTree();
        const tree2 = new SymbolTree();
        const a = {};
        const b = {};

        tree1.insertBefore(a, b);
        tree2.insertBefore(b, a);

        t.equal(null, tree1.prev(a));
        t.equal(b   , tree1.next(a));
        t.equal(a   , tree1.prev(b));
        t.equal(null, tree1.next(b));

        t.equal(null, tree2.prev(b));
        t.equal(a   , tree2.next(b));
        t.equal(b   , tree2.prev(a));
        t.equal(null, tree2.next(a));

        t.end();
});