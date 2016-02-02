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
                rowObject,
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
                columnObject,
                (open || true),
                (hidden || true)
            )
        );
        return columnArray;
    },

    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        return cellData[0];
    },

    reRenderColumn : function(renderedColumn, events) {
        return renderedColumn;
    },

    reRenderRow : function(renderedRow, events) {
        return renderedRow;
    }
};

Renderer = Class.extend(csvExportRenderer, Renderer);


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

ij.setWorkspace("");
var start = new Date();
ij.display();
console.log(new Date() - start);
