
const SymbolTree = require('./SymbolTree');

function o(label) {
    // return an object that is unique in a deepEqual check

    return {
            label,
            unique: Symbol(),
    };
}

describe("Symbol tree", () => {
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
    beforeAll(() => {
        tree = new SymbolTree();
        a = o("a");
        aa = o("aa");
        aaa = o("aaa");
        ab = o("ab");
        aba = o("aba");
        abaa = o("abaa");
        ac = o("ac");
        b = o("b");
        ba = o("ba");

        tree.appendChild(a, aa);
        tree.appendChild(aa, aaa);
        tree.appendChild(a, ab);
        tree.appendChild(ab, aba);
        tree.appendChild(aba, abaa);
        tree.appendChild(a, ac);

        tree.insertAfter(a, b);
        tree.appendChild(b, ba);
    });

    it("gets path for node", () => {
        expect(tree.getPath(a)).toBe("0");
        expect(tree.getPath(aa)).toBe("0.0");
        expect(tree.getPath(aaa)).toBe("0.0.0");
        expect(tree.getPath(ab)).toBe("0.1");
        expect(tree.getPath(aba)).toBe("0.1.0");
        expect(tree.getPath(abaa)).toBe("0.1.0.0");
        expect(tree.getPath(ac)).toBe("0.2");
        expect(tree.getPath(b)).toBe("1");
        expect(tree.getPath(ba)).toBe("1.0");
    })

    it("retieves node by path", () => {
        tree.setRoot(a)
        expect(tree.getByPath("0.0")).toBe(aa);
        expect(tree.getByPath("0")).toBe(a);
        expect(tree.getByPath("0.0.0")).toBe(aaa);
        expect(tree.getByPath("0.1")).toBe(ab);
        expect(tree.getByPath("0.1.0")).toBe(aba);
        expect(tree.getByPath("0.1.0.0")).toBe(abaa);
        expect(tree.getByPath("0.2")).toBe(ac);

        expect(tree.getByPath("0", a)).toBe(aa);
        expect(tree.getByPath("0", b)).toBe(ba);
    })

})

describe("Init", () => {
    let tree;
    let node;
    beforeAll(() => {
        tree = new SymbolTree();;
    })

    afterAll(() => {
        expect(node).toMatchObject({
            root: true
        })
        expect(tree.getByPath("0", node)).toMatchObject({
            name: "a"
        })
        expect(tree.getByPath("1", node)).toMatchObject({
            name: "b"
        })
        expect(tree.getByPath("2", node)).toMatchObject({
            name: "c"
        })
        expect(tree.getByPath("2.0", node)).toMatchObject({
            name: "d"
        })
    })


    it("add tree from json", () => {
        node = tree.appendChildrenRecursively({
            root: true,
            children: [
                {
                    name: "a"
                },
                {
                    name: "b"
                },
                {
                    name: "c",
                    children: [
                        {
                            name: "d"
                        }
                    ]
                }
            ]
        })
    })

    it("add tree from json with custom cchildren attribute", () => {
        node = tree.appendChildrenRecursively({
            root: true,
            transformations: [
                {
                    name: "a"
                },
                {
                    name: "b"
                },
                {
                    name: "c",
                    transformations: [
                        {
                            name: "d"
                        }
                    ]
                }
            ]
        }, {
            childrenAttribute: "transformations"   
        })
    })

    it("generate json", () => {
        const opts = {
            childrenAttribute: "transformations"   
        }

        node = tree.appendChildrenRecursively({
            root: true,
            transformations: [
                {
                    name: "a"
                },
                {
                    name: "b"
                },
                {
                    name: "c",
                    transformations: [
                        {
                            name: "d"
                        }
                    ]
                }
            ]
        }, null, opts)

        tree.appendChild(tree.getByPath("0", node), {
            name: "e"   
        })

        const json = tree.toTreeObject(node, opts)
        expect(json).toEqual({
            "root": true,
            "transformations": [
              {
                "name": "a",
                "transformations": [
                  {
                    "name": "e",
                    "transformations": []
                  }
                ]
              },
              {
                "name": "b",
                "transformations": []
              },
              {
                "name": "c",
                "transformations": [
                  {
                    "name": "d",
                    "transformations": []
                  }
                ]
              }
            ]
          })
    })

})