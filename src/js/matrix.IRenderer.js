var enioka = (enioka || {});

enioka.matrix = (
    function (eniokamatrix) {
        /**
         * @class
         * @memberof enioka.matrix
         * @classdesc will handle HTML rendering with two modules, HTMLRenderer and
         * HTMLEventHandler. It generates an HTML table with an HTMLTemplate to design
         * classes, attributes, and style for each important parts of the table.
         * @param {object} properties
         */
        var IMatrixRenderer = {

            /**
             * @function
             */
            initialize : function() {
                this.HTMLRenderer = new eniokamatrix.HTMLRenderer();
                this.HTMLEventHandler = new eniokamatrix.HTMLEventHandler();
                this.HTMLTemplate = new eniokamatrix.HTMLTemplate();
            },
            /**
             * @function
             * @description Create the html table
             * @param classes you want to append to your table
             * @return html table that has been created
             */
            renderTable : function(classes){
                if (!classes) var classes = [];
                classes.push("matrix");
                return this.HTMLRenderer.createElement("table", classes);
            },

            /**
             * @function
             */
            renderRow : function(label, level, columnCount){
                var row;
                for (var i = 0; i < level; i++){
                    row
                }
                return this.HTMLRenderer.createElementWithText("td",label);
            },

            /**
             * @function
             * @description Inserts paths in intersection, type of cell has to be specified by
             * CellData Object
             * @param {enioka.matrix.Core.DataHeader} cell DataCell object
             * @return html table that has been created
             */
            renderCells : function(cells){
            },

            /**
             * @function
             * @description Create HTML columns from an array
             * @param columns as an array containing DataHeader objects
             * @return table created
             */
            renderRows : function(rows){
            },

            /**
             * @function
             * @description Create HTML columns from an array
             * @param columns as an array containing DataHeader objects
             * @return table created
             */
            renderColumns : function(columns){
            },

            /**
             * @function
             * @description Create HTML column level from an array
             * @return table created
             */
            renderColumnLevel : function(columns){
            },

            /**
             * @function
             * @description Create HTML columns container from an array
             * @return table created
             */
            renderColumnContainer : function(){
            },

            /**
             * @function
             * @description Get fathers to help build array returned
             * @return {array} contains all fathers, hierarchically like [great grandfather, grandfather, father]
             */
            getFather : function(object){
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        IMatrixRenderer = Class.create(IMatrixRenderer);

        eniokamatrix.IMatrixRenderer = IMatrixRenderer;


        return eniokamatrix;
    }(enioka.matrix || {})
);
