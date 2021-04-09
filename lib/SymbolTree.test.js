const SymbolTree = require('./SymbolTree');

function o(label) {
        // return an object that is unique in a deepEqual check

        return {
                label,
                unique: Symbol(),
        };
}

describe('Symbol tree', () => {
        let tree;
        let a;
        let aa;
        let aaa;
        let ab;
        let aba;
        let abaa;
        let ac;
        let b;
        let ba;
        beforeEach(() => {
                tree = new SymbolTree();
                a = o('a');
                aa = o('aa');
                aaa = o('aaa');
                ab = o('ab');
                aba = o('aba');
                abaa = o('abaa');
                ac = o('ac');
                b = o('b');
                ba = o('ba');

                tree.appendChild(a, aa);
                tree.appendChild(aa, aaa);
                tree.appendChild(a, ab);
                tree.appendChild(ab, aba);
                tree.appendChild(aba, abaa);
                tree.appendChild(a, ac);

                tree.insertAfter(a, b);
                tree.appendChild(b, ba);
        });

        it('generates unique id for each node', () => {
                const id = tree.getUniqueId(a);
                expect(id.length).toBe(36);
                expect(tree._node(a).id).toBe(id);
                expect(tree.getById(id)).toBe(a);
        });

        it('deletes all node reference to id and tree when removed', () => {
                const id = tree.getUniqueId(a);
                tree.remove(a);
                expect(tree.getById(id)).toBe(undefined);
                expect(a[tree.symbol]).toBe(undefined);
        });
        it('gets path for node with sibbling roots', () => {
                expect(tree.getPath(b)).toBe('$1');
                expect(tree.getPath(a)).toBe('$0');
                expect(tree.getPath(aa)).toBe('$0.0');
                expect(tree.getPath(aaa)).toBe('$0.0.0');
                expect(tree.getPath(ab)).toBe('$0.1');
                expect(tree.getPath(aba)).toBe('$0.1.0');
                expect(tree.getPath(abaa)).toBe('$0.1.0.0');
                expect(tree.getPath(ac)).toBe('$0.2');
                expect(tree.getPath(b)).toBe('$1');
                expect(tree.getPath(ba)).toBe('$1.0');
        });

        it('gets path for node with no sibbling roots', () => {
                tree = new SymbolTree();
                a = o('a');
                aa = o('aa');
                aaa = o('aaa');
                ab = o('ab');
                aba = o('aba');
                abaa = o('abaa');
                ac = o('ac');

                tree.appendChild(a, aa);
                tree.appendChild(aa, aaa);
                tree.appendChild(a, ab);
                tree.appendChild(ab, aba);
                tree.appendChild(aba, abaa);
                tree.appendChild(a, ac);

                expect(tree.getPath(a)).toBe('$0');
                expect(tree.getPath(aa)).toBe('$0.0');
                expect(tree.getPath(aaa)).toBe('$0.0.0');
                expect(tree.getPath(ab)).toBe('$0.1');
                expect(tree.getPath(aba)).toBe('$0.1.0');
                expect(tree.getPath(abaa)).toBe('$0.1.0.0');
                expect(tree.getPath(ac)).toBe('$0.2');
        });

        it('retieves node by path', () => {
                expect(tree.getByPath('$0.0')).toBe(aa);
                expect(tree.getByPath('$0')).toBe(a);
                expect(tree.getByPath('$0.0.0')).toBe(aaa);
                expect(tree.getByPath('$0.1')).toBe(ab);
                expect(tree.getByPath('$0.1.0')).toBe(aba);
                expect(tree.getByPath('$0.1.0.0')).toBe(abaa);
                expect(tree.getByPath('$0.2')).toBe(ac);
        });
});

describe('Init', () => {
        let tree;
        let node;
        beforeEach(() => {
                tree = new SymbolTree();
        });

        afterEach(() => {
                expect(node).toMatchObject({
                        root: true,
                });
                expect(tree.getByPath('$0.0.0')).toMatchObject({
                        name: 'a',
                });
                expect(tree.getByPath('$0.0.1')).toMatchObject({
                        name: 'b',
                });
                expect(tree.getByPath('$0.0.2')).toMatchObject({
                        name: 'c',
                });
                expect(tree.getByPath('$0.0.2.0')).toMatchObject({
                        name: 'd',
                });
        });

        it('add tree from json', () => {
                node = tree.appendChildrenRecursively({
                        children: [
                                {
                                        name: 'a',
                                },
                                {
                                        name: 'b',
                                },
                                {
                                        children: [
                                                {
                                                        name: 'd',
                                                },
                                        ],
                                        name: 'c',
                                },
                        ],
                        root: true,
                });
        });

        it('add tree from json with custom cchildren attribute', () => {
                node = tree.appendChildrenRecursively(
                        {
                                root: true,
                                transformations: [
                                        {
                                                name: 'a',
                                        },
                                        {
                                                name: 'b',
                                        },
                                        {
                                                name: 'c',
                                                transformations: [
                                                        {
                                                                name: 'd',
                                                        },
                                                ],
                                        },
                                ],
                        },
                        null,
                        {
                                childrenAttribute: 'transformations',
                        }
                );
        });

        it('generate json', () => {
                const opts = {
                        childrenAttribute: 'transformations',
                        getNode: (json) => {
                                json.id = tree.getPath(json);
                                return json;
                        },
                };

                node = tree.appendChildrenRecursively(
                        {
                                root: true,
                                transformations: [
                                        {
                                                name: 'a',
                                        },
                                        {
                                                name: 'b',
                                        },
                                        {
                                                name: 'c',
                                                transformations: [
                                                        {
                                                                name: 'd',
                                                        },
                                                ],
                                        },
                                ],
                        },
                        null,
                        opts
                );

                tree.appendChild(tree.getByPath('$0.0.0'), {
                        name: 'e',
                });

                const json = tree.toTreeObject(node, opts);
                expect(json).toEqual({
                        id: '$0.0',
                        root: true,
                        transformations: [
                                {
                                        id: '$0.0.0',
                                        name: 'a',
                                        transformations: [
                                                {
                                                        id: '$0.0.0.0',
                                                        name: 'e',
                                                        transformations: [],
                                                },
                                        ],
                                },
                                {
                                        id: '$0.0.1',
                                        name: 'b',
                                        transformations: [],
                                },
                                {
                                        id: '$0.0.2',
                                        name: 'c',
                                        transformations: [
                                                {
                                                        id: '$0.0.2.0',
                                                        name: 'd',
                                                        transformations: [],
                                                },
                                        ],
                                },
                        ],
                });
        });
});
