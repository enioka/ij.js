var Component = {
    initialize : function(parent){
    },

    getObjects : function(){
        var objects = new Array(),
            number = 100,
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

    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        if (cellData && cellData.length > 0 && cellData[0]) {
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

    reRenderColumn : function(renderedColumn, events) {
        if (!renderedColumn.children) {
            var vtext = this.renderer.createElement("div",
                                                    ["vtext"]);
            var vtextInner = this.renderer.createElementWithText("div",
                                                                 renderedColumn.label,
                                                                 ["vtext__inner"]);
            renderedColumn.rendering.textContent = "";
            this.appendChild(vtext,
                             vtextInner);
            this.appendChild(renderedColumn.rendering,
                             vtext);
        }
        renderedColumn.rendering = this.addEventsToRendering(renderedColumn.rendering,
                                                             events);
        return renderedColumn;
    },

    reRenderRow : function(renderedRow, events) {
        renderedRow.rendering = this.addEventsToRendering(renderedRow.rendering,
                                                          events);
        return renderedRow;
    }
};

Renderer = Class.extend(DefaultHTMLRenderer, Renderer);


//
//Controller
//


var Controller = {

    initialize : function(parent, core){
        this.component = parent;
        this.core = core;
        this.ui = new enioka.ij.IIJControllerUI(this,
                                                document.getElementById("matrix_controls"),
                                                { "refresh" :
                                                  {
                                                      "label" : "refresh",
                                                      "classes" : ["btn", "btn-primary"]
                                                  }
                                                });
        console.log(this.ui);
    },

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

    onHeaderHover : function(event){
        info_debug("onHeaderHover", event);
    },

    onHeaderOut : function(event){
        info_debug("onHeaderOut", event);
    }
};

Controller = Class.extend(enioka.ij.IIJController, Controller);


//
//Aggregator
//


var Aggregator = {

    initialize : function(parent){
        this.component = parent;
    },

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
component.renderer = new Renderer(component);
component.dataprovider = new DataProvider(component);

ij.setDataProvider(component.dataprovider);
ij.setRenderer(component.renderer);

component.controller = new Controller(component, ij);
ij.setController(component.controller);

component.renderer.template.addClassPrefix("columnHeader",
    "c");
component.renderer.template.addClassPrefix("rowHeader",
    "r");
component.renderer.template.addIdPrefix("columnHeader",
    "c");
component.renderer.template.addIdPrefix("rowHeader",
    "r");

ij.setWorkspace(document.getElementById("matrix"));
var start = new Date();
ij.display();
console.log(new Date() - start);
