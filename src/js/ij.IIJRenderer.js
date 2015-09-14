var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij
         * @classdesc will handle rendering with two modules, HTMLRenderer and
         * HTMLEventHandler. It generates an HTML table with an HTMLTemplate to design
         * classes, attributes, and style for each important parts of the table.
         * @param {object} properties
         */
        var IIJRenderer = {

            /**
             * @function
             */
            initialize : function() {
                this.Renderer = new eniokaij.HTMLRenderer();
                this.Template = new eniokaij.HTMLTemplate();
            },
            /**
             * @function
             * @description Create the html table
             * @param {Array} classes - you want to append to your table
             * @return html table that has been created
             */
            renderTable : function(classes){
                if (!classes) var classes = [];
                classes.push("matrix");
                return this.HTMLRenderer.createElement("table", classes);
            },

            /**
             * @function
             * @description Render row and get back its fathers. By default no father is given
             * @return {Array} Contains hierarchical structure for the row headers, with
             * following attributes : <br/> - id<br/> - label<br/> - order<br/> - rendering <br/>
             */
            renderRow : function(object){
                var row;
                for (var i = 0; i < level; i++){

                }
                return this.HTMLRenderer.createElementWithText("td",label);
            },

            /**
             * @function
             * @description Render columns with pre-rendered column array by @renderColummn
             * @param {Array} columns - Contains columns as DataHeaders
             * @return {HTMLElement} Contains the rendering of columns
             */
            renderColumns : function(columns){
            },

            /**
             * @function
             * @description Render columns with pre-rendered rows array by @renderColummn
             * @param {Array} rows - Contains rows as DataHeaders
             * @return {HTMLElement} Contains the rendering for rows & data
             */
            renderRows : function(rows){
            },

            /**
             * @function
             * @description Render cells
             * @param {Object} cell - Cells we want to render
             */
            renderCells : function(cells){
            },

            /**
             * @function
             * @description Render row and get back its fathers. By default no father is given
             * @return {Array} Contains hierarchical structure for the column headers, with following attributes :
             *  - id
             *  - label
             *  - order
             *  - rendering
             */
            renderColumn : function(object){
            },

            /**
             * @function
             * @description Create HTML columns container from an array
             * @return table created
             */
            renderColumnContainer : function(){
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        IIJRenderer = Class.create(IIJRenderer);

        eniokaij.IIJRenderer = IIJRenderer;


        return eniokaij;
    }(enioka.ij || {})
);
