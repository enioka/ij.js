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
             * @param {object} workspace javascript object of the workspace.
             * @return {object} this object itself to allow chaining methods.
             */
            setWorkspace: function (workspace) {
                console.log("workspace", workspace);
                if (typeof workspace !== "undefined")
                    this.workspace = workspace;
                else
                    this.workspace = document.body;
                return this;
            },

            /**
             * @function
             * @description Get the workspace where the matrix will be displayed.
             * @return {object} workspace where the matrix will be displayed
             */
            getWorkspace: function () {
                return this.workspace;
            },

            /**
             * @function
             * @description recover generics methods to gather data necessary to display
             * elements.
             * @param {object} dataProvider data provider object that should contain the methods
             * @return {object} dataProvider implemented.
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
             * @description
             * @param {object} controller data provider object that should contain generics methods
             * to call Core API.
             * @return {object} controller implemented.
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
             * @param {object} renderer data provider object that should contain generics methods
             * to render objects.
             * @return {object} renderer implemented.
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
             * DataProvider, Controller, Renderer, Workspace or DataHandler
             * @return {boolean} true or false if dependencies are wheter or not set
             */
            _checkDependencies: function () {
                console.log("Something is missing : ");
                console.log("Checking DataProvider : ", this.dataProvider);
                console.log("Checking Controller : ", this.controller);
                console.log("Checking Renderer : ", this.renderer);
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
             * @description create an array, and award a renderer at all datas
             * @param {Array} rows an array who content all the information set in the row
             * @return {Array} rowsArray an Array with the two elements of the row head
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
             * @description create an array, and render each column retrieved with the DataProvider
             * @param {Array} columns an array who contains all the information set in the column
             * @return {Array} columnsArray an Array with the two elements of a column head
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
             * @param {Array} renderedObjects renderedObjects recovered from Renderer
             * @param {String} type define type of tree (rowsHeader, columnsHeader)
             * @return {object} _scope.root contains rendered tree
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
             * @description organise the tree in order by id
             * @param {Array} renderedTree rendered of an head column/row
             * @return {Array} root tree sorted by order id
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
             * @description sort alphabeticaly an Array
             * @param {Array} array the array sorted
             * @return {Array} array sort aphabetically on label object property
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
             * @description return the tree depth
             * @param {Array} renderedObjectTree
             * @return {number} depth the depth of the tree
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

            /**
             * @function
             * @description return the tree with the depth property describing its depth
             * @param {Array} renderedObjectTree
             * @param {number} depth current Depth
             * @return {Array} renderedObjectTree tree with the depth property
             */
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

            /**
             * @function
             * @description display the columns on the web page
             * @param {Array} columns the columns objects
             * @param {string} rowsDepth the depth of the rowsTree
             */
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
             * @description build the default head columns (in the case or we have all the
             * information)
             * @param {number} level the number of columns
             * @param {Array} renderedColumns a renderer of the columns with initial object
             * @return {Array} columnsLevel return a build head columns
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

            /**
             * @function
             * @description build the display of the data matrix
             * @param {Array} rows the data rows to display
             * @param {Array} columns the data columns to display
             */
            displayData: function (rows, columns) {
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var rowsContainer = this.renderer.renderRowsContainer();
                if (rows && columns)
                    rows = this.buildRows(rows.rendering, columns).rows;
                else if (rows)
                    rows = this.buildRows(rows.rendering, null).rows;
                for (var row in rows) {
                    this._appendChild(rowsContainer, rows[row]);
                }
                this._appendChild(this.container, rowsContainer);
            },

            /**
             * @function
             * @description apply a specific callback on all renderedObjects (including children)
             * @param {Array} renderedObjects built the first line of each Header
             * @param {function} callBack callback a function
             * @param {string} params an attribute of renderedObjects
             * @return {Array} renderedObjects the Array with a specific callback
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

            /**
             * @function
             * @description apply a classe at rendererdObjects, by the way of currentId
             * @param {Array} renderedObjcts the array to applied a classe
             * @param {function} callback callback the classe to applied
             * @param {string} currentId the Id of the array
             * @return {Array} renderedObjects the array with applied classe
             */
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
             * @param {Object} rowsTreeNode a node from Rows tree
             * @param {Array} columns the columns array
             * @param {string} rowNumber the number of the row sort
             * @return {Array|string} rows and number
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
             * @param {Array} renderedTreeNode rendered tree node generated by the core
             * @param {string} span initialize the order of the header
             * @return {Array|number} renderedTreeNode and span for recursivity
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
                
                var rows = this._preRenderRows(this.dataprovider.getRows());
                if (rows)
                    this.rows = rows;
                
                if (columns){
                    this.columns = columns;
                    info_debug("column pre-render : " + (new Date() - start));
                    info_debug("columns", columns);

                    this.displayColumns(columns, rows.depth);
                    info_debug("rows pre-render : " + (new Date() - start));
                    info_debug("rows pre-render : ", rows);

                    this.displayData(rows, this.getObjectsGrouped(columns.rendering));
                    info_debug("appendColumns : " + (new Date() - start));
                }

                
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
             * @description Update matrix & headers. This does a full update, and recollect
             * data. NOT UPDATE
             */
            update: function () {
            },

            /**
             * @function
             * @description export matrix to a CSV NOT UPDATE
             * @return true if exported, false if no
             */
            exportToCSV: function () {
            },

            /**
             * @function
             * @description export matrix to a javascript table NOT UPDATE
             * @return true if exported, false if no
             */
            exportMatrix: function () {
            },

            ///////////////
            /// GETTERS ///
            ///////////////

            /**
             * @function
             * @description get the type of the header
             * @param {HTMLElement} headerNode the header with the first letter
             * @return {string} headerNode.type
             */
            getHeaderType: function (headerNode) {
                return headerNode.type;
            },

            /**
             * @function
             * @description get a row with all the data of the central matrix
             * @param {Array} number an Array content the data of the central matrix
             * @return {Array} rowsOjects the row with the data of the central matrix
             */
            getRowObject: function (number) {
                if (!this.rowsObjects) {
                    this.rowsObjects = this._getObjectsFromTree(this.rows.rendering);
                }
                return this.rowsObjects[number];
            },

            /**
             * @function
             * @description get an row with all the data of the central matrix
             * @param {Array} number an row content the data of the central matrix
             * @return {Array} rowsOjects the row with the data of the central matrix
             */
            getRowsObjects: function (numbers) {
                var rowsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    rowsObjects.push(this.getRowObject(numbers[i]));
                }
                return rowsObjects;
            },

            /**
             * @function
             * @description get an column with all the data of the central matrix
             * @param {Array} number an column content the data of the central matrix
             * @return {Array} columnsOjects the column with the data of the central matrix
             */
            getColumnObject: function (number) {
                if (!this.columnsObjects) {
                    this.columnsObjects = this._getObjectsFromTree(this.columns.rendering);
                }
                return this.columnsObjects[number];
            },

            /**
             * @function
             * @description get an column with all the data of the central matrix
             * @param {Array} number an column content the data of the central matrix
             * @return {Array} columnsOjects the column with the data of the central matrix
             */
            getColumnsObjects: function (numbers) {
                var columnsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    columnsObjects.push(this.getColumnObject(numbers[i]));
                }
                return columnsObjects;
            },

            /**
             * @function
             * @description get the number of case of the row array
             * @param {Array} object the row array
             * @return {number} i or -1 the number of case of the row array or the absence
             * of case
             */
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

            /**
             * @function
             * @description get the number of case of the column array
             * @param {Array} object the column array
             * @return {number} i or -1 the number of case of the column array or the absence
             * of case
             */
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

            /**
             * @function
             * @description get all the numbers of the column and set it in a new array
             * @param {Array} columnObjects the column with the numbers to set
             * @return {Array} numbers the arrya with the data numbers
             */
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

            /**
             * @function
             * @description get an array with all the component of an html group
             * @param {Array} renderedObjectstree
             * @return {Array|*} objects return a void if objects doesn't exist
             */
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
             * @description fire event on resize of the matrix NOT UPDATE
             */
            onResize: function () {
            },

            /**
             * @function
             * @description fire event before click on matrix cell NOT UPDATE
             * @return {boolean} true for onCellClick event, false if no
             */
            beforeCellClick: function () {
            },

            /**
             * @function
             * @description proceed at a event when a click are done in a cell
             * @param {Array} rowsNumbers the numbers of the cell in the row
             * @param {Array} columnsNumbers the numbers of the cell in the column
             * @param {HTMLEvent}
             */
            onCellClick: function (rowsNumbers, columnsNumbers, event) {
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
             /**
             * @function
             * @description proceed at a event when the mouse set hover a position
             * @param {Array} rowsNumbers the numbers of the cell in the row
             * @param {Array} columnsNumbers the numbers of the cell in the column
             * @param {HTMLEvent}
             */
            onCellHover: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellHover)
                    this.controller.onCellHover(event);
            },

            /**
             * @function
             * @description proceed at a event when the mouse set over a position
             * @param {Array} rowsNumbers the numbers of the cell in the row
             * @param {Array} columnsNumbers the numbers of the cell in the column
             * @param {HTMLEvent}
             */
            onCellOut: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellOut)
                    this.controller.onCellOut(event);
            },

            /**
             * @function
             * @description NOT UPDATE
             * @return
             */
            onCellRightClick: function () {
            },

            /**
             * @function
             * @description NOT UPDATE
             * @return
             */
            onCellDoubleClick: function () {
            },

            /**
             * @function
             * @description call the function onHeaderClick in the controller, with the event
             * and headerNode attribute
             * @headerNode {HTMLElement} headerNode the header of each columns/rows
             * @param {HTMLEvent} event
             */
            onHeaderClick: function (headerNode, event) {
                if (this.controller.onHeaderClick)
                    this.controller.onHeaderClick(event, headerNode);
            },


            /**
             * @function
             * @description call the function onHeaderHover in the controller, with the event
             * attribute
             * @param {HTMLEvent} event
             */
            onHeaderHover: function (event) {
                if (this.controller.onHeaderHover)
                    this.controller.onHeaderHover(event);
            },

            /**
             * @function
             * @description call the function onHeaderOut in the controller, with the event
             * attribute
             * @param {HTMLEvent} event
             */
            onHeaderOut: function (event) {
                if (this.controller.onHeaderOut)
                    this.controller.onHeaderOut(event);
            },

            /**
             * @function
             * @description NOT UPDATE
             * @return
             */
            onHeaderRightClick: function () {
            },

            /**
             * @function
             * @description NOT UPDATE
             * @return
             */
            onHeaderDoubleClick: function () {
            },

            ///////////////
            /// FILTERS ///
            ///////////////

            /**
             * @function
             * @description filter graphically on rows NOT UPDATE
             * @param {string} filter query
             */
            graphicalRowFilter: function (filter) {
            },

            /**
             * @function
             * @description filter through the data provider NOT UPDATE
             * @param {string} filter query
             */
            dataRowFilter: function (filter) {
            },

            /**
             * @function
             * @description filter graphically on columns NOT UPDATE
             * @param {string} filter query
             */
            graphicalColumnFilter: function (filter) {
            },

            /**
             * @function
             * @description filter thourgh the data provider NOT UPDATE
             * @param {string} filter query
             */
            dataColumnFilter: function (filter) {
            },

            /**
             * @function
             * @description filter graphically on data cells NOT UPDATE
             * @param {string} filter query
             */
            graphicalCellFilter: function (filter) {
            },

            /**
             * @function
             * @description filter through the data provider NOT UPDATE
             * @param {string} filter query
             */
            dataCellFilter: function (filter) {
            },

            ////////////////
            /// Property ///
            ////////////////

            /**
             * @function
             * @description set a value at a property
             * @param {string} propertyName the name of the property
             * @param {string} propertyValue the value to add at the property
             * @return {}
             */
            set: function (propertyName, propertyValue) {
                this[propertyName] = propertyValue;
                return this;
            },

            //////////////////////////////////////
            /// HEADER PROPERTIES MODIFICATION ///
            //////////////////////////////////////

            /**
             * @function
             * @description inverse the state of the Header (open or close)
             * @param {boolean} headerNode.open the inverse state if the Header
             */
            toggleHeader: function (headerNode) {
                if (headerNode.open == false || headerNode.open == "false") {
                    headerNode.open = true;
                } else {
                    headerNode.open = false;
                }
            },

            /**
             * @function
             * @description inverse the state of the Header (hidden or present)
             * @param {boolean} headerNode.hidden the inverse state if the Header
             */
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

            /**
             * @function
             * @description refresh the matric display at the screen on the web page
             * @param {string} gve the type of header (row or column)
             */
            refresh: function (type) {
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

                if (this.columns)
                    this.displayData(this.rows, this.getObjectsGrouped(this.columns.rendering));
                else
                    this.displayData(this.rows);
                console.log("get columns by group");

                this._appendChild(this.workspace, this.container);
                

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
