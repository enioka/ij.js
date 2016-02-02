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

            /**
             * @function
             * @description init function
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
             * @description expose user controller implemented interface to the core
             * @param {object} controller object that should contain generics methods
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
                    parent = new Array();
                _scope.root = new Array();
                for (var i = 0; i < renderedObjects.length; i++) {
                    //set the parrent root at the initial array (level 0)
                    var childMap = new Array(),
                        parentRoot = _scope.root,
                        currentID = new String();
                    for (var j = 0; j < renderedObjects[i].length; j++) {
                        //retrieve root if it exists for the new root
                        if (!parent[renderedObjects[i][j].id])
                            parent[renderedObjects[i][j].id] = currentID;
                        //if renderedObjects is unique
                        else if (!renderedObjects[i][j].cannotReRoot) {
                            currentID = parent[renderedObjects[i][j].id];
                        }
                        currentID += renderedObjects[i][j].id;
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
                                if (renderedObjects[i][j].object) {
                                    renderedObjects[i][j].children.push(
                                        this._cloneHeader(renderedObjects[i][j],
                                                          type)
                                    );
                                    delete renderedObjects[i][j].object;
                                }
                                //check if there is property to hide summaries
                                if (renderedObjects[i][j].hasSummary) {
                                    var summary =
                                        this.renderer.renderSummary(renderedObjects[i][j],
                                                                    type);
                                    //identify this as a summary
                                    summary.summary = true;
                                    renderedObjects[i][j].children.push(
                                        summary
                                    );
                                }
                            }
                            map[currentID] = renderedObjects[i][j];
                        } else {
                            if (j > 0) {
                                var found = false;
                                //not a for for each case in table beacause some may have been
                                //relocated to new root
                                for (var k in parentRoot) {
                                    if (parentRoot[k].id &&
                                        parentRoot[k].id == renderedObjects[i][j].id) {
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
                            //If there is at least on child
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

            /**
             * @function
             * @description Delete node
             * @param {Number} nodeId node id which gonna be deleted
             * @param {Object} Node in which the children has to be deleted
             */
            _deleteNode: function (nodeId, node) {
                for (var id in node) {
                    if (node[id].id == nodeId)
                        delete node[id];
                    else if (node[id].children)
                        this._deleteNode(nodeId, node[id].children);
                }
            },

            /**
             * @function
             * @description Clone node without reference
             * @param {Object} header Header to clone
             * @param {String} type of the header to clone (rowHeader, columnHeader)
             * @return {Object} duplicatedHeader cloned header
             */
            _cloneHeader: function (header, type) {
                var duplicatedHeader = {};
                for (var attr in header) {
                    if (attr == "label")
                        duplicatedHeader[attr] = header[attr] + " [object]";
                    else if (attr == "children")
                        continue;
                    else if (attr == "order")
                        duplicatedHeader[attr] = -1;
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
             * @return {Array} root tree sorted by order property
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
                if (ordered["-1"])
                    root = root.concat(this.alphabeticalSort(ordered["-1"]));
                for (var id in ordered) {
                    if (id != -1)
                        root = root.concat(this.alphabeticalSort(ordered[id]));
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
                if (this.sort)
                return array.sort(
                    function compare(a, b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        return 0;
                    }
                );
                else
                    return array;
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
             * @description populate summaries with reference to parent object
             * @param {Object} treeNode in which you have to populate summaries (if there is !)
             */
            populateSummaries : function(treeNode){
                for (var id in treeNode) {
                    if (treeNode[id].hasSummary && treeNode[id].open == true){
                        treeNode[id].children[treeNode[id].children.length - 1].object = new Array();
                        var objects = this._getObjectsFromTree(treeNode[id].children, false);
                        treeNode[id].children[treeNode[id].children.length - 1].object = objects;
                    }
                    if (treeNode[id].children && treeNode[id].open == true)
                        this.populateSummaries(treeNode[id].children);
                }
            },

            /**
             * @function
             * @description Build columns rendering necessary components
             * @param {Array} columns array containing all columns objects
             * @param {Object} properties object containing some directives to modify default behavior
             * @return {Object} object containing columnsDepth and columnsTree
             */
            _preRenderColumns: function (columns, properties) {
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
                    //means no columns objects
                    return;
                }
                for (var id in renderedColumns) {
                    renderedColumns[id] =
                        this.getGroupSpan(renderedColumns[id]).renderedTreeNode;
                }
                if (!this.hideSummaries)
                    this.populateSummaries(renderedColumns);
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
                                  null,
                                  properties);
                console.profileEnd();
                return {
                    "depth": columnsDepth,
                    "rendering": renderedColumns
                };
            },

            /**
             * @function
             * @description display the columns in the container / workspace
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
                    renderedColumns[id] =
                        this.renderer.reRenderColumn(renderedColumns[id],
                                                     this._getHeaderEventsCallbacks(
                                                         renderedColumns[id]
                                                     )
                                                    );
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

            /** @function
             * @description Build rows rendering necessary components
             * @param {Array} rows array containing all columns objects
             * @param {Object} properties object containing some directives to modify default behavior
             * @return {Object} object containing columnsDepth and columnsTree
             */
            _preRenderRows: function (rows, properties) {
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
                if (!this.hideSummaries)
                    this.populateSummaries(renderedRows);
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
                                  .bind(this.renderer),
                                  null,
                                  properties);
                console.profileEnd();
                return {
                    "depth": rowsDepth,
                    "rendering": renderedRows
                };
            },

            /**
             * @function
             * @description Call the function to display data into container
             * @param {Array} rows the rows objects
             * @param {Array} columns the data columns to display
             */
            displayData: function (rows, columns) {
                if (!this.container)
                    this.container = this.renderer.renderContainer();
                var rowsContainer = this.renderer.renderRowsContainer();
                //Find a better way to do that
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
             * @param {Array} renderedObjects renderedObjects on which function has to be applied
             * @param {function} callBack callback function that has to be applied on each renderedObject
             * @param {string} params for the callback function
             * @return {Array} renderedObjects with function applied
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
             * @description apply a classe at rendererdObjects
             * @param {Array} renderedObjcts the array to applied a classe
             * @param {function} callback function to apply class
             * @param {string} currentId current row / column Number
             * @param {Object} properties contains properties to modify default behavior
             * @return {Object} renderedObjects with applied classes
             */
            applyClasses: function (renderedObjects, callback, currentId, properties) {
                if (!currentId)
                    var currentId = 0;
                for (var id in renderedObjects) {
                    var classes = new Array();
                    //if this is a group
                    if (renderedObjects[id].children) {
                        this.applyClasses(renderedObjects[id].children,
                                          callback,
                                          currentId,
                                          properties);
                        //if group is closed, only add a line
                        if (renderedObjects[id].group == true &&
                            renderedObjects[id].open == false)
                            var nextId = currentId + 1;
                        //else add the length
                        else
                            var nextId = currentId +
                                this.getObjectsGrouped(renderedObjects[id].children).length;
                        for (var i = currentId; i < nextId; i++) {
                            classes.push(i);
                        }
                        //else check if there is an object
                    } else if (renderedObjects[id].object != undefined) {
                        var nextId = currentId + 1;
                        for (var i = currentId; i < nextId; i++) {
                            classes.push(i);
                        }
                    }

                    currentId = nextId;
                    renderedObjects[id].rendering = callback(renderedObjects[id].rendering,
                                                             renderedObjects[id].type,
                                                             classes,
                                                             properties);
                }
                return renderedObjects;
            },

            /**
             * @function
             * @description build rows array, each index contains a row
             * @param {Object} rowsTreeNode a node from Rows tree
             * @param {Array} columns columns objects in an array
             * @param {Number} rowNumber current row number
             * @return {Array|string} rows Array and number
             */
            buildRows: function (rowsTreeNode, columns, rowNumber) {
                if (!rowNumber)
                    var rowNumber = 0;
                var rows = new Array();
                if (rowsTreeNode.length > 0)
                    for (var id in rowsTreeNode) {
                        var row = this.renderer.renderRowContainer();
                        if (rowsTreeNode[id].children &&
                            (rowsTreeNode[id].open == "false" ||
                             rowsTreeNode[id].open == false)
                           ) {
                            rowsTreeNode[id].rendering = this.renderer.applyRowSpan(
                                rowsTreeNode[id].rendering,
                                2);
                        }
                        rowsTreeNode[id] =
                            this.renderer.reRenderRow(rowsTreeNode[id],
                                                      this._getHeaderEventsCallbacks(
                                                          rowsTreeNode[id]
                                                      )
                                                     );
                        this._appendChild(row, rowsTreeNode[id].rendering);
                        if (rowsTreeNode[id].summary){
                            var rowData = this._renderRowSummary(columns,
                                                                 rowNumber,
                                                                 rowsTreeNode[id]);
                            this._appendChildren(row, rowData);
                            rowNumber++;
                            rows.push(row);
                        } else if (rowsTreeNode[id].object) {
                            var rowData = this._renderRowData(columns,
                                                              rowNumber,
                                                              rowsTreeNode[id]);
                            this._appendChildren(row, rowData);
                            rowNumber++;
                            rows.push(row);
                        } else if (rowsTreeNode[id].children &&
                                   (rowsTreeNode[id].open != "false" &&
                                    rowsTreeNode[id].open != false)) {
                            rows.push(row);
                            var builtRows = this.buildRows(rowsTreeNode[id].children,
                                                           columns,
                                                           rowNumber);
                            rows = rows.concat(builtRows.rows);
                            rowNumber = builtRows.rowNumber;
                        } else {
                            rows.push(row);
                            var rowsData = this._renderAggregateRowData(columns,
                                                                        rowNumber,
                                                                        rowsTreeNode[id]);
                            rowNumber++;
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
             * @description rendered aggregated row
             * @param {Array} columns array containing all columns Objects by group
             * @param {Number} rowNumber current row number
             * @param {Object} rowsTreeNode current treeNode
             * @return {Array} rows containing the row just rendered
             */
            _renderAggregateRowData: function (columns, rowNumber, rowsTreeNode) {
                var rows = new Array(),
                    cells = new Array(),
                    row = this.renderer.renderRowContainer(),
                    columnsNumbers = this.getColumnsNumbersFromObjects(columns);
                for (var i = 0; i < columnsNumbers.length; i++) {
                    var cellData = this.dataprovider.getData(this._getObjectsFromTree(rowsTreeNode.children, false),
                                                             (columns[i].object ||
                                                              columns[i].summary ||
                                                              columns[i].group),
                                                             null,
                                                             {group:true});
                    cells.push(this.renderer.renderCell([rowNumber],
                                                        columnsNumbers[i],
                                                        cellData,
                                                        this._getCellEventsCallbacks(
                                                            [rowNumber],
                                                            columnsNumbers[i])));
                }
                this._appendChildren(row, cells);
                rows.push(row);
                return rows;
            },

            /**
             * @function
             * @description rendered row
             * @param {Array} columns array containing all columns Objects by group
             * @param {Number} rowNumber current row number
             * @param {Object} rowsTreeNode current treeNode
             * @return {Array} cells containing the cells just rendered
             */
            _renderRowData: function (columns, rowNumber, renderedRow) {
                var columnsNumbers = this.getColumnsNumbersFromObjects(columns),
                    cells = new Array(),
                    rowsNumbers = [rowNumber];
                for (var i = 0; i < columnsNumbers.length; i++) {
                    var cellData = this.dataprovider.getData([renderedRow.object],
                                                             (columns[i].object ||
                                                              columns[i].summary ||
                                                              columns[i].group));
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
             * @description rendered row summary
             * @param {Array} columns array containing all columns Objects by group
             * @param {Number} rowNumber current row number
             * @param {Object} rowsTreeNode current treeNode
             * @return {Array} cells containing the row just rendered
             */
            _renderRowSummary : function(columns, rowNumber, rowsTreeNode){
                var columnsNumbers = this.getColumnsNumbersFromObjects(columns),
                    cells = new Array(),
                    rowsNumbers = new Array();
                rowsNumbers.push(rowNumber);
                for (var i = 0; i < columnsNumbers.length; i++) {
                    var cellData = this.dataprovider.getData(rowsTreeNode.object,
                                                             (columns[i].object ||
                                                              columns[i].summary ||
                                                              columns[i].group),
                                                             null,
                                                             {summary : true});
                    cells.push(this.renderer.renderCell(rowsNumbers,
                                                        columnsNumbers[i],
                                                        cellData,
                                                        this._getCellEventsCallbacks(
                                                            rowsNumbers,
                                                            columnsNumbers[i])));
                }
                return cells;
            },

            _appendChild: function (element, child) {
                return this.renderer.appendChild(element, child);
            },

            _appendChildren: function (element, children) {
                for (var i = 0; i < children.length; i++) {
                    this._appendChild(element, children[i]);
                }
                return element;
            },

            /**
             * @function
             * @description Retrieve group span for headers
             * @param {Array} renderedTreeNode node
             * @param {string} span current span during the recursivity
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
             * @description Display gather all other function to display rendering into the workspace
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
                console.log("appendData & pre-display : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);
                console.log("displayed : " + (new Date() - start));
                console.log("rows & columns structures :");
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

            update: function () {
            },

            exportToCSV: function () {
            },

            exportMatrix: function () {
            },

            ///////////////
            /// GETTERS ///
            ///////////////

            /**
             * @function
             * @description get the type of the header
             * @param {object} headerNode the cell object
             * @return {string} type headerNode type
             */
            getHeaderType: function (headerNode) {
                return headerNode.type;
            },

            /**
             * @function
             * @description get a row object from its number
             * @param {number} number of the row wanted
             * @return {string} rowObject
             */
            getRowObject: function (number, summary) {
                var object = this.getObjectsGrouped(this.rows.rendering, summary)[number];
                return (object.object ||
                        object.summary ||
                        object.group);
            },

            /**
             * @function
             * @description get row header array
             * @param {numbers} numbers of the row objects wanted
             * @return {Array} rowsObjects containing all the rows objects correponding to the numbers given in parameter
             */
            getRowsObjects: function (numbers, summary) {
                var rowsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    var objects = this.getRowObject(numbers[i], summary);
                    if (objects instanceof Array)
                        rowsObjects = rowsObjects.concat(objects);
                    else
                        rowsObjects.push(objects);
                }
                return rowsObjects;
            },

            /**
             * @function
             * @description get a column object from its number
             * @param {number} number of the column wanted
             * @return {string} columnObject
             */
            getColumnObject: function (number, summary) {
                var object = this.getObjectsGrouped(this.columns.rendering)[number];
                return (object.object ||
                        object.summary ||
                        object.group);
            },


           /**
             * @function
             * @description get row header array
             * @param {numbers} numbers of the column objects wanted
             * @return {Array} rowsObjects containing all the rows objects correponding to the numbers given in parameter
             */
            getColumnsObjects: function (numbers, summary) {
                var columnsObjects = new Array();
                for (var i = 0; i < numbers.length; i++) {
                    var objects = this.getColumnObject(numbers[i], summary);
                    if (objects instanceof Array)
                        columnsObjects = columnsObjects.concat(objects);
                    else
                        columnsObjects.push(objects);
                }
                return columnsObjects;
            },

            /**
             * @function
             * @description get all the numbers of columns
             * @param {Array} columnObjects the node with the numbers we want (root)
             * @return {Array} numbers array
             */
            getColumnsNumbersFromObjects: function (columnsObjects) {
                var numbers = new Array(),
                    lastNumber = 0,
                    map;
                for (var i = 0; i < columnsObjects.length; i++) {
                    numbers[i] = new Array();
                    numbers[i].push(i);
                }
                return numbers;
            },

            /**
             * @function
             * @description Retrieve an array with grouped objects
             * @param {Array} renderedObjectstree an array of objects
             * @return {Array|*} objects return a void if objects doesn't exist
             * or an array objects
             */
            getObjectsGrouped: function (renderedObjectsTree) {
                var objects = [];
                if (typeof renderedObjectsTree == undefined)
                    return [];
                else {
                    for (var id in renderedObjectsTree) {
                        if ((renderedObjectsTree[id].open == false ||
                             renderedObjectsTree[id].open == "false") &&
                            renderedObjectsTree[id].children) {
                            objects.push({"group" : this._getObjectsFromTree(renderedObjectsTree[id].children)});
                        } else if (renderedObjectsTree[id].children) {
                            var childrenObjects = this.getObjectsGrouped(renderedObjectsTree[id].children);
                            if (childrenObjects)
                                objects = objects.concat(childrenObjects);
                        } else if (renderedObjectsTree[id].summary){
                            objects.push({"summary" : renderedObjectsTree[id].object});
                        } else if (renderedObjectsTree[id].object != undefined) {
                            objects.push({"object" : [renderedObjectsTree[id].object]});
                        }
                    }
                }
                if (objects.length == 0)
                    return;
                return objects;
            },

            /**
             * @function
             * @description retrieve all objects in a flat array
             * @param {Object} renderedObjectsTree node from which we want objects
             * @param {Object} summary param specifying if it must include objects from summaries
             * @return {Array} objects flat array containing objects
             */
            _getObjectsFromTree: function (renderedObjectsTree, summary) {
                var objects = new Array();
                for (var id in renderedObjectsTree) {
                    if (summary == true &&
                        renderedObjectsTree[id].summary &&
                        renderedObjectsTree[id].object)
                        objects = objects.concat(renderedObjectsTree[id].object);
                    else if (renderedObjectsTree[id].object &&
                             !renderedObjectsTree[id].summary)
                        objects.push(renderedObjectsTree[id].object);
                    if (renderedObjectsTree[id].children)
                        objects = objects.concat(this._getObjectsFromTree(
                            renderedObjectsTree[id].children, summary));
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
             * @description event when a click is done on a cell
             * @param {Array} rowsNumbers row number(s)
             * @param {Array} columnsNumbers column number(s)
             * @param {HTMLEvent}
             */
            onCellClick: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellClick) {
                    this.controller.onCellClick(event,
                                                this.dataprovider.getData(
                                                    this.getRowsObjects(rowsNumbers, true),
                                                    this.getColumnsObjects(columnsNumbers, true)
                                                ),
                                                this.getRowsObjects(rowsNumbers, true),
                                                this.getColumnsObjects(columnsNumbers, true)
                                               );
                }
            },

            /**
             * @function
             * @description event when a hover done on a cell
             * @param {Array} rowsNumbers row number(s)
             * @param {Array} columnsNumbers column number(s)
             * @param {HTMLEvent}
             */
            onCellHover: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellHover)
                    this.controller.onCellHover(event,
                                                this.dataprovider.getData(
                                                    this.getRowsObjects(rowsNumbers, true),
                                                    this.getColumnsObjects(columnsNumbers, true)
                                                ),
                                                this.getRowsObjects(rowsNumbers, true),
                                                this.getColumnsObjects(columnsNumbers, true)
                                               );
            },

            /**
             * @function
             * @description event when a hover is out on a cell
             * @param {Array} rowsNumbers row number(s)
             * @param {Array} columnsNumbers column number(s)
             * @param {HTMLEvent}
             */
            onCellOut: function (rowsNumbers, columnsNumbers, event) {
                if (this.controller.onCellOut)
                    this.controller.onCellOut(event,
                                              this.dataprovider.getData(
                                                  this.getRowsObjects(rowsNumbers, true),
                                                  this.getColumnsObjects(columnsNumbers, true)
                                              ),
                                              this.getRowsObjects(rowsNumbers, true),
                                              this.getColumnsObjects(columnsNumbers, true)
                                             );
            },

            /**
             * @function
             * @description event right click on cell //NYI
             */
            onCellRightClick: function () {
            },

            /**
             * @function
             * @description event double click on cell //NYI
             */
            onCellDoubleClick: function () {
            },

            /**
             * @function
             * @description trigger event when click is done
             * @headerNode {Object} headerNode node object just clicked
             * @param {HTMLEvent} event
             */
            onHeaderClick: function (headerNode, event) {
                if (this.controller.onHeaderClick)
                    this.controller.onHeaderClick(event, headerNode);
            },


            /**
             * @function
             * @description event hover on header
             * @headerNode {Object} headerNode node object
             * @param {HTMLEvent} event
             */
            onHeaderHover: function (headerNode, event) {
                if (this.controller.onHeaderHover)
                    this.controller.onHeaderHover(event, headerNode);
            },

            /**
             * @function
             * @description When hover on headerNode
             * @headerNode {Object} headerNode node object
             * @param {HTMLEvent} event
             */
            onHeaderOut: function (headerNode, event) {
                if (this.controller.onHeaderOut)
                    this.controller.onHeaderOut(event, headerNode);
            },

            /**
             * @function
             * @description event right click on header
             */
            onHeaderRightClick: function () {
            },

            /**
             * @function
             * @description event double click on header
             */
            onHeaderDoubleClick: function () {
            },

            ///////////////
            /// FILTERS ///
            ///////////////

            graphicalRowFilter: function (filter) {
            },

            dataRowFilter: function (filter) {
            },

            graphicalColumnFilter: function (filter) {
            },

            dataColumnFilter: function (filter) {
            },

            graphicalCellFilter: function (filter) {
            },

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
             * @return {Object}
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
             * @param {Object} headerNode header node to toggle
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
             * @description inverse the state of the Header (hidden or present) NYI
             * @param {Object} headerNode header node to hide
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
             * @description refresh the matrix
             * @param {string} give the header type to refresh
             */
            refresh: function (type) {
                var start = new Date();
                this.renderer.clearOutput(this.workspace);
                this.container = this.renderer.renderContainer();
                if (type == "columnHeader") {
                    var columns = this._preRenderColumns(null, {reset : true});
                    this.columns = columns;
                } else if (type == "rowHeader") {
                    var rows = this._preRenderRows(null, {reset : true});
                    this.rows = rows;
                }
                if (this.columns)
                    this.displayColumns(this.columns, this.rows.depth);
                console.log("appendColumns : " + (new Date() - start));
                if (this.columns)
                    this.displayData(this.rows, this.getObjectsGrouped(this.columns.rendering));
                else
                    this.displayData(this.rows);
                console.log("get columns by group");
                console.log("appendData & pre-display : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);
                console.log("displayed : " + (new Date() - start));
                this._appendChild(this.workspace, this.container);

                console.log(this.rows, this.columns);
            }
        };
        Core = Class.create(Core);

        eniokaij.Core = Core;

        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
