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
    },

     getData : function(){
        var relations = [];
        var rows = this.component.getObjects(),
            columns = this.component.getObjects();
        for (var i = 0; i < rows.length; i++){
            relations[i] = new Array();
            for (var j = 0; j < columns.length; j++){
                relations[i].push(this._getOccurences(rows[i], columns[j]));
            }
        }
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

    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        console.log(cellData);
        if (cellData) {
            var cell =  this.renderer.createElementWithText("td", cellData);
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
    }
};

Renderer = Class.extend(DefaultHTMLRenderer, Renderer);

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
};

Controller = Class.extend(enioka.ij.IIJController, Controller);


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
