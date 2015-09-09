var enioka = (enioka || {});

/**
 * @namespace enioka
 */

/**
 * @namespace matrix
 * @memberof enioka
 */

enioka.matrix = (
    function (eniokamatrix) {
        /**
         * @class
         * @memberof enioka.matrix
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
                    this.setController(new eniokamatrix.IController());
                    this.setRenderer(new eniokamatrix.IMatrixRenderer());
                    this.setDataProvider(new eniokamatrix.IDataProvider());
                    return;
                } else {
                    for (var prop in properties){
                        this[prop] = properties[prop];
                    }
                }
            },

            /**
             * @memberof enioka.matrix.Core
             * @member {interface} dataProvider
             */
            dataProvider : null,
            /**
             * @memberof enioka.matrix.Core
             * @member {interface} controller
             */
            controller : null,
            /**
             * @memberof enioka.matrix.Core
             * @member {object} controller
             */
            renderer : null,
            /**
             * @memberof enioka.matrix.Core
             * @member {object} cache
             */
            cache : null,
            /**
             * @memberof enioka.matrix.Core
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
                    this.dataProvider = new eniokamatrix.IDataProvider(this);
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
                    this.controller = new eniokamatrix.IController(this);
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
                    this.renderer = new eniokamatrix.IMatrixRenderer(this);
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
             * @description get the columns through DataProvider interface and instanciate them
             * as DataHeader objects
             */
            getColumns : function(){
                return this.dataProvider.getColumns();
            },

            /**
             * @function
             * @description get the rows through DataProvider interface and instanciate them a
             * DataHeader objects
             */
            getRows : function(){
                return this.dataProvider.getRows();
            },

            /**
             * @function
             * @description get the cells through DataProvider interface and instanciate them as
             * DataCell objects
             */
            getData : function(){
                return this.dataProvider.getData();
            },

            /**
             * @function
             * @description Display columns
             */
            displayColumns : function(){
                var columns = this.getColumns();
                if (columns){
                    for (var column in columns){
                        this._displayColumn(column);
                    }
                    return 1;
                } else
                    return 0;
            },

            /**
             * @function
             * @description Display rows
             */
            displayRows : function(){
                var rows = this.getRows();
                if (rows) {
                    for (var row in rows){
                        this.renderer.renderRows(this.getRows());
                    }
                    return 1;
                } else
                    return 0;
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
                }
                else
                    return 0;
            },

            /**
             * @function
             * @description Display gather all other display and print it
             */
            display : function(){
                this.displayColumns();
                this.displayRows();
                this.displayCells();
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
            }
        };
        Core = Class.create(Core);

        eniokamatrix.Core = Core;

        // And the capability to extend these predefined classes
        eniokamatrix.extend = Class.extend;

        return eniokamatrix;
    }(enioka.matrix || {})
);
