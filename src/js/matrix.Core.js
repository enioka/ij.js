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
                    this.setCache(new eniokamatrix.Cache());
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
                this.workspace = workspace;
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
             * @param cache implemented to getData
             * @return controller implemented.
             */
            setCache : function(cache){
                if (cache)
                    this.cache = cache;
                else
                    this.controller = new eniokamatrix.Cache();
                return this.cache;
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
             * @return true or false if dependencies are wheter or not set
             */
            _checkDependencies : function() {
                console.log("Something is missing : ");
                console.log("Checking DataProvider : ", this.dataProvider);
                console.log("Checking controller : ", this.controller);
                console.log("Checking DataProvider : ", this.renderer);
                console.log("Checking Workspace : ", this.workspace);
                console.log("Checking DataHandler : ", this.dataHandler);
                console.log("Checking Cache : ", this.Cache);
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
                for (var column in columns){
                    this._displayColumn(column);
                }
            },

            /**
             * @function
             * @description Display rows
             */
            displayRows : function(){
                this.getWorkspace().appendChild(
                    this.renderer.renderRows(this.getRows())
                );
            },

            /**
             * @function
             * @description Fill cells with a value
             */
            displayCells : function(){
                this.renderer.renderCells(this.getData());
            },

            /**
             * @function
             * @description Display gather all other display and print it
             */
            display : function(){
                this.displayRows();
                this.displayColumns();
                this.displayCells();
            },

            /**
             * @function
             * @description Update matrix & headers. This does a full update, and recollect data
             * through the data provider callbacks
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
            }
        };
        Core = Class.create(Core);

        eniokamatrix.Core = Core;

        return eniokamatrix;
    }(enioka.matrix || {})
);
