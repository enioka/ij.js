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
            initialize: function (properties) {
                if (!properties) {
                    this.setController(new eniokaij.IIJController());
                    this.setRenderer(new eniokaij.IIJRenderer());
                    this.setDataProvider(new eniokaij.IIJDataProvider());
                    return;
                } else {
                    for (var prop in properties) {
                        this[prop] = properties[prop];
                    }
                }
            },

            params: {},
            /**
             * @memberof enioka.ij.Core
             * @member {interface} dataProvider
             */
            dataprovider: null,
            /**
             * @memberof enioka.ij.Core
             * @member {interface} controller
             */
            controller: null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} controller
             */
            renderer: null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} cache
             */
            cache: null,
            /**
             * @memberof enioka.ij.Core
             * @member {object} workspace
             */
            workspace: null,

            cellsMap: [],

            /**
             * @function
             * @description
             * @param {object}
             */
            init: function (params) {
                for (var attr in params) {
                    this.params[attr] = params[attr];
                }
            },
            /**
             * @function
             * @description Set the workspace where the matrix will be displayed.
             * @param workspace javascript object of the workspace.
             * @return this object itself to allow chaining methods.
             */
            setWorkspace: function (workspace) {
                console.log(workspace);
                if (typeof workspace !== "undefined")
                    this.workspace = workspace;
                else
                    this.workspace = document.body;
                return this;
            },

            /**
             * @function
             * @description Get the workspace where the matrix will be displayed.
             * @return workspace where the matrix will be displayed
             */
            getWorkspace: function () {
                return this.workspace;
            },

            /**
             * @function
             * @param dataProvider data provider object that should contain generics methods
             * to gather data necessary to display elements.
             * @return dataProvider implementer.
             */
            setDataProvider: function (dataprovider) {
                if (typeof dataprovider !== "undefined")
                    this.dataprovider = dataprovider;
                else
                    this.dataprovider = new eniokaij.IIJDataProvider(this);
                return this.dataprovider;
            },

            /**
             * @function
             * @param controller data provider object that should contain generics methods
             * to call Core API.
             * @return controller implemented.
             */
            setController: function (controller) {
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
            setRenderer: function (renderer) {
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
            _checkDependencies: function () {
                console.log("Something is missing : ");
                console.log("Checking DataProvider : ", this.dataProvider);
                console.log("Checking controller : ", this.controller);
                console.log("Checking DataProvider : ", this.renderer);
                console.log("Checking Workspace : ", this.workspace);
                console.log("Checking DataHandler : ", this.dataHandler);
                if (!this.renderer || !this.dataProvider || !this.dataHandler || !this.controller || !this.workspace) {
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * @function
             * @description
             */
            getRenderedRows: function (rows) {
                var rowsArray = new Array();
                if (rows)
                    for (var i = 0; i < rows.length; i++)
                        rowsArray.push(this.renderer.renderRow(rows[i],
                            i));
                return rowsArray;
            },

            /**
             * @function
             * @description
             * @param {Array}
             * @return {Array}
             */
            getRenderedColumns: function (columns) {
                var colmunsArray = new Array();
                if (columns)
                    for (var i = 0; i < columns.length; i++)
                        colmunsArray.push(this.renderer.renderColumn(columns[i],
                            i));
                return colmunsArray;
            },

            /**
             * @function
             * @description Build a hierarchical tree from renderedObjects flat arrays
             * Map for each objects and create a corresponding tree view considering each
             * attributes
             * @param {Array} renderedObjects - renderedObjects recovered from Renderer
             * @param {String} type - define type of tree (rowsHeader, columnsHeader)
             * @return {object} contains rendered tree
             */
            buildRenderedTree: function (renderedObjects, type) {
                var start = new Date();
                //create root array & map table
                var _scope = {};
                var map = new Array(),
                    idMap = new Array();
                _scope.root = new Array();
                for (var i = 0; i < renderedObjects.length; i++) {
                    //set the parrent root at the initial array (level 0)
                    var childMap = new Array(),
                        parentRoot = _scope.root,
                        currentID = new String();
                    for (var j = 0; j < renderedObjects[i].length; j++) {
                        currentID += renderedObjects[i][j].id;
                        if (!idMap[renderedObjects[i][j].id])
                            idMap[renderedObjects[i][j].id] = currentID;
                        else
                            currentID = idMap[renderedObjects[i][j].id];
                        //if object is not mapped
                        if (!map[currentID]) {
                            if (!parentRoot instanceof Array)
                                parentRoot = new Array();
                            renderedObjects[i][j].type = type;
                            //add object to the currentRoot
                            parentRoot.push(renderedObjects[i][j]);
                            //if current renderedObject has children, then create them
                            if (renderedObjects[i].length - 1 > j) {
                                renderedObjects[i][j].children = new Array();
                                //check if there is property to hide summaries
                                if (!this.hideSummaries)
                                    renderedObjects[i][j].children.push(
                                        this.renderer.renderSummary(renderedObjects[i][j])
                                    );
                                if (renderedObjects[i][j].object) {
                                    renderedObjects[i][j].children.push(
                                        this._cloneHeader(renderedObjects[i][j],
                                            type)
                                    );
                                    delete renderedObjects[i][j].object;
                                }
                            }
                            map[currentID] = renderedObjects[i][j];
                        } else {
                            if (j > 0) {
                                var found = false;
                                for (var k = 0; k < parentRoot.length; k++) {
                                    if (parentRoot[k].id == renderedObjects[i][j].id) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (found != true) {
                                    var id = renderedObjects[i][j].id;
                                    var tmpRoot = map[currentID];
                                    this._deleteNode(id, _scope.root);
                                    parentRoot.push(tmpRoot);
                                    delete map[currentID];
                                    map[currentID] = tmpRoot;
                                }
                            }
                            if (renderedObjects[i].length - 1 > j) {
                                if (!map[currentID].children) {
                                    map[currentID].children = new Array();
                                    if (map[currentID].object) {
                                        map[currentID].children.push(
                                            this._cloneHeader(renderedObjects[i][j],
                                                type)
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
                return _scope.root;
            },

            _deleteNode: function (nodeId, node) {
                for (var id in node) {
                    if (node[id].id == nodeId)
                        delete node[id];
                    else if (node[id].children)
                        this._deleteNode(nodeId, node[id].children);
                }
            },

            _cloneHeader: function (header, type) {
                var duplicatedHeader = {};
                for (var attr in header) {
                    if (attr == "label")
                        duplicatedHeader[attr] = "";
                    else if (attr == "children")
                        continue;
                    else if (attr == "id") {
                        duplicatedHeader[attr] = header[attr] + "_child";
                    }
                    else if (attr == "rendering") {
                        duplicatedHeader[attr] = this.renderer.setId(
                            header[attr],
                            this.renderer.getIdPrefix(type) + duplicatedHeader.id);
                    }
                    else
                        duplicatedHeader[attr] = header[attr];
                }
                duplicatedHeader.type = type;
                return duplicatedHeader;
            },

            /**
             * @function
             * @description sort tree by order property
             * @return tree sorted by order property
             */
            orderRenderedTree: function (renderedTree) {
                var start = new Date();
                var ordered = new Array(),
                    root = new Array();
                for (var id in renderedTree) {
                    if (!ordered[renderedTree[id].order])
                        ordered[renderedTree[id].order] = new Array();
                    ordered[renderedTree[id].order].push(renderedTree[id]);
                    if (renderedTree[id].children)
                        renderedTree[id].children =
                            this.orderRenderedTree(renderedTree[id].children);
                }
                for (var i in ordered) {
                    root = root.concat(this.alphabeticalSort(ordered[i]));
                }
                return root;
            },

            /**
             * @function
             * @description alphabetical sort
             * @return {Array} sorter aphabetically on label object property
             */
            alphabeticalSort: function (array) {
                return array.sort(
                    function compare(a, b) {
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
             * @description return depth
             * @param {object} renderedObjectTree
             * @return {int} depth
             */
            getTreeDepth: function (renderedObjectTree) {
                var depth = 0;
                for (var id in renderedObjectTree) {
                    if (renderedObjectTree[id].children) {
                        var childrenDepth = this.getTreeDepth(renderedObjectTree[id].children);
                        renderedObjectTree[id].group = true;
                        if (childrenDepth > depth)
                            depth = childrenDepth;
                    }
                }
                return depth + 1;
            },

            applyTreeDepth: function (renderedObjectTree, depth) {
                var start = new Date();
                for (var id in renderedObjectTree) {
                    if (renderedObjectTree[id].children && renderedObjectTree[id].open == true) {
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
            _preRenderColumns: function (columns) {
                console.profile("_preRenderColumns");
                if (columns) {
                    var renderedColumns = this.getRenderedColumns(
                        columns
                    );
                    var renderedColumns =
                        this.buildRenderedTree(
                            renderedColumns,
                            "columnHeader"
                        );
                    renderedColumns = this.orderRenderedTree(renderedColumns);
                } else if (this.columns && this.columns.rendering) {
                    var renderedColumns = this.columns.rendering;
                } else {
                    //means no columns objects, have to return
                    return;
                }
                for (var id in renderedColumns) {
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
                        .bind(this.renderer));
                console.profileEnd();
                return {
                    "depth": columnsDepth,
                    "rendering": renderedColumns
                };
            },

            displayColumns: function (columns, rowsDepth) {
                var columnsContainer = this.renderer.renderColumnsContainer();
                var columnsLevels = this.buildColumns(columns.rendering);

                // left upper corner creater to let space for rows headers
                var leftUpperCorner = {
                    "rendering": this.renderer.renderLeftUpperCorner(),
                    "colspan": (rowsDepth || 1),
                    "rowspan": (columns.depth || 1)
                };
                leftUpperCorner.rendering =
                    this.renderer.applyColSpan(leftUpperCorner.rendering,
                        leftUpperCorner["colspan"]);
                leftUpperCorner.rendering =
                    this.renderer.applyRowSpan(leftUpperCorner.rendering,
                        leftUpperCorner["rowspan"]);
                //Add it before every other columns
                if (columns.rendering.length > 0)
                    columnsLevels[1].unshift(leftUpperCorner.rendering);
                for (var lvl in columnsLevels) {
                    var level = this.renderer.renderColumnsLevelContainer();
                    for (var col in columnsLevels[lvl]) {
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
             * @param {int} level
             * @param {Array} renderedColumns
             * @return
             */
            buildColumns: function (renderedColumns, level) {
                level = typeof level !== 'undefined' ? level : 1;
                var columnsLevel = new Array();
                columnsLevel[level] = new Array();
                for (var id in renderedColumns) {
                    renderedColumns[id].rendering = this.renderer.addEventsToRendering(renderedColumns[id].rendering,
                        this._getHeaderEventsCallbacks(renderedColumns[id]));
                    columnsLevel[level].push(renderedColumns[id].rendering);
                    if (renderedColumns[id].children && (renderedColumns[id].open != false &&
                        renderedColumns[id].open != "false")) {
                        var childrenArray =
                            this.buildColumns(renderedColumns[id].children, level + 1);
                        for (var lvl in childrenArray) {
                            if (!columnsLevel[lvl])
                                columnsLevel[lvl] = new Array();
                            for (var val in childrenArray[lvl]) {
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
            _preRenderRows: function (rows) {
                console.profile("rows");
                if (rows) {
                    var renderedRows =
                        this.buildRenderedTree(
                            this.getRenderedRows(
                                rows
                            ),
                            "rowHeader"
                        );
                    renderedRows = this.orderRenderedTree(renderedRows);
                } else if (this.rows && this.rows.rendering) {
                    var renderedRows = this.rows.rendering;
                } else {
                    //means no rowsobjects have to return
                    return;
                }
                for (var id in renderedRows) {
                    renderedRows[id] = this.getGroupSpan(renderedRows[id], 1).renderedTreeNode;
                }
                var rowsDepth = this.getTreeDepth(renderedRows);
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
                        .bind(this.renderer));
                console.profileEnd();
                return {
                    "depth": rowsDepth,
                    "rendering": renderedRows
                };
            },

            displayData: function (rows, columns) {
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var rowsContainer = this.renderer.renderRowsContainer();
                if (rows && columns)
                    rows = this.buildRows(rows.rendering, columns).rows;
                else if (rows)
                    rows = this.buildRows(rows.rendering, null).rows;
                else
                    rows = this.buildMatrix();
                for (var row in rows) {
                    this._appendChild(rowsContainer, rows[row]);
                }
                this._appendChild(this.container, rowsContainer);
            },

            buildMatrix: function () {
                var matrix = this.dataprovider.getData(),
                    rows = new Array(),
                    rowContainer,
                    cells;
                console.log(matrix);
                for (var i = 0; i < matrix.length; i++) {
                    cells = new Array();
                    rowContainer = this.renderer.renderRowContainer();
                    for (var j = 0; j < matrix[i].length; j++) {
                        cells.push(this.renderer.renderCell([i],
                            [j],
                            matrix[i][j],
                            this._getCellEventsCallbacks([i], [j])));
                    }
                    this._appendChildren(rowContainer, cells);
                    rows.push(rowContainer);
                }
                return rows;
            },

            /**
             * @function
             * @description apply a specific callback on all renderedObjects (including children)
             * @param
             * @param
             * @return
             */
            applyOnRenderedObjects: function (renderedObjects, callback, params) {
                for (var id in renderedObjects) {
                    renderedObjects[id].rendering = callback(renderedObjects[id].rendering,
                        renderedObjects[id][params]);
                    if (renderedObjects[id].children)
                        renderedObjects[id].children =
                            this.applyOnRenderedObjects(renderedObjects[id].children, callback, params);
                }
                return renderedObjects;
            },

            applyClasses: function (renderedObjects, callback, currentId) {
                if (!currentId)
                    var currentId = 0;
                for (var id in renderedObjects) {
                    var classes = new Array();
                    if (renderedObjects[id].children) {
                        this.applyClasses(renderedObjects[id].children,
                            callback,
                            currentId);
                        var nextId = currentId + this._getObjectsFromTree(renderedObjects[id].children).length;
                        for (var i = currentId; i < nextId; i++) {
                            classes.push(i);
                        }
                        currentId = nextId;
                        renderedObjects[id].rendering = callback(renderedObjects[id].rendering,
                            renderedObjects[id].type,
                            classes);
                    } else if (renderedObjects[id].object) {
                        var nextId = currentId + 1;
                        for (var i = currentId; i < nextId; i++) {
                            classes.push(i);
                        }
                        currentId = nextId;
                        renderedObjects[id].rendering = callback(renderedObjects[id].rendering,
                            renderedObjects[id].type,
                            classes);
                    }
                }
                return renderedObjects;
            },

            /**
             * @function
             * @description build rows array, each cell contains a row header
             * @param {object} rowsTreeNode - A node from Rows tree
             * @return
             */
            buildRows: function (rowsTreeNode, columns, rowNumber) {
                if (!rowNumber)
                    var rowNumber = 0;
                var rows = new Array();
                if (rowsTreeNode.length > 0)
                    for (var id in rowsTreeNode) {
                        var row = this.renderer.renderRowContainer();
                        if (rowsTreeNode[id].children && (rowsTreeNode[id].open == "false" ||
                            rowsTreeNode[id].open == false)) {
                            rowsTreeNode[id].rendering = this.renderer.applyRowSpan(rowsTreeNode[id].rendering,
                                2);
                        }
                        rowsTreeNode[id].rendering = this.renderer.addEventsToRendering(rowsTreeNode[id].rendering,
                            this._getHeaderEventsCallbacks(rowsTreeNode[id]));
                        this._appendChild(row, rowsTreeNode[id].rendering);
                        if (rowsTreeNode[id].object) {
                            var rowData = this._renderRowData(columns,
                                rowNumber);
                            this._appendChildren(row, rowData);
                            rowNumber++;
                            rows.push(row);
                        }
                        else if (rowsTreeNode[id].children && (rowsTreeNode[id].open != "false" &&
                            rowsTreeNode[id].open != false)) {
                            rows.push(row);
                            var builtRows = this.buildRows(rowsTreeNode[id].children,
                                columns,
                                rowNumber);
                            rows = rows.concat(builtRows.rows);
                            rowNumber = builtRows.rowNumber;
                        } else {
                            rows.push(row);
                            var rowsNumbers = new Array(),
                                rowsObjectsLength = this._getObjectsFromTree(rowsTreeNode[id].children).length;
                            for (var i = 0; i < rowsObjectsLength; i++) {
                                rowsNumbers.push(rowNumber);
                                rowNumber++;
                            }
                            var rowsData = this._renderAggregateRowData(columns,
                                rowsNumbers);
                            rows = rows.concat(rowsData);
                        }
                    }
                return {
                    "rows": rows,
                    "rowNumber": rowNumber
                };
            },

            /**
             * @function
             * @description
             */
            _renderAggregateRowData: function (columns, rowsNumbers) {
                var rows = new Array(),
                    cells = new Array(),
                    row = this.renderer.renderRowContainer(),
                    columnsNumbers = this.getColumnsNumbersFromObjects(columns);
                for (var i = 0; i < columnsNumbers.length; i++) {
                    var cellData = this.dataprovider.getData(this.getRowsObjects(rowsNumbers),
                        columns[i]);
                    cells.push(this.renderer.renderCell(rowsNumbers,
                        columnsNumbers[i],
                        cellData,
                        this._getCellEventsCallbacks(
                            rowsNumbers,
                            columnsNumbers[i])));
                }
                this._appendChildren(row, cells);
                rows.push(row);
                return rows;
            },

            /**
             * @function
             * @description
             * @param {Array} matrixLine - Contains all data we need to render
             */
            _renderRowData: function (columns, rowNumber) {
                var columnsNumbers = this.getColumnsNumbersFromObjects(columns),
                    cells = new Array(),
                    rowsNumbers = [rowNumber];
                for (var i = 0; i < columnsNumbers.length; i++) {
                    var cellData = this.dataprovider.getData(this.getRowsObjects(rowsNumbers),
                        columns[i]);
                    cells.push(this.renderer.renderCell(rowsNumbers,
                        columnsNumbers[i],
                        cellData,
                        this._getCellEventsCallbacks(
                            rowsNumbers,
                            columnsNumbers[i])));
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
            _appendChild: function (element, child) {
                return this.renderer.appendChild(element, child);
            },

            /**
             * @function
             * @description Append an element to another (For now only HTML & string)
             * @param {object} element - Variable type element which child will be appended to
             * @param {Array} children - Array of variable type child wich will be appended to
             * @return {object} element - Child has been appended to the parent element
             */
            _appendChildren: function (element, children) {
                for (var i = 0; i < children.length; i++) {
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
            getGroupSpan: function (renderedTreeNode, span) {
                if (!span)
                    span = 0;
                if (renderedTreeNode.children && renderedTreeNode.open != "false"
                    && renderedTreeNode.open != false) {
                    var initialSpan = span;
                    for (var id in renderedTreeNode.children) {
                        span += this.getGroupSpan(renderedTreeNode.children[id], initialSpan).span;
                    }
                } else if (renderedTreeNode.children
                    && renderedTreeNode.type == "rowHeader") {
                    //We have to add a span because data line will be added in another "TR"
                    span = 2;
                } else {
                    span = 1;
                }
                renderedTreeNode.span = span;
                return {
                    "renderedTreeNode": renderedTreeNode,
                    "span": span
                };
            },

            /**
             * @function
             * @description Display gather all other display and print it
             */
            display: function () {
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var start = new Date();

                var columns = this._preRenderColumns(this.dataprovider.getColumns());
                if (columns)
                    this.columns = columns;
                info_debug("column pre-render : " + (new Date() - start));
                info_debug("columns", columns);

                var rows = this._preRenderRows(this.dataprovider.getRows());
                if (rows)
                    this.rows = rows;
                info_debug("rows pre-render : " + (new Date() - start));
                info_debug("rows pre-render : ", rows);

                if (columns)
                    this.displayColumns(columns, rows.depth);

                info_debug("appendColumns : " + (new Date() - start));
                if (columns)
                    this.displayData(rows, this.getObjectsGrouped(columns.rendering));
                else
                    this.displayData(rows);
                console.log("get columns by group");

                info_debug("appendData & pre-display : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);
                info_debug("displayed : " + (new Date() - start));

                console.log(rows, columns);
            },

            _getCellEventsCallbacks: function (rowsNumbers, columnsNumbers) {
                return {
                    "mouseover": this.onCellHover.bind(this, rowsNumbers, columnsNumbers),
                    "mouseout": this.onCellOut.bind(this, rowsNumbers, columnsNumbers),
                    "click": this.onCellClick.bind(this, rowsNumbers, columnsNumbers)
                };
            },

            _getHeaderEventsCallbacks: function (treeNode) {
                return {
                    "mouseover": this.onHeaderHover.bind(this, treeNode),
                    "mouseout": this.onHeaderOut.bind(this, treeNode),
                    "click": this.onHeaderClick.bind(this, treeNode)
                };
            },

            /**
             * @function
             * @description Update matrix & headers. This does a full update, and recollect data
             */
            update: function () {
            },

            /**
             * @function
             * @description export matrix to a CSV
             * @return true if exported, false if no
             */
            exportToCSV: function () {
            },

            /**
             * @function
             * @description export matrix to a javascript table
             * @return true if exported, false if no
             */
            exportMatrix: function () {
            },

            ///////////////
            /// GETTERS ///
            ///////////////

            getHeaderType: function (headerNode) {
                return headerNode.type;
            },

            getRowObject: function (number) {
                if (!this.rowsObjects) {
                    this.rowsObjects = this._getObjectsFromTree(this.rows.rendering);
                }
                return this.rowsObjects[number];
            },

            getRowsObjects: function (numbers) {
                var rowsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    rowsObjects.push(this.getRowObject(numbers[i]));
                }
                return rowsObjects;
            },

            getColumnObject: function (number) {
                if (!this.columnsObjects) {
                    this.columnsObjects = this._getObjectsFromTree(this.columns.rendering);
                }
                return this.columnsObjects[number];
            },

            getColumnsObjects: function (numbers) {
                var columnsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    columnsObjects.push(this.getColumnObject(numbers[i]));
                }
                return columnsObjects;
            },

            getRowNumber: function (object) {
                if (!this.rowsObjects) {
                    this.rowsObjects = this._getObjectsFromTree(this.rows.rendering);
                }
                for (var i = 0; i < this.rowsObjects.length; i++) {
                    if (JSON.stringify(this.rowsObjects[i]) ==
                        JSON.stringify(object))
                        return i;
                }
                return -1;
            },

            getColumnNumber: function (object) {
                if (!this.columnsObjects) {
                    this.columnsObjects = this._getObjectsFromTree(this.columns.rendering);
                }
                for (var i = 0; i < this.columnsObjects.length; i++) {
                    if (JSON.stringify(this.columnsObjects[i]) ==
                        JSON.stringify(object))
                        return i;
                }
                return -1;
            },

            getColumnsNumbersFromObjects: function (columnsObjects) {
                var numbers = new Array(),
                    lastNumber = 0;
                for (var i = 0; i < columnsObjects.length; i++) {
                    numbers[i] = new Array();
                    for (var j = lastNumber; j < (columnsObjects[i].length + lastNumber); j++) {
                        numbers[i].push(j);
                    }
                    lastNumber = numbers[i][numbers[i].length - 1] + 1;
                }
                return numbers;
            },

            getAllRowsObjects: function () {
                if (!this.rowsObjects) {
                    this.rowsObjects = this._getObjectsFromTree(this.rows.rendering);
                }
                return this.rowsObjects;
            },

            getAllColumnsObjects: function () {
                if (!this.columnsObjects) {
                    this.columnsObjects = this._getObjectsFromTree(this.columns.rendering);
                }
                return this.columnsObjects;
            },

            getRowsNumber: function () {
                if (!this.rowsObjects) {
                    this.rowsObjects = this._getObjectsFromTree(this.rows.rendering);
                }
                return this.rowsObjects;
            },

            getColumnsNumber: function () {
                if (!this.columnsObjects) {
                    this.columnsObjects = this._getObjectsFromTree(this.columns.rendering);
                }
                return this.columnsObjects.length;
            },

            getNodeFromProperty: function (property, value, from) {
                var node = null;
                for (var id in from) {
                    if (from[id][property] == value) {
                        node = from[id];
                    }
                    else if (from[id].children) {
                        node = this.getNodeFromProperty(property,
                            value,
                            from[id].children);
                    }
                    if (node != null)
                        break;
                }
                return node;
            },

            matchNodesFromProperty: function (property, value, type) {
                var node = new Array();
                if (type == "rowHeader") {
                    if (!this.rows)
                        return [];
                    var from = this.rows.rendering;
                }
                else if (type == "columnHeader") {
                    if (!this.columns)
                        return [];
                    var from = this.columns.rendering;
                }
                else
                    return;
                for (var id in from) {
                    if (from[id][property].indexOf(value) > -1) {
                        node.push(from[id]);
                    }
                    else if (from[id].children && (from[id].open == true || from[id].open == "true")) {
                        var returned = this.getNodeFromProperty(property,
                            value,
                            from[id].children);
                        if (returned)
                            node = node.concat(returned);
                    }
                    else continue;
                }
                return node;
            },

            getObjectsGrouped: function (renderedObjectsTree) {
                var objects = new Array();
                if (typeof renderedObjectsTree == undefined)
                    return [];
                else {
                    for (var id in renderedObjectsTree) {
                        if ((renderedObjectsTree[id].open == false || renderedObjectsTree[id].open == "false") &&
                            renderedObjectsTree[id].children) {
                            objects.push(
                                this._getObjectsFromTree(renderedObjectsTree[id].children)
                            );
                        } else if (renderedObjectsTree[id].children) {
                            var childrenObjects = this.getObjectsGrouped(renderedObjectsTree[id].children);
                            if (childrenObjects)
                                objects = objects.concat(childrenObjects);
                        } else if (renderedObjectsTree[id].object) {
                            objects.push([renderedObjectsTree[id].object]);
                        }
                    }
                }
                if (objects.length == 0)
                    return;
                return objects;
            },


            _getObjectsFromTree: function (renderedObjectsTree) {
                var objects = new Array();
                for (var id in renderedObjectsTree) {
                    if (renderedObjectsTree[id].object)
                        objects.push(renderedObjectsTree[id].object);
                    if (renderedObjectsTree[id].children)
                        objects = objects.concat(this._getObjectsFromTree(
                            renderedObjectsTree[id].children));
                }
                return objects;
            },

            //////////////
            /// EVENTS ///
            //////////////

            /**
             * @function
             * @description fire event on resize of the matrix
             */
            onResize: function () {
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event, false if no
             */
            beforeCellClick: function () {
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event
             */
            onCellClick: function (rowsNumbers, columnsNumbers, event) {
                console.log(rowsNumbers, columnsNumbers);
                if (this.controller.onCellClick) {
                    this.controller.onCellClick(event,
                        this.dataprovider.getData(
                            this.getRowsObjects(rowsNumbers),
                            this.getColumnsObjects(columnsNumbers)
                        )
                    );
                }
            },

            /**
             * @function
             * @description fire event on matrix cell hover
             */
            onCellHover: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellHover)
                    this.controller.onCellHover(event);
            },

            /**
             * @function
             * @description fire event before click on matrix cell
             * @return {boolean} true for onCellClick event
             */
            onCellOut: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellOut)
                    this.controller.onCellOut(event);
            },

            /**
             * @function
             * @description
             * @return
             */
            onCellRightClick: function () {
            },

            /**
             * @function
             * @description
             * @return
             */
            onCellDoubleClick: function () {
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderClick: function (headerNode, event) {
                if (this.controller.onHeaderClick)
                    this.controller.onHeaderClick(event, headerNode);
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderHover: function (event) {
                if (this.controller.onHeaderHover)
                    this.controller.onHeaderHover(event);
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderOut: function (event) {
                if (this.controller.onHeaderOut)
                    this.controller.onHeaderOut(event);
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderRightClick: function () {
            },

            /**
             * @function
             * @description
             * @return
             */
            onHeaderDoubleClick: function () {
            },

            ///////////////
            /// FILTERS ///
            ///////////////

            /**
             * @function
             * @description filter graphically on rows
             * @param {string} filter query
             */
            graphicalRowFilter: function (filter) {
            },

            /**
             * @function
             * @description filter through the data provider
             * @param {string} filter query
             */
            dataRowFilter: function (filter) {
            },

            /**
             * @function
             * @description filter graphically on columns
             * @param {string} filter query
             */
            graphicalColumnFilter: function (filter) {
            },

            /**
             * @function
             * @description filter thourgh the data provider
             * @param {string} filter query
             */
            dataColumnFilter: function (filter) {
            },

            /**
             * @function
             * @description filter graphically on data cells
             * @param {string} filter query
             */
            graphicalCellFilter: function (filter) {
            },

            /**
             * @function
             * @description filter through the data provider
             * @param {string} filter query
             */
            dataCellFilter: function (filter) {
            },

            ////////////////
            /// Property ///
            ////////////////

            set: function (propertyName, propertyValue) {
                this[propertyName] = propertyValue;
                return this;
            },

            //////////////////////////////////////
            /// HEADER PROPERTIES MODIFICATION ///
            //////////////////////////////////////

            toggleHeader: function (headerNode) {
                if (headerNode.open == false || headerNode.open == "false") {
                    headerNode.open = true;
                } else {
                    headerNode.open = false;
                }
            },

            toggleHeaderVisibility: function (headerNode) {
                if (headerNode.hidden == false || headerNode.hidden == "false") {
                    headerNode.hidden = true;
                } else {
                    headerNode.hidden = false;
                }
            },

            ///////////////
            /// REFRESH ///
            ///////////////

            refresh: function (type) {
                var start = new Date();
                this.renderer.clearOutput(this.workspace);
                this.container = this.renderer.renderContainer();
                if (type == "columnHeader") {
                    var columns = this._preRenderColumns();
                    this.columns = columns;
                } else if (type == "rowHeader") {
                    var rows = this._preRenderRows();
                    this.rows = rows;
                }
                if (this.columns)
                    this.displayColumns(this.columns, this.rows.depth);

                info_debug("appendColumns : " + (new Date() - start));
                if (this.columns)
                    this.displayData(this.rows, this.getObjectsGrouped(this.columns.rendering));
                else
                    this.displayData(this.rows);
                console.log("get columns by group");

                info_debug("appendData & pre-display : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);
                info_debug("displayed : " + (new Date() - start));

                console.log(this.rows, this.columns);
            }
        };
        Core = Class.create(Core);

        eniokaij.Core = Core;

        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        return eniokaij;
    }(enioka.ij || {})
);
