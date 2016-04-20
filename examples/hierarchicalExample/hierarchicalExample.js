var ij = new enioka.ij.Core();

//
// DataProvider
//


var DataProvider = {
    initialize : function(){
    },

    getRows : function(filter){
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

    getColumns : function(filter){
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

var RandomColumnsOnly = {
    initialize : function(){
    },

    getRows : function(filter){
        return ["k","z","5","l","9","3","z","n","f","y"];
    },

    getColumns : function(filter){
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

RandomColumnsOnly = Class.extend(enioka.ij.IIJDataProvider, RandomColumnsOnly);

var RandomRowsOnly = {
    initialize : function(){
    },

    getRows : function(filter){
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
    },

    getColumns : function(filter){
        return ["toto", "tata", "tutu2"];
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

RandomRowsOnly = Class.extend(enioka.ij.IIJDataProvider, RandomRowsOnly);


//
// Renderer
//


var Renderer = {
    initialize : function(){
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

    initialize : function(core){
        this.core = core;
        this.ui = new enioka.ij.IIJControllerUI(this,
                                                document.getElementById("matrix_controls"),
                                                { "refresh" :
                                                  {
                                                      "label" : "",
                                                      "classes" : ["btn",
                                                                   "btn-default",
                                                                   "glyphicon",
                                                                   "glyphicon-refresh"]
                                                  },
                                                  "zoomIn" : {
                                                      "label" : "",
                                                      "classes" : ["btn",
                                                                   "btn-default",
                                                                   "glyphicon",
                                                                   "glyphicon-zoom-in"]
                                                  },

                                                  "zoomOut" : {
                                                      "label" : "",
                                                      "classes" : ["btn",
                                                                   "btn-default",
                                                                   "glyphicon",
                                                                   "glyphicon-zoom-out"]
                                                  },
                                                  "resetZoom" : {
                                                      "label" : "",
                                                      "classes" : ["btn",
                                                                   "btn-default",
                                                                   "glyphicon",
                                                                   "glyphicon-resize-small"]
                                                  },
                                                  "updateRenderer" : {
                                                      "label" : "Renderer : ",
                                                      "type" : "select",
                                                      "options" : ["Renderer"],
                                                      "values" : [Renderer],
                                                      "classes" : ["form-control"]
                                                  },
                                                  "updateDataProvider" : {
                                                      "label" : "Data Provider",
                                                      "type" : "select",
                                                      "options" : ["Default","Random Columns", "Random Rows"],
                                                      "values" : [DataProvider,RandomColumnsOnly,RandomRowsOnly],
                                                      "classes" : ["form-control"]
                                                  }
                                                });
        console.log(this.ui);
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
                    this.core.renderer.setCSSProperty("background-color",
                                                           elements[j],
                                                           "#e3e3e3");
                else if (elements[j].tagName == "TH")
                    this.core.renderer.setCSSProperty("background-color",
                                                           elements[j],
                                                           "#d77b18");
            }
        }
        this.core.renderer.setCSSProperty("background-color",
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
                    this.core.renderer.emptyCSSProperty("background-color",
                                                             elements[j]);
                else if (elements[j].tagName == "TH")
                    this.core.renderer.emptyCSSProperty("background-color",
                                                             elements[j]);
            }
        }
        this.core.renderer.emptyCSSProperty("background-color",
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


var ij = new enioka.ij.Core();
var renderer = new Renderer(ij);
var dataprovider = new DataProvider(ij);

ij.setDataProvider(dataprovider);
ij.setRenderer(renderer);

controller = new Controller(ij);
ij.setController(controller);

renderer.template.addClassPrefix("columnHeader",
                                           "c");
renderer.template.addClassPrefix("rowHeader",
                                           "r");
renderer.template.addIdPrefix("columnHeader",
                                        "c");
renderer.template.addIdPrefix("rowHeader",
                                        "r");

ij.setWorkspace(document.getElementById("matrix"));
ij.display();
