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

            initialize : function(){
                this.renderer = new enioka.ij.HTMLRenderer();
                this.template = new enioka.ij.HTMLTemplate();
            },

            /**
             * @function
             * @description Render rows Container where all the rows will be appened to
             * @return {HTMLElement}
             */
            renderRowsContainer : function(){
            },

            /**
             * @function
             * @description Render row and get back its fathers. By default no father is given
             * @return {Array} Contains hierarchical structure for the row headers, with
             * following attributes : <br/> - id<br/> - label<br/> - order<br/> - rendering <br/> and what you may need
             */
            renderRow : function(rowObject){
            },

            applyRowSpan : function(renderedObject, property){
            },

            applyColSpan : function(renderedObject, property){
            },

            /**
             * @function
             * @description Render row container where a row will be append to
             * @return {HTMLElement}
             */
            renderRowContainer : function(){
            },

            renderSubTotalHeader : function(label){
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
            renderColumn : function(columnObject) {
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
             * @description Render Left upper corner, essential for a well displayed HTML Table
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
             * @description Render cell
             */
            renderCell : function(row, column, cellData){
            },

            /**
             * @function
             * @description render container for all rendered objects. Core will put together
             * all rendered object in a sigle one ; this one.
             * @return {HTMLElement}
             */
            renderContainer : function(){
            },

            setCSSProperty : function(property, element, propertyValue){
            },

            emptyCSSProperty : function(property, element){
            },

            addClasses : function(element, elementType, classes){
            },


            /**
             * @function
             * @description
             * @param rendering
             * @returns {*}
             */
            getRenderingId : function(rendering){
                return rendering.id;
            },

            /**
             * @function
             * @description
             * @param rendering
             * @returns {DOMTokenList}
             */
            getRenderingClasses : function(rendering){
                return rendering.classList;
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderRowsContainer : function(){
            },

            /**
             * @function
             * @description
             * @param rowObject
             * @param rowNumber
             * @returns {Array}
             */
            renderRow : function(rowObject, rowNumber){
            },

            /**
             * @function
             * @description
             * @param renderedObject
             * @param property
             * @returns {*}
             */
            applyRowSpan : function(renderedObject, property){
            },

            /**
             * @function
             * @descrpition
             * @param renderedObject
             * @param property
             * @returns {*}
             */
            applyColSpan : function(renderedObject, property){
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderRowContainer : function(){
            },

            /**
             * @function
             * @descrption
             * @param label
             * @returns {*}
             */
            renderSubTotalHeader : function(label){
            },

            /**
             * @function
             * @description
             * @param columnObject
             * @param columnNumber
             * @returns {Array}
             */
            renderColumn : function(columnObject, columnNumber) {
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderLeftUpperCorner : function(){
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderColumnsLevelContainer : function(){
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderColumnsContainer : function(){
            },

            /**
             * @function
             * @descrpition
             * @param renderedObject
             * @returns {*|{id, object, label, order, rendering, open, visible}}
             */
            renderSummary : function(renderedObject){
            },

            /**
             * @function
             * @description
             * @param rowsNumbers
             * @param columnsNumbers
             * @param cellData
             * @param eventsCallBacks
             * @returns {*}
             */
            renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
            },

            /**
             * @function
             * @description
             * @param cellData
             * @returns {*}
             * @private
             */
            _getSummaryHoverCell : function(cellData){
            },

            /**
             * @function
             * @description
             * @param element
             * @param child
             * @returns {*|Node|XML}
             */
            appendChild : function(element, child) {
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderContainer : function(){
            },

            /**
             * @function
             * @description
             * @param property
             * @param element
             * @param propertyValue
             * @returns {*|void}
             */
            setCSSProperty : function(property, element, propertyValue){
            },

            /**
             * @function
             * @description
             * @param property
             * @param element
             * @returns {*|void}
             */
            emptyCSSProperty : function(property, element){
            },

            /**
             * @function
             * @description
             * @param element
             * @param elementType
             * @param classes
             * @returns {*}
             */
            addClasses : function(element, elementType, classes){
            },

            /**
             * @function
             * @description
             * @param element
             * @param id
             * @returns {*}
             */
            setId : function(element, id){
            },

            /**
             * @function
             * @description
             * @param type
             * @returns {*|string}
             */
            getClassPrefix : function(type){
            },

            /**
             * @function
             * @description
             * @param type
             * @returns {*|string}
             */
            getIdPrefix : function(type){
            },

            /**
             * @function
             * @description add eventsListeners for the rendering
             * @param rendering {object}
             * @param events {object} containing events available for the rendering following this partern :
             *  - eventName : event
             * @returns {Node|*}
             */
            addEventsToRendering : function(rendering, events){
            },

            /**
             * @function
             * @description clear output (DOM element or buffer)
             * @param output {Object}
             */
            clearOutput : function(output) {
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        IIJRenderer = Class.create(IIJRenderer);

        eniokaij.IIJRenderer = IIJRenderer;


        return eniokaij;
    }(enioka.ij || {})
);
