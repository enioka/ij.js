var Component = {
    initialize : function(parent){
    },

    getObjects : function(){
        var objects = new Array(),
            number = Math.random() * (50 - 10) + 10,
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < number; i++) {
            var text = "";
            for( var j=0; j < (Math.random() * (10 - 3) + 3); j++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            objects.push(text);
        }
        return objects;
    }
};

Component = Class.create(Component);


//
// DataProvider
//


var DataProvider = {
    initialize : function(parent){
        this.component = parent;
        this.aggregator = new Aggregator();
    },

    getRows : function(filter){
        return this.component.getObjects();
    },

    getColumns : function(filter){
        return this.component.getObjects();
    },

    getData : function(rowsObjects, columnsObjects, filter){
        var relations = [],
            occurences = 0;
        for (var i = 0; i < rowsObjects.length; i++){
            for(var pos = columnsObjects[0].indexOf(rowsObjects[0][i]); pos !== -1; pos = columnsObjects[0].indexOf(rowsObjects[0][i], pos + 1)) {
                occurences++;
            }
        }
        relations.push(occurences);
        return relations;
    }
};

DataProvider = Class.extend(enioka.ij.IIJDataProvider, DataProvider);


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
            hidden;
        rowArray.push(
            this._createRenderedJSON(
                rowNumber,
                rowObject,
                rowObject,
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th", rowObject),
                    "id",
                    this.template.getAttribute("rowHeader","idPrefix") + rowNumber
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
        columnArray.push(
            this._createRenderedJSON(
                columnNumber,
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
            var cell =  this.renderer.createElementWithText("td", cellData[0]);
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
     */
    onCellHover : function(event){
        info_debug("onCellHover");
        var classes = event.target.className.split(" ");
        var elements = new Array();
        console.log($(event.target));
        for (i = 0; i < classes.length; i++){
            elements = document.getElementsByClassName(
                classes[i]
            );
            for (var j = 0; j < elements.length; j++){
                if (elements[j].tagName == "TD")
                    this.component.renderer.setCSSProperty("background-color",
                        elements[j],
                        "#e3e3e3");
                else if (elements[j].tagName == "TH")
                    this.component.renderer.setCSSProperty("background-color",
                        elements[j],
                        "#d77b18");
            }
        }
        this.component.renderer.setCSSProperty("background-color",
            event.target,
            "#d77b18");
    },

    onCellClick : function(event, cellData){
        alert("there is " + cellData[0] + " characters shared");
    },

    /**
     * @function
     * @description
     * @param event
     */
    onCellOut : function(event){
        info_debug("onCellHover");
        var classes = event.target.className.split(" ");
        var elements = new Array();
        console.log($(event.target));
        for (i = 0; i < classes.length; i++){
            elements = document.getElementsByClassName(
                classes[i]
            );
            for (var j = 0; j < elements.length; j++){
                if (elements[j].tagName == "TD")
                    this.component.renderer.emptyCSSProperty("background-color",
                        elements[j]);
                else if (elements[j].tagName == "TH")
                    this.component.renderer.emptyCSSProperty("background-color",
                        elements[j]);
            }
        }
        this.component.renderer.emptyCSSProperty("background-color",
            event.target);
    },

    /**
     * @function
     * @description
     * @param event
     */
    onHeaderHover : function(event){
        info_debug("onHeaderHover", event);
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

var Aggregator = {
    /**
     * @function
     * @description
     * @param modelet
     */
    initialize : function(parent){
        this.component = parent;
    },

    /**
     * @function
     * @description
     * @param rowsObjects
     * @param columnsObjects
     * @param filter
     * @returns {Array}
     */
    aggregateData : function(rowsObjects, columnsObjects, filter) {
        var result = new Array();
        for (var i = 0; i < rowsObjects.length; i++){
            var rowId = this.component.view.getID(rowsObjects[i]);
            for (var j = 0; j < columnsObjects.length; j++){
                var columnId = this.component.view.getID(columnsObjects[j]);
                if (this.component.matrix[rowId] && this.component.matrix[rowId][columnId])
                    result = result.concat(this.component.matrix[rowId][columnId]);
            }
        }
        return result;
    }
};
Aggregator = Class.extend(enioka.ij.IIJAggregator, Aggregator);


var component = new Component();
var ij = new enioka.ij.Core();
component.controller = new Controller(component);
component.renderer = new Renderer(component);
component.dataprovider = new DataProvider(component);

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