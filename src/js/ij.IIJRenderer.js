var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij
         * @classdesc Will handle rendering with two modules : 
         *                    -HTMLRenderer who gives a HTML value at the element of the head of columns and rows.
         *                    -HTMLEventHandler who gives a HTML class and id at the head of columns and rows.
         *            The renderer has all the specifics functions for create the Headers of the columns and rows 
         *            and access/modify HTMLclass/CSSProperty.
         * @param {object} properties
         */
        var IIJRenderer = {

            initialize : function(){
                this.renderer = new enioka.ij.HTMLRenderer();
                this.template = new enioka.ij.HTMLTemplate();
            },

            /**
             * @function
             * @description create a HTMl element of type tbody
             * @return {HTMLElement} an element with a HTML type
             */
            renderRowsContainer : function(){
            },

            /**
             *@function
             *@description add an attribute name rowspan at renderedObject with the value property
             *@param {HTMLElement} renderObject element HTML statement
             *@param {string} property value of the attribute rowspan
             *@return {HTMLElement} renderObject with a attribute rowspan
             */
            applyRowSpan : function(renderedObject, property){
            },

            /**
             *@function
             *@description add an attribute name colspan at renderedObject with the value property
             *@param {HTMLElement} renderObject element HTML statement
             *@param {string} property value of the attribute colspan
             *@return {HTMLElement} renderObject with a attribute colspan
             */
            applyColSpan : function(renderedObject, property){
            },

            /**
             * @function
             * @description return a variable where is create a new html class : tr
             * @return {HTMLElement} row containing tr
             */
            renderRowContainer : function(){
            },

            /**
             * @function
             * @description create a html class : th, with text
             * @param {string} label the text add at the html class
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
             * @description create an html element of type tr
             * @return {HTMLElement}
             */
            renderColumnsLevelContainer : function(){
            },

            /**
             * @function
             * @description create an html element of type thead
             * @return {HTMLElement}
             */
            renderColumnsContainer : function(){
            },

            /**
             * @function //FALSE NEED TO BE UNDERSTAND
             * @description render container for all rendered objects. Core will put together
             * all rendered object in a sigle one ; this one.
             * @return {HTMLElement}
             */
            renderContainer : function(){
            },

            /**
             * @function
             * @description set a CSS property at an element
             * @param {string} property the CSS property
             * @param {HTMLElement} element the element which we add the property
             * @param {string} propertyValue the value of the added property
             * @retrun {HTMLElement} element the element with a new CSS property
             */
            setCSSProperty : function(property, element, propertyValue){
            },

            /**
             * @function
             * @description empty the value of a property of an element, canceled the property
             * @param {string} property the CSS property
             * @param {HTMLElement} element the element which we canceled a property
             * @return {HTMLElement} element the element with a canceled property
             */
            emptyCSSProperty : function(property, element){
            },

            /**
             * @function
             * @description recover the classPrefix of a template and give this class prefix
             * with the number of the location at the renderer
             * @param {HTMLElement} element HTML statement
             * @param {string} elementType an element categorie generated by the Renderer
             * @param {Array} classes an array containing HTMl classe(s) to be added
             * @return {HTMLElement} 
             */
            addClasses : function(element, elementType, classes){
            },

            /**
             * @function
             * @description create the content of the head of the row, awards a idprefix, HTML 
             * class
             * @param {string} rowObject the object content in the row
             * @param {Array} rowNumber the numbers of the case of the row
             * @returns {Array} rowArray the two elements of a row head
             */
            renderRow : function(rowObject, rowNumber){
            },

            /**
             * @function
             * @description create the content of the head of the column, awards a idprefix, HTML 
             * class
             * @param {string} columnObject the object content in the column
             * @param {Array} columnNumber the numbers of the case of the column
             * @returns {Array} columnArray the two elements of a column head
             */
            renderColumn : function(columnObject, columnNumber) {
            },

            /**
             * @function NEED TO ACTUALISE
             * @description prepare the renderer of all the cells of the final array, awards 
             * HTMl class, numbers of row/columns, and attribute a value of event
             * @param {Array} rowsNumbers content the numbers of the rows
             * @param {Array} columnsNumbers content the numbers of the columns
             * @param {Array} cellData an array content the Data of existence of the cells
             * @param {Array} eventsCallBacks the vallues of event of all the cells
             * @return {HTMLElement}
             */
            renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
            },

            /**
             * @function
             * @description Add a node at a pre-existent node
             * @param {HTMLElement} element HTML statement
             * @param {Element|string} child as a node add to element
             * @return {HTMLElement} eslement with the text of child
             */
            appendChild : function(element, child) {
            },

            /**
             * @function
             * @description awards value at attributes
             * @param {string} id value set to id
             * @param {string} object value set to object
             * @param {string} label value set to label
             * @param {string} order value set to order
             * @param {HTMLElement} rendering value set to rendering
             * @param {boolean} open value set to open
             * @param {boolean} hidden value set to hidden
             * @return {string|Element|boolean}
             */
            _createRenderedJSON : function(id, object, label, order, rendering, open, hidden){
            }, 

            /**
             * @function
             * @description build a new header when 
             * @param rendering {HTMLElement} the header
             * @param events {Array} containing events available for the rendering following the
             * pattern
             * @returns {HTMLElement} newHeader the header built in function of the events
             */
            addEventsToRendering : function(rendering, events){
            },

            /**
             * @function
             * @description clear output
             * @param {Array} output an array who need to be clear
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
