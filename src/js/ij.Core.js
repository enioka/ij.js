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
             * @member {HTMLElement} workspace meant to be an [HTMLElement]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
             */
            workspace : null,


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
                for (var i = 0; i < columns.length; i++)
                    colmunsArray.push(this.renderer.renderColumn(columns[i]));
                return colmunsArray;
            },

            /**
             * @function
             * @description
             */
            buildRenderedTree : function(renderedObjects){
                //create root array & map table
                var root = new Array(),
                    map = new Array();
	        for (var i = 0; i < renderedObjects.length; i++){
                    //set the parrent root at the initial array (level 0)
                    var childMap = new Array(),
                        parentRoot = root,
                        currentID = new String();
    	            for (var j = 0; j < renderedObjects[i].length; j++){
                        currentID += renderedObjects[i][j].id;
                        //if object is not mapped
        	        if (!map[currentID]){
                            //add object to the currentRoot
                            parentRoot.push(renderedObjects[i][j]);
                            //if current renderedObject has children, then create them
                            if (renderedObjects[i].length - 1 > j) {
                                renderedObjects[i][j].children = new Array();
                                //check if there is property to hide summaries
                                if (!this.hideSummaries)
                                    renderedObjects[i][j].children.push({
                                        "rendering" : this.renderer.renderSubTotalHeader(
                                            renderedObjects[i][j].label
                                    ),
                                        "order" : 100
                                    });
                            }
            	            map[currentID] = renderedObjects[i][j].children;
                        }
                        //if object is mapped then set the root at its location
            	        parentRoot = map[currentID];
                    }
                }
                return this.orderRenderedTree(root);
            },

            /**
             * @function
             * @description sort tree by order property
             * @return tree sorted by order property
             */
            orderRenderedTree : function(renderedTree){
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
                        if (childrenDepth > depth)
                            depth = childrenDepth;
                    }
                }
                return depth + 1;
            },

            applyTreeDepth : function(renderedObjectTree, depth){
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
             * @description Display columns
             */
            displayColumns : function(){
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var renderedColumns =
                    this.buildRenderedTree(
                        this.getRenderedColumns(
                            this.dataprovider.getColumns()
                        )
                    );
                for (var id in renderedColumns){
                    renderedColumns[id] =
                        this.getGroupSpan(renderedColumns[id]).renderedTreeNode;
                }
                this._columnsDepth = this.getTreeDepth(renderedColumns);
                renderedColumns =
                    this.applyTreeDepth(renderedColumns,
                                        this._columnsDepth);
                renderedColumns =
                    this.applyOnRenderedObjects(renderedColumns,
                                                (this.renderer.applyColSpan)
                                                .bind(this.renderer),
                                                "span");
                renderedColumns =
                    this.applyOnRenderedObjects(renderedColumns,
                                                (this.renderer.applyRowSpan)
                                                .bind(this.renderer),
                                                "depth");
                var columnsContainer = this.renderer.renderColumnsContainer();
                var columnsLevels = this.buildColumns(renderedColumns);

                // left upper corner creater to let space for rows headers
                var leftUpperCorner = {
                    "rendering" : this.renderer.renderLeftUpperCorner(),
                    "colspan" : this._rowsDepth,
                    "rowspan" : this._columnsDepth
                };
                leftUpperCorner =
                    this.renderer.applyColSpan(leftUpperCorner,
                                               "colspan");
                leftUpperCorner =
                    this.renderer.applyRowSpan(leftUpperCorner,
                                               "rowspan");
                //Add it before
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

            /**
             * @function
             * @description Display rows
             */
            displayRows : function(){
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var renderedRows =
                    this.buildRenderedTree(
                        this.getRenderedRows(
                            this.dataprovider.getRows()
                        )
                    );
                console.log(renderedRows);
                for (var id in renderedRows){
                    renderedRows[id] = this.getGroupSpan(renderedRows[id], 1).renderedTreeNode;
                }
                this._rowsDepth = this.getTreeDepth(renderedRows);
                renderedRows = this.applyTreeDepth(renderedRows,
                                                   this._rowsDepth);
                renderedRows = this.applyOnRenderedObjects(renderedRows,
                                                           (this.renderer.applyRowSpan)
                                                           .bind(this.renderer),
                                                           "span");
                renderedRows = this.applyOnRenderedObjects(renderedRows,
                                                           (this.renderer.applyColSpan)
                                                           .bind(this.renderer),
                                                           "depth");
                var rowsContainer = this.renderer.renderRowsContainer();
                var rows = this.buildRows(renderedRows);
                console.log(rows);
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

            /**
             * @function
             * @description build rows array, each cell contains a row header
             * @param {object} rowsTreeNode - A node from Rows tree
             * @return
             */
            buildRows : function(rowsTreeNode){
                var rows = new Array();
                for (var id in rowsTreeNode){
                    var row = this.renderer.renderRowContainer();
                    this._appendChild(row, rowsTreeNode[id].rendering);
                    rows.push(row);
                    if (rowsTreeNode[id].children){
                        rows = rows.concat(this.buildRows(rowsTreeNode[id].children));
                    }
                }
                return rows;
            },

            /**
             * @function
             * @description Append an element to another (For now only HTML & string)
             * @param {object} element - Variable type element which child will be appended to
             * @param {object} child - Variable type child wich will be appended to
             * @return {object} element - Child has been appended to the parent element
             */
            _appendChild : function(element, child){
                if (element instanceof HTMLElement)
                    return element.appendChild(child);
                else
                    return element += child;
            },

            /**
             * @function
             * @description
             * @param
             * @return
             */
            cloneRenderedHeader : function(renderedHeader) {
                var copy = {};
                if (null == renderedHeader ||
                    "object" != typeof renderedHeader) return renderedHeader;
                for (var attr in renderedHeader) {
                    if (renderedHeader.hasOwnProperty(attr) && attr != "children")
                        copy[attr] = renderedHeader[attr];
                }
                return copy;
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
                this.displayRows();
                this.displayColumns();
                this.workspace.appendChild(this.container);
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
             * @description
             * @return
             */
            onCellClick : function(){
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
            onHeaderClick : function(){
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
            }
        };
        Core = Class.create(Core);

        eniokaij.Core = Core;

        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        return eniokaij;
    }(enioka.ij || {})
);
