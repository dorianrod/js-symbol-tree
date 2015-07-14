'use strict';

const SymbolTreeNode = require('./SymbolTreeNode');

/**
 * @module symbol-tree
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

/**
 * @param [description='SymbolTree data'] Description used for the Symbol
 * @constructor
 * @alias module:symbol-tree
 */
module.exports = class SymbolTree {
        constructor(description) {
                this.symbol = Symbol(description || 'SymbolTree data');
        }

        /**
         * You can optionally initialize an object after its creation,
         * to take advantage of V8's fast properties
         * @param {Object} object
         * @return {Object} object
         */
        initialize(object) {
                this._node(object);

                return object;
        }

        _node(object) {
                if (!object) {
                        return null;
                }

                const node = object[this.symbol];

                if (node) {
                        return node;
                }

                return (object[this.symbol] = new SymbolTreeNode());
        }

        /**
         * Returns true if the object has any children.
         * `O(1)`
         * @param {Object} object
         * @return {Boolean}
         */
        isEmpty(object) {
                return this._node(object).isEmpty;
        }

        /**
         * Return the first child of the given object.
         * `O(1)`
         * @param {Object} object
         * @return {Object}
         */
        first(object) {
                return this._node(object).first;
        }

        /**
         * Return the last child of the given object.
         * `O(1)`
         * @param {Object} object
         * @return {Object}
         */
        last(object) {
                return this._node(object).last;
        }

        /**
         * Return the previous sibling of the given object.
         * `O(1)`
         * @param {Object} object
         * @return {Object}
         */
        prev(object) {
                return this._node(object).prev;
        }

        /**
         * Return the next sibling of the given object.
         * `O(1)`
         * @param {Object} object
         * @return {Object}
         */
        next(object) {
                return this._node(object).next;
        }

        /**
         * Return the parent of the given object.
         * `O(1)`
         * @param {Object} object
         * @return {Object}
         */
        parent(object) {
                return this._node(object).parent;
        }

        /**
         * Remove the object from this tree.
         * `O(1)`
         * Has no effect if already removed.
         * @param {Object} removeObject
         * @return {Object} removeObject
         */
        remove(removeObject) {
                const removeNode = this._node(removeObject);
                const parentNode = this._node(removeNode.parent);
                const prevNode = this._node(removeNode.prev);
                const nextNode = this._node(removeNode.next);

                if (parentNode) {
                        if (parentNode.first === removeObject) {
                                parentNode.first = removeNode.next;
                        }

                        if (parentNode.last === removeObject) {
                                parentNode.last = removeNode.prev;
                        }
                }

                if (prevNode) {
                        prevNode.next = removeNode.next;
                }

                if (nextNode) {
                        nextNode.prev = removeNode.prev;
                }

                removeNode.parent = null;
                removeNode.prev = null;
                removeNode.next = null;

                return removeObject;
        }

        /**
         * Insert the given object before the reference object.
         * `O(1)`
         * `newObject` is now the previous sibling of `referenceObject`
         *
         * @param {Object} newObject
         * @param {Object} referenceObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertBefore(newObject, referenceObject) {
                const referenceNode = this._node(referenceObject);
                const prevNode = this._node(referenceNode.prev);
                const newNode = this._node(newObject);
                const parentNode = this._node(referenceNode.parent);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                newNode.parent = referenceNode.parent;
                newNode.prev = referenceNode.prev;
                newNode.next = referenceObject;
                referenceNode.prev = newObject;

                if (prevNode) {
                        prevNode.next = newObject;
                }

                if (parentNode && parentNode.first === referenceObject) {
                        parentNode.first = newObject;
                }

                return newObject;
        }

        /**
         * Insert the given object after the reference object.
         * `O(1)`
         * `newObject` is now the next sibling of `referenceObject`
         *
         * @param {Object} newObject
         * @param {Object} referenceObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertAfter(newObject, referenceObject) {
                const referenceNode = this._node(referenceObject);
                const nextNode = this._node(referenceNode.next);
                const newNode = this._node(newObject);
                const parentNode = this._node(referenceNode.parent);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                newNode.parent = referenceNode.parent;
                newNode.prev = referenceObject;
                newNode.next = referenceNode.next;
                referenceNode.next = newObject;

                if (nextNode) {
                        nextNode.prev = newObject;
                }

                if (parentNode && parentNode.last === referenceObject) {
                        parentNode.last = newObject;
                }

                return newObject;
        }

        /**
         * Insert the given object as the first child of the given reference object.
         * `O(1)`
         * `newObject` is now the first child of `referenceObject`
         *
         * @param {Object} newObject
         * @param {Object} referenceObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertFirst(newObject, referenceObject) {
                const referenceNode = this._node(referenceObject);
                const newNode = this._node(newObject);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                if (referenceNode.isEmpty) {
                        newNode.parent = referenceObject;
                        referenceNode.first = newObject;
                        referenceNode.last = newObject;
                }
                else {
                        this.insertBefore(newObject, referenceNode.first);
                }

                return newObject;
        }

        /**
         * Insert the given object as the last child of the given reference object.
         * `O(1)`
         * `newObject` is now the last child of `referenceObject`
         *
         * @param {Object} newObject
         * @param {Object} referenceObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertLast(newObject, referenceObject) {
                const referenceNode = this._node(referenceObject);
                const newNode = this._node(newObject);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                if (referenceNode.isEmpty) {
                        newNode.parent = referenceObject;
                        referenceNode.first = newObject;
                        referenceNode.last = newObject;
                }
                else {
                        this.insertAfter(newObject, referenceNode.last);
                }

                return newObject;
        }
};