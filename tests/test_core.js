describe("Core", function(){
    describe("Can be set up", function(){

        it("can be initialized without params", function(){
            var ij = new enioka.ij.Core();
            expect(ij instanceof enioka.ij.Core).toEqual(true);
        });

        it("can be assigned custom parameters", function(){
            var ij = new enioka.ij.Core();
            ij.set("customProperty",true);
            expect(ij.customProperty).toEqual(true);
        });

        it("can be assigned custom parameters at the init", function(){
            var ij = new enioka.ij.Core({
                customProperty:true
            });
            ij.set("customProperty",true);
            expect(ij.customProperty).toEqual(true);
        });
    });

    describe("Can get rendered objects", function(){
        var core,
            renderedObjects,
            type,
            renderedTree,
            rows = ["row1,row2","row1,row2,row4","row1","row2,row5"],
            columns = ["col1","col2","col2,col4","col5","col1,col5,col7"];

        beforeEach(function(){
            ij = new enioka.ij.Core({
                hideSummaries:true,
                renderer:new TestHTMLRenderer()
            });
            type = "rowHeaders";
        });

        it("Can renderRows", function(){
            var renderedRows = ij.getRenderedRows(rows);
            expect(renderedRows.length).toEqual(4);
        });

        it("Can renderColumns", function(){
            var renderedColumns = ij.getRenderedColumns(columns);
            expect(renderedColumns.length).toEqual(5);
        });
    });

    describe("Can work with rendered objects", function(){
        var core,
            renderedObjects,
            type,
            renderedTree,
            rows = ["row1,row2","row1,row2,row5","row1","row2,row4"],
            columns = ["col1","col2","col2,col4","col5","col1,col5,col7"],
            renderedRows,
            renderedColumns;

        beforeEach(function(){
            ij = new enioka.ij.Core({
                hideSummaries:true,
                renderer:new TestHTMLRenderer()
            });
            renderedRows = ij.getRenderedRows(rows);
            type = "rowHeaders";
        });

        it("Can build tree from renderedObjects", function() {
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            expect(renderedTree.length).toEqual(1);
            expect(renderedTree[0].children.length).toEqual(2);
            expect(renderedTree[0].children[1].children.length).toEqual(3);
        });

        it("Doesn't sort alphabetically without alphabeticalSort property", function() {
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            renderedTree = ij.orderRenderedTree(renderedTree);
            expect(renderedTree[0].children[1].children[1].label).toBe("row5");
        });

        it("Does sort with alphabeticalSort property", function() {
            ij.set("sortAlphabetically",true);
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            renderedTree = ij.orderRenderedTree(renderedTree);
            expect(renderedTree[0].children[1].children[1].label).toBe("row4");
        });

        it("Can order tree with a custom property", function() {
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            renderedTree = ij.orderRenderedTree(renderedTree, "orderByNumber");
            console.log(renderedTree);
            expect(renderedTree[0].children[1].children[1].label).toBe("row4");
        });

        it("Get tree depth", function() {
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            var depth = ij.getTreeDepth(renderedTree);
            expect(depth).toBe(3);
        });

        it("Get all children objects", function() {
            var childrenObjects = ij._getObjectsFromTree(renderedTree);
            expect(childrenObjects.length).toBe(4);
        });

        it("Get children objects grouped", function() {
            var children = ij.getObjectsGrouped(renderedTree);
            expect(children.length).toBe(4);
        });
    });
});
