describe("IIJ.Renderer.js", function() {
    var renderer = new enioka.ij.IIJRenderer(),
        objects = ["testLabel1",
                   "testLabel2",
                   "testLabel3",
                   "testLabel4",
                   "testLabel5"],
        renderedObjects = new Array();
    for (var i = 0; i < objects.length; i++){
        renderedObjects.push(renderer.renderRow(objects[i]));
    }
    it("renderRowObjects", function(){
        expect(renderedObjects.length).toBe(5);
    });
});

describe("IIJ.Core.js", function() {
        var core = new enioka.ij.Core(),
            renderedObjects = [
                [{
                    id:1,
                    label: "testLabel",
                    order: 0,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel";
                    },
                    open: false,
                    hidden: false
                },{
                    id:2,
                    label: "testLabel2",
                    object: "label2",
                    order: 4,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel2";
                    },
                    open: true,
                    hidden: false
                }],
                [{
                    id:1,
                    label: "testLabel",
                    order: 0,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel";
                    },
                    open: true,
                    hidden: false
                },{
                    id:3,
                    label: "testLabel3",
                    object: "label3",
                    order: 1,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel3";
                    },
                    open: false,
                    hidden: false
                }],
                [{
                    id:4,
                    label: "testLabel4",
                    order: 0,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel";
                    },
                    open: true,
                    hidden: false
                },{
                    id:5,
                    label: "testLabel5",
                    object: "label5",
                    order: 1,
                    rendering: function(){
                        var element = document.createElement("p");
                        return element.textContent = "testLabel5";
                    },
                    open: true,
                    hidden: false
                }]
            ],
            type = "rowHeader",
            renderedTree = null;
        core.hideSummaries = true;
    renderedTree = core.buildRenderedTree(renderedObjects, type);

    it("It builds tree from renderedObjects", function() {
        expect(renderedTree[0].children.length).toBe(2);
    });

    it("It orders tree", function() {
        core.orderRenderedTree(renderedTree);
        expect(renderedTree[0].children[0].label).toBe("testLabel3");
    });

    it("Get tree depth", function() {
        var depth = core.getTreeDepth(renderedTree);
        expect(depth).toBe(2);
    });

    it("Get all children objects", function() {
        var children = core._getObjectsFromTree(renderedTree);
        expect(children.length).toBe(3);
    });

    it("Get children objects by closed group", function() {
        var children = core.getObjectsGrouped(renderedTree);
        expect(children.length).toBe(2);
        expect(children[0].length).toBe(2);
        expect(children[1].length).toBe(1);
    });
});
