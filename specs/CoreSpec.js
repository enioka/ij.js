describe("Core", function(){
    describe("Can be set up", function(){
        var ij;

        beforeEach(function(){
            ij = new enioka.ij.Core();
        });

        it("can be initialized without params", function(){
            expect(ij instanceof enioka.ij.Core).toEqual(true);
        });

        it("can be assigned custom parameters", function(){
            ij.set("customProperty",true);
            expect(ij.customProperty).toEqual(true);
        });

        it("can be assigned custom parameters at the initialize", function(){
            var ij = new enioka.ij.Core({
                customProperty:true
            });
            expect(ij.get("customProperty")).toEqual(true);
        });

        it("can be init with parameters", function(){
            ij.init({
                test : "value"
            });
            expect(ij.get("test")).toEqual("value");
        });

        it("can set a workspace by default", function(){
            ij.setWorkspace();
            expect(ij.getWorkspace()).toBe(document.body);
        });

        it("can set a workspace (should be in the renderer)", function(){
            ij.setWorkspace("");
            expect(ij.getWorkspace()).toBe("");
        });

        it("can set a dataprovider by default", function(){
            ij.setDataProvider();
            expect(ij.dataprovider instanceof enioka.ij.IIJDataProvider).toBe(true);
        });

        it("can set a dataprovider", function(){
            ij.setDataProvider(new enioka.ij.IIJDataProvider());
            expect(ij.dataprovider instanceof enioka.ij.IIJDataProvider).toBe(true);
        });

        it("can set a renderer by default", function(){
            ij.setRenderer();
            expect(ij.renderer instanceof enioka.ij.IIJRenderer).toBe(true);
        });

        it("can set a renderer", function(){
            ij.setRenderer(new enioka.ij.IIJRenderer());
            expect(ij.renderer instanceof enioka.ij.IIJRenderer).toBe(true);
        });

        it("can set a controller by default", function(){
            ij.setController();
            expect(ij.controller instanceof enioka.ij.IIJController).toBe(true);
        });

        it("can set a controller", function(){
            ij.setController(new enioka.ij.IIJController());
            expect(ij.controller instanceof enioka.ij.IIJController).toBe(true);
        });

        it("can check mandatory components", function(){
            ij.setController();
            ij.setRenderer();
            ij.setDataProvider();
            ij.setWorkspace(document.body);
            expect(ij._checkDependencies()).toBe(true);
        });

        describe("can fin missing components", function(){
            beforeEach(function(){
                ij = new enioka.ij.Core();
            });

            it("dataprovider", function(){
                ij.setController();
                ij.setRenderer();
                ij.setWorkspace(document.body);
                expect(ij._checkDependencies()).toBe(false);
            });
            it("renderer", function(){
                ij.setController();
                ij.setDataProvider();
                ij.setWorkspace(document.body);
                expect(ij._checkDependencies()).toBe(false);
            });
            it("controller", function(){
                ij.setDataProvider();
                ij.setRenderer();
                ij.setWorkspace(document.body);
                expect(ij._checkDependencies()).toBe(false);
            });
            it("workspace", function(){
                ij.setController();
                ij.setRenderer();
                ij.setDataProvider();
                expect(ij._checkDependencies()).toBe(false);
            });
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

        it("Can control whether it has row to render and log it to the user", function(){
            var renderedRows = ij.getRenderedRows();
            expect(renderedRows.length).toEqual(0);
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
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            type = "rowHeaders";
        });

        it("Can build tree from renderedObjects", function() {
            expect(renderedTree.length).toEqual(1);
            expect(renderedTree[0].children.length).toEqual(2);
            expect(renderedTree[0].children[1].children.length).toEqual(3);
        });

        it("Doesn't sort alphabetically without alphabeticalSort property", function() {
            renderedTree = ij.orderRenderedTree(renderedTree);
            expect(renderedTree[0].children[1].children[1].label).toBe("row5");
        });

        it("Does sort with alphabeticalSort property", function() {
            ij.set("sortAlphabetically",true);
            renderedTree = ij.orderRenderedTree(renderedTree);
            expect(renderedTree[0].children[1].children[1].label).toBe("row4");
        });

        it("Can order tree with a custom property", function() {
            renderedTree = ij.orderRenderedTree(renderedTree, "orderByNumber");
            expect(renderedTree[0].children[1].children[1].label).toBe("row4");
        });

        it("Get tree depth", function() {
            var depth = ij.getTreeDepth(renderedTree);
            expect(depth).toBe(3);
        });

        it("Apply tree depth", function(){
            var depth = ij.getTreeDepth(renderedTree);
            var renderedObjectTree = ij.applyTreeDepth(renderedTree, depth);

            expect(renderedObjectTree[0].children[0].depth).toEqual(2);
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

    describe("Can work with summaries", function(){
        var core,
            renderedObjects,
            type,
            renderedTree,
            rows = ["row1,row2","row1,row2,row4","row1","row2,row5"],
            columns = ["col1","col2","col2,col4","col5","col1,col5,col7"];

        beforeEach(function(){
            ij = new enioka.ij.Core({
                hideSummaries:false,
                renderer:new TestHTMLRenderer()
            });
            renderedRows = ij.getRenderedRows(rows);
            renderedTree = ij.buildRenderedTree(renderedRows, type);
            type = "rowHeaders";
        });

        it("Can build a tree with summaries", function(){
            expect(renderedTree[0].children.length).toBe(3);
        });

        it("Can populate those summaries", function(){
            ij.populateSummaries(renderedTree);
            expect(renderedTree[0].children[1].object.length).toEqual(4);
        });
    });

    describe("Has its own utils", function(){
        var ij;

        beforeEach(function(){
            ij = new enioka.ij.Core({
                sortAlphabetically:true
            });
        });

        it("Sorts array alphabeticaly", function(){
            var array = [{label : "c"},
                         {label : "b"},
                         {label : "b"},
                         {label : "e"},
                         {label : "c"},
                         {label : "a"},
                         {label : "d"}];
            array = ij.alphabeticalSort(array);
            expect(array).toEqual([{label : "a"},
                                   {label : "b"},
                                   {label : "b"},
                                   {label : "c"},
                                   {label : "c"},
                                   {label : "d"},
                                   {label : "e"}]);
        });
    });
});
