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
             * @description Render row and get back its fathers. By default no father is given
             * @return {Array} Contains hierarchical structure for the row headers, with
             * following attributes : <br/> - id<br/> - label<br/> - order<br/> - rendering <br/> and what you may need
             */
            renderRow : function(rowObject){
            },

            /**
             * @function
             * @description Render row container where a row will be append to
             * @return {HTMLElement}
             */
            renderRowContainer : function(){
            }

            /**
             * @function
             * @description Render rows Container where all the rows will be appened to
             * @return {HTMLElement}
             */
            renderRowsContainer : function(){
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
            renderColumn : function(columnObject){
            },

            /**
             * @function
             * @description Render sub total header for each group
             * @return {HTMLElement}
             */
            renderSubTotalHeader : function(label){
            },

            /**
             * @function
             * @description Render Left upper corner, essential for a well displayed HTML Table
             * @return {HTMLElement}
             */
            renderLeftUpperCorner : function(){
            },

            /**
             * @function
             * @description Render a level for columns may be represented by a HTML table tr
             * or simply a line
             * @return {HTMLElement}
             */
            renderColumnsLevelContainer : function(){
            },

            /**
             * @function
             * @description Render a columns container in which all the columns will be appened to
             * @return {HTMLElement}
             */
            renderColumnsContainer : function(){
            },

            /**
             * @function
             * @description render container for all rendered objects. Core will put together
             * all rendered object in a sigle one ; this one.
             * @return {HTMLElement}
             */
            renderContainer : function(){
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        IIJRenderer = Class.create(IIJRenderer);

        eniokaij.IIJRenderer = IIJRenderer;


        return eniokaij;
    }(enioka.ij || {})
);
