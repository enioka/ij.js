var enioka = (enioka || {});

/**
 * @namespace enioka
 */

/**
 * @namespace ij
 * @memberof enioka
 */

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij
         * @classdesc Core module for the matrix library. This is the central node for all
         * components. This is from this component that the matrix is displayed. It will
         * ensure good working with each dependency. It holds, dataprovider, html renderer,
         * and controller. Moreover, it contains two data handler which will ensure good
         * understanding over data (for rows and columns).
         * <br/>
         * <br/>
         * To ensure good working, you have to user either our components, or yours. You can
         * check in our documentations about APIs for each component.
         * <br/>
         * <br/>
         * This will also contain cache for data in a relativly near future
         * @param {object} properties
         */
        var Core = {
            initialize : function(properties){
                if (!properties){
                    this.setController(new eniokaij.IIJController());
                    this.setRenderer(new eniokaij.IIJRenderer());
                    this.setDataProvider(new eniokaij.IIJDataProvider());
                    return;
                } else {
                    for (var prop in properties){
                        this[prop] = properties[prop];
                    }
                }
            },

            params : {},
            /**
             * @memberof enioka.ij.Core
             * @member {interface} dataProvider
             */
            dataProvider : null,
            /**
             * @memberof enioka.ij.Core
             * @member {interface} controller
             */
            controller : null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} controller
             */
            renderer : null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} cache
             */
            cache : null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} workspace
             */
            workspace : null,

            cellsMap : [],

            /**
             * @function
             * @description
             * @param {object}
             */
            init : function(params){
                for (var attr in params){
                    this.params[attr] = params[attr];
                }
            },
            /**
             * @function
             * @description Set the workspace where the matrix will be displayed.
             * @param workspace javascript object of the workspace.
             * @return this object itself to allow chaining methods.
             */
            setWorkspace : function(workspace){
                if (workspace)
                    this.workspace = workspace;
                else
                    workspace = document.body;
                return this;
            },

            /**
             * @function
             * @description Get the workspace where the matrix will be displayed.
             * @return workspace where the matrix will be displayed
             */
            getWorkspace : function(){
                return this.workspace;
            },

            /**
             * @function
             * @param dataProvider data provider object that should contain generics methods
             * to gather data necessary to display elements.
             * @return dataProvider implementer.
             */
            setDataProvider : function(dataProvider){
                if (dataProvider)
                    this.dataProvider = dataProvider;
                else
                    this.dataProvider = new eniokaij.IIJDataProvider(this);
                return this.dataProvider;
            },

            /**
             * @function
             * @param controller data provider object that should contain generics methods
             * to call Core API.
             * @return controller implemented.
             */
            setController : function(controller){
                if (controller)
                    this.controller = controller;
                else
                    this.controller = new eniokaij.IIJController(this);
                return this.controller;
            },

            /**
             * @function
             * @param renderer data provider object that should contain generics methods
             * to render objects.
             * @return renderer implemented.
             */
            setRenderer : function(renderer){
                if (renderer)
                    this.renderer = renderer;
                else
                    this.renderer = new eniokaij.IIJRenderer(this);
                return this;
            },

            /**
             * @function
             * @description Check for dependencies :
             * DataProvider, Controller or Renderer
             * @return {boolean} true or false if dependencies are wheter or not set
             */
            _checkDependencies : function() {
                console.log("Something is missing : ");
                console.log("Checking DataProvider : ", this.dataProvider);
                console.log("Checking controller : ", this.controller);
                console.log("Checking DataProvider : ", this.renderer);
                console.log("Checking Workspace : ", this.workspace);
                console.log("Checking DataHandler : ", this.dataHandler);
                if (!this.renderer ||
                    !this.dataProvider ||
                    !this.dataHandler ||
                    !this.controller ||
                    !this.workspace) {
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * @function
             * @description
             */
            getRenderedRows : function(rows){
                var rowsArray = new Array();
                if (rows)
                for (var i = 0; i < rows.length; i++)
                    rowsArray.push(this.renderer.renderRow(rows[i]));
                return rowsArray;
            },

            /**
             * @function
             * @description
             */
            getRenderedColumns : function(columns){
                var colmunsArray = new Array();
                if (columns)
                    for (var i = 0; i < columns.length; i++)
                        colmunsArray.push(this.renderer.renderColumn(columns[i]));
                return colmunsArray;
            },

            /**
             * @function
             * @description
             */
            buildRenderedTree : function(renderedObjects){
                var start = new Date();
                //create root array & map table
                var _scope = {};
                var map = new Array(),
                    idMap = new Array();
                _scope.root = new Array();
	        for (var i = 0; i < renderedObjects.length; i++){
                    //set the parrent root at the initial array (level 0)
                    var childMap = new Array(),
                        parentRoot = _scope.root,
                        currentID = new String();
    	            for (var j = 0; j < renderedObjects[i].length; j++){
                        currentID += renderedObjects[i][j].id;
                        if (!idMap[renderedObjects[i][j].id])
                            idMap[renderedObjects[i][j].id] = currentID;
                        else
                            currentID = idMap[renderedObjects[i][j].id];
                        //if object is not mapped
        	        if (!map[currentID]){
                            if (!parentRoot instanceof Array)
                                parentRoot = new Array();
                            //add object to the currentRoot
                            parentRoot.push(renderedObjects[i][j]);
                            //if current renderedObject has children, then create them
                            if (renderedObjects[i].length - 1 > j) {
                                renderedObjects[i][j].children = new Array();
                                //check if there is property to hide summaries
                                if (!this.hideSummaries)
                                    renderedObjects[i][j].children.push(
                                        this.renderer.renderSummary(
                                            renderedObjects[i][j]
                                        )
                                    );
                                if (renderedObjects[i][j].object){
                                    renderedObjects[i][j].children.push(
                                        this._cloneHeader(renderedObjects[i][j])
                                    );
                                    delete renderedObjects[i][j].object;
                                }
                            }
            	            map[currentID] = renderedObjects[i][j];
                        } else {
                            if (j > 0){
                                var found = false;
                                for(var k = 0; k < parentRoot.length; k++) {
                                    if (parentRoot[k].id == renderedObjects[i][j].id) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (found != true){
                                    var id = renderedObjects[i][j].id;
                                    var tmpRoot = map[currentID];
                                    this._deleteNode(id, _scope.root);
                                    parentRoot.push(tmpRoot);
                                    delete map[currentID];
                                    map[currentID] = tmpRoot;
                                }
                            }
                            if (renderedObjects[i].length - 1 > j){
                                if (!map[currentID].children) {
                                    map[currentID].children = new Array();
                                    if (map[currentID].object){
                                        map[currentID].children.push(
                                            this._cloneHeader(renderedObjects[i][j])
                                        );
                                        map[currentID].children[0].object = map[currentID].object;
                                        delete map[currentID].object;
                                    }
                                }
                            }
                        }
            	        parentRoot = map[currentID].children;
                    }
                }
                this.idMap = idMap;
                return _scope.root;
            },

            _deleteNode : function(nodeId, node){
                for (var id in node){
                    if (node[id].id == nodeId)
                        delete node[id];
                    else if (node[id].children)
                        this._deleteNode(nodeId, node[id].children);
                }
            },

            _cloneHeader : function(header, children, label){
                var duplicatedHeader = {};
                for (var attr in header){
                    if (attr == "label" && !label)
                        duplicatedHeader[attr] = "";
                    else if (attr == "children" && !children)
                        continue;
                    else
                        duplicatedHeader[attr] = header[attr];
                };
                return duplicatedHeader;
            },

            /**
             * @function
             * @description sort tree by order property
             * @return tree sorted by order property
             */
            orderRenderedTree : function(renderedTree){
                var start = new Date();
                var ordered = new Array(),
                    root = new Array();
                for (var id in renderedTree){
                    if (!ordered[renderedTree[id].order])
                        ordered[renderedTree[id].order] = new Array();
                    ordered[renderedTree[id].order].push(renderedTree[id]);
                    if (renderedTree[id].children)
                        renderedTree[id].children =
                        this.orderRenderedTree(renderedTree[id].children);
                }
                for (var i in ordered){
                    root = root.concat(this.alphabeticalSort(ordered[i]));
                }
                return root;
            },

            /**
             * @function
             * @description alphabetical sort
             * @return array sorter aphabetically on label object property
             */
            alphabeticalSort : function(array){
                return array.sort(
                    function compare(a,b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        return 0;
                    }
                );
            },

            /**
             * @function
             * @description
             * @param
             * @return
             */
            getTreeDepth : function(renderedObjectTree){
                var depth = 0;
                for (var id in renderedObjectTree){
                    if (renderedObjectTree[id].children) {
                        var childrenDepth = this.getTreeDepth(renderedObjectTree[id].children);
                        renderedObjectTree[id].group = true;
                        if (childrenDepth > depth)
                            depth = childrenDepth;
                    }
                }
                return depth + 1;
            },

            applyTreeDepth : function(renderedObjectTree, depth){
                var start = new Date();
                for (var id in renderedObjectTree){
                    if(renderedObjectTree[id].children){
                        renderedObjectTree[id].depth = 1;
                        renderedObjectTree[id].children =
                            this.applyTreeDepth(renderedObjectTree[id].children, depth - 1);
                    } else {
                        renderedObjectTree[id].depth = depth;
                    }
                }
                return renderedObjectTree;
            },

            /**
             * @function
             * @description Build columns rendering necessary components
             */
            _preRenderColumns : function(){
                console.profile("_preRenderColumns");
                var columns = this.dataprovider.getColumns();
                this.columns = columns;
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var renderedColumns = this.getRenderedColumns(
                            columns
                );
                var renderedColumns =
                    this.buildRenderedTree(
                        renderedColumns
                    );
                renderedColumns = this.orderRenderedTree(renderedColumns);
                for (var id in renderedColumns){
                    renderedColumns[id] =
                        this.getGroupSpan(renderedColumns[id]).renderedTreeNode;
                }
                var columnsDepth = this.getTreeDepth(renderedColumns);
                this.applyTreeDepth(renderedColumns,
                                    columnsDepth);
                this.applyOnRenderedObjects(renderedColumns,
                                            (this.renderer.applyColSpan)
                                            .bind(this.renderer),
                                            "span");
                this.applyOnRenderedObjects(renderedColumns,
                                            (this.renderer.applyRowSpan)
                                            .bind(this.renderer),
                                            "depth");

                this.applyClasses(renderedColumns,
                                  (this.renderer.addClasses)
                                  .bind(this.renderer),
                                  "columnHeader");
                console.profileEnd();
                return {
                    "depth" : columnsDepth,
                    "rendering" : renderedColumns,
                    "objects" : this._getObjectsFromTree(renderedColumns)
                };
            },

            displayColumns : function(columns, rowsDepth){
                var columnsContainer = this.renderer.renderColumnsContainer();
                var columnsLevels = this.buildColumns(columns.rendering);

                // left upper corner creater to let space for rows headers
                var leftUpperCorner = {
                    "rendering" : this.renderer.renderLeftUpperCorner(),
                    "colspan" : (rowsDepth || 1),
                    "rowspan" : (columns.depth || 1)
                };
                leftUpperCorner =
                    this.renderer.applyColSpan(leftUpperCorner,
                                               "colspan");
                leftUpperCorner =
                    this.renderer.applyRowSpan(leftUpperCorner,
                                               "rowspan");
                //Add it before every other columns
                if (columns.rendering.length > 0)
                    columnsLevels[1].unshift(leftUpperCorner.rendering);
                for (var lvl in columnsLevels){
                    var level = this.renderer.renderColumnsLevelContainer();
                    for (var col in columnsLevels[lvl]){
                        this._appendChild(level,
                                          columnsLevels[lvl][col]
                                         );
                    }
                    this._appendChild(
                        columnsContainer,
                        level);
                }
                this._appendChild(this.container, columnsContainer);
            },

            /**
             * @function
             * @description
             * @param
             * @return
             */
            buildColumns : function(renderedColumns, level){
                level = typeof level !== 'undefined' ? level : 1;
                var columnsLevel = new Array();
                columnsLevel[level] = new Array();
                for (var id in renderedColumns){
                    columnsLevel[level].push(renderedColumns[id].rendering);
                    if (renderedColumns[id].children){
                        var childrenArray =
                            this.buildColumns(renderedColumns[id].children, level + 1);
                        for (var lvl in childrenArray){
                            if (!columnsLevel[lvl])
                                columnsLevel[lvl] = new Array();
                            for (var val in childrenArray[lvl]){
                                columnsLevel[lvl].push(
                                    childrenArray[lvl][val]
                                );
                            }
                        }
                    }
                }
                return columnsLevel;
            },

            _getObjectsFromTree : function(renderedObjectsTree){
                var objects = new Array();
                for (var id in renderedObjectsTree){
                    if (renderedObjectsTree[id].object)
                        objects.push(renderedObjectsTree[id].object);
                    if (renderedObjectsTree[id].children)
                        objects = objects.concat(this._getObjectsFromTree(
                            renderedObjectsTree[id].children));
                }
                return objects;
            },

            /**
             * @function
             * @description Display rows
             */
            _preRenderRows : function(){
                console.profile("rows");
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var renderedRows =
                    this.buildRenderedTree(
                        this.getRenderedRows(
                            this.dataprovider.getRows()
                        )
                    );
                renderedRows = this.orderRenderedTree(renderedRows);
                for (var id in renderedRows){
                    renderedRows[id] = this.getGroupSpan(renderedRows[id], 1).renderedTreeNode;
                }
                rowsDepth = this.getTreeDepth(renderedRows);
                this.applyTreeDepth(renderedRows,
                                                   rowsDepth);
                this.applyOnRenderedObjects(renderedRows,
                                                           (this.renderer.applyRowSpan)
                                                           .bind(this.renderer),
                                                           "span");
                this.applyOnRenderedObjects(renderedRows,
                                                           (this.renderer.applyColSpan)
                                                           .bind(this.renderer),
                                                           "depth");
                this.applyClasses(renderedRows,
                                                 (this.renderer.addClasses)
                                                 .bind(this.renderer),
                                                 "rowHeader");
                console.profileEnd();
                return {
                    "depth" : rowsDepth,
                    "rendering" : renderedRows,
                    "objects" : this._getObjectsFromTree(renderedRows)
                };
            },

            displayData : function(rows, columnsCount){
                var rowsContainer = this.renderer.renderRowsContainer();
                var rows = this.buildRows(rows.rendering, columnsCount).rows;
                for (var row in rows){
                    this._appendChild(rowsContainer, rows[row]);
                }
                this._appendChild(this.container, rowsContainer);
            },

            /**
             * @function
             * @description apply a specific callback on all renderedObjects (including children)
             * @param
             * @param
             * @return
             */
            applyOnRenderedObjects : function(renderedObjects, callback, params){
                for (var id in renderedObjects){
                    renderedObjects[id] = callback(renderedObjects[id], params);
                    if (renderedObjects[id].children)
                        renderedObjects[id].children =
                        this.applyOnRenderedObjects(renderedObjects[id].children, callback, params);
                }
                return renderedObjects;
            },

            applyClasses : function(renderedObjects, callback, elementType, currentId){
                if (!currentId)
                    var currentId = 0;
                for (var id in renderedObjects){
                    var classes = new Array();
                    if (renderedObjects[id].children)
                        this.applyClasses(renderedObjects[id].children,
                                          callback,
                                          elementType,
                                          currentId);
                    if(elementType == "rowHeader" && renderedObjects[id].children) {
                        var nextId = currentId + this._getObjectsFromTree(renderedObjects[id].children).length;
                        for (var i = currentId; i < nextId; i++){
                            classes.push(i);
                        }
                        currentId = nextId;
                    }
                    else {
                        var nextId = currentId + renderedObjects[id].span;
                        for (var i = currentId; i < nextId; i++){
                            classes.push(i);
                        }
                        currentId = nextId;
                    }
                    renderedObjects[id].rendering = callback(renderedObjects[id].rendering,
                                                             elementType,
                                                             classes);
                }
                return renderedObjects;
            },

            /**
             * @function
             * @description build rows array, each cell contains a row header
             * @param {object} rowsTreeNode - A node from Rows tree
             * @return
             */
            buildRows : function(rowsTreeNode, columnsCount, rowNumber){
                console.log(columnsCount);
                if (!rowNumber)
                    var rowNumber = 0;
                var rows = new Array();
                if (rowsTreeNode.length > 0)
                    for (var id in rowsTreeNode){
                        var row = this.renderer.renderRowContainer();
                        this._appendChild(row, rowsTreeNode[id].rendering);
                        if (rowsTreeNode[id].object){
                            var rowData = this._renderRowData(columnsCount,
                                                              rowNumber);
                            this._appendChildren(row, rowData);
                            rowNumber++;
                        }
                        rows.push(row);
                        if (rowsTreeNode[id].children){
                            var builtRows = this.buildRows(rowsTreeNode[id].children,
                                                           columnsCount,
                                                           rowNumber);
                            rows = rows.concat(builtRows.rows);
                            rowNumber = builtRows.rowNumber;
                        }
                    }
                else
                    for (var i = 0; i < matrix.length; i++){
                        var row = this.renderer.renderRowContainer();
                        var rowData = this._renderRowData(matrix, i);
                        this._appendChildren(row, rowData);
                        rows.push(row);
                        rowNumber++;
                    }
                return {"rows" : rows,
                        "rowNumber" : rowNumber};
            },

            /**
             * @function
             * @description
             * @param {Array} matrixLine - Contains all data we need to render
             */
            _renderRowData : function(columnsCount, rowNumber){
                console.log(rowNumber, columnsCount);
                var cells = new Array();
                for (var i = 0; i < columnsCount; i++){
                    var cellData = this.dataprovider.getData([this.getRowObject(rowNumber)],
                                                             [this.getColumnObject(i)]);
                    cells.push(this.renderer.renderCell(rowNumber,
                                                        i,
                                                        cellData,
                                                        rowNumber + "-" + i,
                                                        this._getCellEventsCallbacks()));
                }
                return cells;
            },

            /**
             * @function
             * @description Append an element to another (For now only HTML & string)
             * @param {object} element - Variable type element which child will be appended to
             * @param {object} child - Variable type child wich will be appended to
             * @return {object} element - Child has been appended to the parent element
             */
            _appendChild : function(element, child){
                return this.renderer.appendChild(element, child);
            },

            /**
             * @function
             * @description Append an element to another (For now only HTML & string)
             * @param {object} element - Variable type element which child will be appended to
             * @param {Array} children - Array of variable type child wich will be appended to
             * @return {object} element - Child has been appended to the parent element
             */
            _appendChildren : function(element, children){
                for (var i = 0; i < children.length; i++){
                    this._appendChild(element, children[i]);
                }
                return element;
            },

            /**
             * @function
             * @description Retrieve group span for headers
             * @param {object} renderedTreeNode - rendered tree node generated by the core
             * @param {object} span - initialy 1
             * @return {object} renderedTreeNode and span for recursivity
             */
            getGroupSpan : function(renderedTreeNode, span){
                if (!span)
                    span = 0;
                if (renderedTreeNode.children){
                    var initialSpan = span;
                    for (var id in renderedTreeNode.children) {
                        span += this.getGroupSpan(renderedTreeNode.children[id], initialSpan).span;
                    }
                } else {
                    span = 1;
                }
                renderedTreeNode.span = span;
                return {
                    "renderedTreeNode" : renderedTreeNode,
                    "span" : span
                };
            },

            /**
             * @function
             * @description Fill cells with a value
             */
            displayCells : function(){
                var cells = this.getCells();
                if (cells) {
                    this.renderer.renderCells(this.getData());
                    return 1;
                } else
                    return 0;
            },

            /**
             * @function
             * @description Display gather all other display and print it
             */
            display : function(){
                var start = new Date();

                var columns = this._preRenderColumns();
                this.columnsObjects = columns.objects;
                info_debug("column pre-render : " + (new Date() - start));
                info_debug("columns", columns);

                var rows = this._preRenderRows();
                this.rowsObjects = rows.objects;
                info_debug("rows pre-render : " + (new Date() - start));
                info_debug("rows pre-render : ", rows);

                if (columns)
                    this.displayColumns(columns, rows.depth);

                info_debug("appendColumns : " + (new Date() - start));
                this.displayData(rows, this.columnsObjects.length);

                info_debug("appendData & pre-display : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);
                info_debug("displayed : " + (new Date() - start));

                // Add events if workspace is HTML
                if (this.workspace instanceof HTMLElement){
                    var td = document.getElementsByTagName("td");
                    var th = document.getElementsByTagName("th");
                    for (var i = 0; i < th.length; i++){
                        th[i].addEventListener("mouseover",
                                               (function(event){this.onHeaderHover(event);}).bind(this));
                        th[i].addEventListener("click",
                                               (function(event){this.onHeaderClick(event);}).bind(this));
                        th[i].addEventListener("mouseout",
                                               (function(event){this.onHeaderOut(event);}).bind(this));
                    }
                }
            },

            _getCellEventsCallbacks : function(){
                return {
                    "mouseover" : this.onCellHover.bind(this),
                    "mouseout" : this.onCellOut.bind(this),
                    "click" : this.onCellClick.bind(this)
                };
            },

            /**
             * @function
             * @description Update matrix & headers. This does a full update, and recollect data
             */
            update : function(){
            },

            /**
             * @function
             * @description export matrix to a CSV
             * @return true if exported, false if no
             */
            exportToCSV : function(){
            },

            /**
             * @function
             * @description export matrix to a javascript table
             * @return true if exported, false if no
             */
            exportMatrix : function(){
            },


            //////////////
            /// EVENTS ///
            //////////////

            /**
             * @function
             * @description fire event on resize of the matrix
             */
            onResize : function(){
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event, false if no
             */
            beforeCellClick : function(){
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event
             */
            onCellClick : function(event){
                if (this.controller.onCellClick){
                    var idSplit = event.target.id.split("-"),
                        rowNumber = idSplit[0],
                        columnNumber = idSplit[1];
                    this.controller.onCellClick(event,
                                                this.dataprovider.getData(
                                                    [this.getRowObject(rowNumber)],
                                                    [this.getColumnObject(columnNumber)])
                                               );
                }
            },

            /**
             * @function
             * @description fire event on matrix cell hover
             */
            onCellHover : function(event){
                if (this.controller.onCellHover)
                    this.controller.onCellHover(event);
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event
             */
            onCellOut : function(event){
                if (this.controller.onCellOut)
                    this.controller.onCellOut(event);
            },

            /**
             * @function
             * @description
             * @return
             */
            onCellRightClick : function(){
            },

            /**
             * @function
             * @description
             * @return
             */
            onCellDoubleClick : function(){
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderClick : function(event){
                console.log(this.idMap);
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderHover : function(event){
                if (this.controller.onHeaderHover)
                    this.controller.onHeaderHover();
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderOut : function(event){
                if (this.controller.onHeaderOut)
                    this.controller.onHeaderOut();
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderRightClick : function(){
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderDoubleClick : function(){
            },

            ///////////////
            /// FILTERS ///
            ///////////////

            /**
             * @function
             * @description filter graphically on rows
             * @param {string} filter query
             */
            graphicalRowFilter : function(filter){
            },

            /**
             * @function
             * @description filter through the data provider
             * @param {string} filter query
             */
            dataRowFilter : function(filter){
            },

            /**
             * @function
             * @description filter graphically on columns
             * @param {string} filter query
             */
            graphicalColumnFilter : function(filter){
            },

            /**
             * @function
             * @description filter thourgh the data provider
             * @param {string} filter query
             */
            dataColumnFilter : function(filter){
            },

            /**
             * @function
             * @description filter graphically on data cells
             * @param {string} filter query
             */
            graphicalCellFilter : function(filter){
            },

            /**
             * @function
             * @description filter through the data provider
             * @param {string} filter query
             */
            dataCellFilter : function(filter){
            },

            ////////////////
            /// Property ///
            ////////////////

            set : function(propertyName, propertyValue){
                this[propertyName] = propertyValue;
                return this;
            },

            getRowObject : function(rowNumber){
                return this.rowsObjects[rowNumber];
            },

            getColumnObject : function(columnNumber){
                return this.columnsObjects[columnNumber];
            },

            getRowNumber : function(rowObject){
                for (var i = 0; i < this.rowsObjects.length; i++){
                    if (JSON.stringify(rowObjects[i]) == rowObject)
                        return i;
                }
                return null;
            },

            getColumnNumber : function(columnObject){
                for (var i = 0; i < this.columnsObjects.length; i++){
                    if (JSON.stringify(columnObjects[i]) == columnObject)
                        return i;
                }
                return null;
            }
        };
        Core = Class.create(Core);

        eniokaij.Core = Core;

        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        return eniokaij;
    }(enioka.ij || {})
);
