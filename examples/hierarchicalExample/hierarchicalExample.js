var Component = {
    initialize : function(parent){
    },

    getRows : function(){
        var objects = new Array(),
            number =10,
            possible = "abcdefghijk";
        for (var i = 0; i < number; i++) {
            var text = "";
            for( var j=0; j < (Math.random() * (10 - 3) + 3); j++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            objects.push(text);
        }
        this.rows = objects;
        return objects;
    },

    getColumns : function(){
        var objects = new Array(),
            number = Math.random() * (50 - 10) + 10,
            possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < number; i++) {
            var text = "";
            for( var j=0; j < (Math.random() * (10 - 3) + 3); j++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            objects.push(text);
        }
        this.columns = objects;
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
        return this.component.getRows();
    },

    getColumns : function(filter){
        return this.component.getColumns();
    },

    getData : function(rowsObjects, columnsObjects, filter, spec){
        var relations = [],
            occurences = 0;
        console.log(rowsObjects, columnsObjects);
        for (var i = 0; i < rowsObjects.length; i++){
            for (var j = 0; j < columnsObjects.length; j++){
                occurences += this._getOccurences(rowsObjects[i], columnsObjects[j]);
            }
        }
        relations.push(occurences);
        return relations;
    },

    _getOccurences : function(rowObject, columnObject){
        var count = 0;
        for (var i = 0; i < rowObject.length; i++){
            if (columnObject.indexOf(rowObject[i]) != -1)
                count++;
        }
        return count;
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
                "group",
                null,
                "group",
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th",
                                                        "group",
                                                        "id",
                                                        this.template.getAttribute("rowHeader","idPrefix") + "group")
                ),
                (open || true),
                (hidden || true),
                true
            )
        );
        rowArray.push(
            this._createRenderedJSON(
                rowObject.substring(0,1),
                null,
                rowObject.substring(0,1),
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th",
                                                        rowObject.substring(0,1)),
                    "id",
                    this.template.getAttribute("rowHeader","idPrefix") + rowObject.substring(0,1)
                ),
                (open || true),
                (hidden || true),
                true
            )
        );
        rowArray.push(
            this._createRenderedJSON(
                rowObject,
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
                "id" + "group",
                undefined,
                "group",
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th",
                                                        "group"),
                    "id",
                    this.template.getAttribute("columnHeader","idPrefix") + "group"
                ),
                (open || true),
                (hidden || true),
                true
            )
        );
        columnArray.push(
            this._createRenderedJSON(
                columnObject.substring(0,1),
                undefined,
                columnObject.substring(0,1),
                (order || 0),
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th",
                                                        columnObject.substring(0,1)),
                    "id",
                    this.template.getAttribute("columnHeader","idPrefix") + columnObject.substring(0,1)
                ),
                (open || true),
                (hidden || true),
                true
            )
        );
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

    reRenderColumn : function(renderedColumn, events){
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

    reRenderRow : function(renderedRow, events){
        renderedRow.rendering = this.addEventsToRendering(renderedRow.rendering,
                                                          events);
        return renderedRow;
    },

    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        var reset = false;
        if (cellData && cellData.length > 0) {
            var cell =  this.renderer.createElementWithText("td", cellData[0]);
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
    },

    onCellHover : function(event){
        info_debug("onCellHover");
        var classes = event.target.className.split(" ");
        var elements = new Array();
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

    onCellClick : function(event, cellData, rowsObjects, columnsObjects){
        console.log(cellData);
        alert("there is " + cellData[0] + " characters shared");
    },

    onCellOut : function(event){
        info_debug("onCellHover");
        var classes = event.target.className.split(" ");
        var elements = new Array();
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

    onHeaderClick : function(event, headerNode){
        console.log("headerClick", headerNode);
        this.core.toggleHeader(headerNode);
        this.core.refresh(this.core.getHeaderType(headerNode))
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
component.controller = new Controller(component, ij);
component.renderer = new Renderer(component, ij);
component.dataprovider = new DataProvider(component, ij);

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
