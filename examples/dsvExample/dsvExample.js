var Component = {
    initialize : function(parent){
    }
};

Component = Class.create(Component);


//
// DataProvider
//


var DataProvider = {
};

DataProvider = Class.extend(enioka.ij.DSVataProvider, DataProvider);


//
// Renderer
//


var Renderer = {
    initialize : function(parent){
        this.component = parent;
        this.renderer = new enioka.ij.HTMLRenderer();
        this.template = new enioka.ij.HTMLTemplate();
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
            hidden,
            groups = rowObject.split(",");
        for (var i = 0; i < groups.length - 1; i++) {
            rowArray.push(
                this._createRenderedJSON(
                    groups[i] || "t", //ID cannot be empty
                    null,
                    groups[i],
                    (order || 0),
                    this.renderer.addAttribute(
                        this.renderer.createElementWithText("th", groups[i]),
                        "id",
                        this.template.getAttribute("rowHeader","idPrefix") + rowNumber
                    ),
                    true,
                    false,
                    false,
                    false
                )
            );
        }
        rowArray.push(
            this._createRenderedJSON(
                rowObject,
                rowObject,
                rowObject,
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th", groups[groups.length - 1]),
                    "id",
                    this.template.getAttribute("rowHeader","idPrefix") + rowNumber
                ),
                true,
                true,
                false,
                true
            )
        );
        console.log(rowArray);
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
        columnArray.push(
            this._createRenderedJSON(
                columnObject,
                columnObject,
                columnObject,
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th", columnObject),
                    "id",
                    this.template.getAttribute("columnHeader","idPrefix") + columnNumber
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
     * @param renderedColumn
     * @param events
     * @returns {Object}
     */
    reRenderColumn : function(renderedColumn, events){
        renderedColumn.rendering = this.addEventsToRendering(renderedColumn.rendering,
                                                             events);
        return renderedColumn;
    },

    reRenderRow : function(renderedRow, events){
        renderedRow.rendering = this.addEventsToRendering(renderedRow.rendering,
                                                          events);
        return renderedRow;
    },

    /**
     * @function
     * @description
     * @param
     * @param
     * @returns
     */
    renderSummary : function(renderedObject, type){
        var renderedSummary = this._createRenderedJSON(
            renderedObject.id + "__summary__",
            null,
            renderedObject.label + "__summary__",
            30,
            this.renderer.addAttribute(
                this.renderer.createElementWithText("th", renderedObject.label + "__summary__"),
                "id",
                this.template.getAttribute(type,"idPrefix") + renderedObject.id
            ),
            (renderedObject.open || true),
            (renderedObject.hidden || false)
        );
        renderedSummary.summary = true;
        renderedSummary.type = type;
        return renderedSummary;
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
     * @description
     * @param rowsNumbers
     * @param columnsNumbers
     * @param cellData
     * @param eventsCallBacks
     * @returns {*}
     */
    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        var reset = false;
        if (cellData != null) {
            var cell =  this.renderer.createElementWithText("td", cellData);
            cell.style.textAlign = "center";
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
            this.renderer.addClasses(cell,
                                     [this.template.getAttribute("columnHeader", "classPrefix") +
                                      columnsNumbers[column]]);
        }
        return cell;
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
    _createRenderedJSON : function(id, object, label, order, rendering, open, hidden, summary, cannotReRoot){
        return {
            "id" : id,
            "object" : object,
            "label" : label,
            "order" : order,
            "rendering" : rendering,
            "open" : open,
            "hidden" : hidden,
            "hasSummary" : (summary || false),
            "cannotReRoot" : (cannotReRoot || true)
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
    addClasses : function(element, elementType, classes, properties){
        var classPrefix = this.template.getAttribute(elementType, "classPrefix");
        for (var i = 0; i < classes.length; i++){
            classes[i] = classPrefix + classes[i];
        }
        return this.renderer.addClasses(element, classes, properties);
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
     * @description
     * @param rendering
     * @param events
     * @returns {Node|*}
     */
    addEventsToRendering : function(rendering, events){
        /// have to clone the header to clean up from previous events if needed
        var newHeader = rendering.cloneNode(true);
        for (var event in events){
            newHeader.addEventListener(event, events[event]);
        }
        return newHeader;
    },

    hideRendering : function(rendering) {
        return this.renderer.addCSS(rendering, "display", "none");
    },

    showRendering : function(rendering) {
        return this.renderer.deleteCSSProperty(rendering, "display");
    },

    /**
     * @function
     * @description
     * @param output
     */
    clearOutput : function(output) {
        while (output.firstChild) {
            output.removeChild(output.firstChild);
        }
    },

    _getSummaryHoverCell : function(cellData) {
        return this.renderer.createElementWithText("p","There is " + cellData + " characters shared").outerHTML;
    }
};

Renderer = Class.extend(enioka.ij.IIJRenderer, Renderer);

var Controller = {
    /**
     * @function
     * @description
     * @param modelet
     */
    initialize : function(parent, core){
        this.component = parent;
        this.core = core;
    },

    /**
     * @function
     * @description
     * @param event
     * @param headerNode
     */
    onHeaderClick : function(event, headerNode){
        console.log("headerClick", headerNode);
        this.core.toggleHeader(headerNode);
        this.core.refresh(this.core.getHeaderType(headerNode))
    },

    /**
     * @function
     * @description
     * @param event
     */
    onHeaderOut : function(event){
        info_debug("onHeaderOut", event);
    }
};

Controller = Class.extend(enioka.ij.IIJController, Controller);


var component = new Component();
var ij = new enioka.ij.Core();
component.controller = new Controller(component, ij);
component.renderer = new Renderer(component, ij);
component.dataprovider = new DataProvider("data.csv", ";", 4, 1);

ij.setController(component.controller);
ij.setDataProvider(component.dataprovider);
ij.setRenderer(component.renderer);

component.renderer.template.addClassPrefix("columnHeader",
                                           "c");
component.renderer.template.addClassPrefix("rowHeader",
                                           "r");
component.renderer.template.addIdPrefix("columnHeader",
                                        "c");
component.renderer.template.addIdPrefix("rowHeader",
                                        "r");

ij.setWorkspace(document.getElementById("matrix"));
ij.display();
