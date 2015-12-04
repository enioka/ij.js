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
                return this.renderer.createElement("tbody");
            },

            /**
             * @function
             * @description
             * @param rowObject
             * @param rowNumber
             * @returns {Array}
             */
            renderRow : function(rowObject, rowNumber){
                var rowArray = new Array(),
                    order,
                    open,
                    hidden;
                rule = this.modelet.applyRules(
                    {
                        scope : "display",
                        type : "headers",
                        object : rowObject,
                        model : this.modelet.view.getEntityDefinition(rowObject)
                    }
                );
                if (rule) {
                    if (rule.rowGroup)
                        rowArray.push(
                            this._createRenderedJSON(
                                (rule.rowGroupId || rule.rowGroup),
                                (rule.headerObject || null),
                                rule.rowGroup,
                                (rule.rowGroupOrder || 0),
                                this.renderer.addAttribute(
                                    this.renderer.createElementWithText("th", rule.rowGroup),
                                    "id",
                                    (this.template.getAttribute("rowHeader","idPrefix") +
                                    (rule.rowGroupId || rule.rowGroup))
                                ),
                                (rule.rowGroupOpen || true),
                                (rule.rowGroupHidden || false)
                            )
                        );
                    if (rule.rowSubGroup)
                        rowArray.push(
                            this._createRenderedJSON(
                                (rule.rowSubGroupId || rule.rowSubGroup),
                                (rule.headerObject || null),
                                rule.rowSubGroup,
                                (rule.rowSubGroupOrder || 0),
                                this.renderer.addAttribute(
                                    this.renderer.createElementWithText("th", rule.rowSubGroup),
                                    "id",
                                    (this.template.getAttribute("rowHeader","idPrefix") +
                                    (rule.rowSubGroupId || rule.rowSubGroup))
                                ),
                                (rule.rowSubGroupOpen || true),
                                (rule.rowSubGroupHidden || false)
                            )
                        );
                    if (rule.open)
                        open = rule.open;
                    if (rule.hidden)
                        hidden = rule.hidden;
                    if (rule.order)
                        order = rule.order;
                }

                var label = this.modelet.view.getAttributeValueByName(
                        rowObject,
                        this.modelet.getObjectName
                    ),
                    id = this.modelet.view.getID(rowObject);

                rowArray.push(
                    this._createRenderedJSON(
                        id,
                        rowObject,
                        label,
                        (order || 0),
                        this.renderer.addAttribute(
                            this.renderer.createElementWithText("th", label),
                            "id",
                            this.template.getAttribute("rowHeader","idPrefix") + id
                        ),
                        (open || true),
                        (hidden || true)
                    )
                );
                return rowArray;
            },

            /**
             * @function
             * @description
             * @param renderedObject
             * @param property
             * @returns {*}
             */
            applyRowSpan : function(renderedObject, property){
                this.renderer.addAttribute(renderedObject,
                    "rowspan",
                    property);
                return renderedObject;
            },

            /**
             * @function
             * @descrpition
             * @param renderedObject
             * @param property
             * @returns {*}
             */
            applyColSpan : function(renderedObject, property){
                this.renderer.addAttribute(renderedObject,
                    "colspan",
                    property);
                return renderedObject;
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderRowContainer : function(){
                var row = this.renderer.createElement("tr");
                return row;
            },

            /**
             * @function
             * @descrption
             * @param label
             * @returns {*}
             */
            renderSubTotalHeader : function(label){
                return this.renderer.createElementWithText("th", label + " summary");
            },

            /**
             * @function
             * @description
             * @param columnObject
             * @param columnNumber
             * @returns {Array}
             */
            renderColumn : function(columnObject, columnNumber) {
                var columnArray = new Array(),
                    order,
                    open,
                    hidden;
                rule = this.modelet.applyRules(
                    {
                        scope : "display",
                        type : "headers",
                        object : columnObject,
                        model : this.modelet.view.getEntityDefinition(columnObject)
                    }
                );
                if (rule) {
                    if (rule.colGroup)
                        columnArray.push(
                            this._createRenderedJSON(
                                (rule.colGroupId || rule.colGroup),
                                (rule.headerObject || null),
                                rule.colGroup,
                                (rule.colGroupOrder || 0),
                                this.renderer.addAttribute(
                                    this.renderer.createElementWithText("th", rule.colGroup),
                                    "id",
                                    (this.template.getAttribute("columnHeader","idPrefix") +
                                    (rule.colGroupId || rule.colGroup))
                                ),
                                (rule.colGroupOpen || true),
                                (rule.colGroupHidden || false)
                            )
                        );
                    if (rule.colSubGroup)
                        columnArray.push(
                            this._createRenderedJSON(
                                (rule.colSubGroupId || rule.colSubGroup),
                                (rule.headerObject || null),
                                rule.colSubGroup,
                                (rule.colSubGroupOrder || 0),
                                this.renderer.addAttribute(
                                    this.renderer.createElementWithText("th", rule.colSubGroup),
                                    "id",
                                    (this.template.getAttribute("columnHeader","idPrefix") +
                                    (rule.colSubGroupId || rule.colSubGroup))
                                ),
                                (rule.colSubGroupOpen || true),
                                (rule.colSubGroupHidden || false)
                            )
                        );
                    if (rule.oepn)
                        open = rule.open;
                    if (rule.hidden)
                        hidden = rule.hidden;
                    if (rule.order)
                        order = rule.order;
                }

                var label = this.modelet.view.getAttributeValueByName(
                        columnObject,
                        this.modelet.getObjectName
                    ),
                    id = this.modelet.view.getID(columnObject);

                columnArray.push(
                    this._createRenderedJSON(
                        id,
                        columnObject,
                        label,
                        (order || 0),
                        this.renderer.addAttribute(
                            this.renderer.createElementWithText("th", label),
                            "id",
                            this.template.getAttribute("columnHeader","idPrefix") + id
                        ),
                        (open || true),
                        (hidden || true)
                    )
                );
                return columnArray;
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderLeftUpperCorner : function(){
                return this.renderer.createElement("th");
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderColumnsLevelContainer : function(){
                return this.renderer.createElement("tr");
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderColumnsContainer : function(){
                return this.renderer.createElement("thead");
            },

            /**
             * @function
             * @descrpition
             * @param renderedObject
             * @returns {*|{id, object, label, order, rendering, open, visible}}
             */
            renderSummary : function(renderedObject){
                return this._createRenderedJSON();
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
                if (cellData && cellData.length > 0) {
                    var cell =  this.renderer.createElementWithText("td", cellData.length);
                    this.renderer.addAttribute(cell, "data-toggle", "popover");
                    this.renderer.addAttribute(cell, "data-original-title", "Summary (first relation)");
                    this.renderer.addAttribute(cell, "data-content",
                        this._getSummaryHoverCell(cellData)
                    );
                    this.renderer.addAttribute(cell, "data-html", "true");
                    this.renderer.addAttribute(cell, "data-container", "body");
                }
                else {
                    var cell = this.renderer.createElement("td");
                }
                cell = this.addEventsToRendering(cell,
                    eventsCallBacks);
                for (var row in rowsNumbers){
                    this.renderer.addClasses(cell,
                        [this.template.getAttribute("rowHeader", "classPrefix") +
                        rowsNumbers[row]]);
                }
                for (var column in columnsNumbers){
                    return this.renderer.addClasses(cell,
                        [this.template.getAttribute("columnHeader", "classPrefix") +
                        columnsNumbers[column]]);
                }
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
                return this.renderer.appendChild(element, child);
            },

            /**
             * @function
             * @descrption
             * @param id
             * @param object
             * @param label
             * @param order
             * @param rendering
             * @param open
             * @param hidden
             * @returns {{id: *, object: *, label: *, order: *, rendering: *, open: *, hidden: *}}
             * @private
             */
            _createRenderedJSON : function(id, object, label, order, rendering, open, hidden){
                return {
                    "id" : id,
                    "object" : object,
                    "label" : label,
                    "order" : order,
                    "rendering" : rendering,
                    "open" : open,
                    "hidden" : hidden
                };
            },

            /**
             * @function
             * @description
             * @returns {Element|*}
             */
            renderContainer : function(){
                return this.renderer.createElement("table",["table","table-bordered"]);
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
                return element.style.setProperty(property, propertyValue);
            },

            /**
             * @function
             * @description
             * @param property
             * @param element
             * @returns {*|void}
             */
            emptyCSSProperty : function(property, element){
                return element.style.setProperty(property, "");
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
                var classPrefix = this.template.getAttribute(elementType, "classPrefix");
                for (var i = 0; i < classes.length; i++){
                    classes[i] = classPrefix + classes[i];
                }
                return this.renderer.addClasses(element, classes);
            },

            /**
             * @function
             * @description
             * @param element
             * @param id
             * @returns {*}
             */
            setId : function(element, id){
                element.id = id;
                return element;
            },

            /**
             * @function
             * @description
             * @param type
             * @returns {*|string}
             */
            getClassPrefix : function(type){
                return this.template.getAttribute(type, "classPrefix");
            },

            /**
             * @function
             * @description
             * @param type
             * @returns {*|string}
             */
            getIdPrefix : function(type){
                return this.template.getAttribute(type, "idPrefix");
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
