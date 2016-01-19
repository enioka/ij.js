var Component = {
    initialize : function(parent){
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

    getColumns : function(){
        console.log("tata");
        return this.dataHeader();
    },

    getRows : function(){
    	console.log("tptp");
    	return this.dataHeader();
    },

    dataHeader : function () {
    	var headerArray = new Array();
    	var text = '';
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var cpt = Math.floor(Math.random() * (16 - 1 ) + 1);
        var cpt1 = Math.floor(Math.random() * (11 - 1 ) + 1);

    	for (var i = 0; i < cpt; i++) {
            for (var j = 0; j < cpt1; j++){
                text+= possible.charAt(Math.floor(Math.random() * possible.length));       
            }
            headerArray.push(text);
            console.log(text);
    		text = '';
    	}
    	console.log("tutu");
        console.log(headerArray.length);
    	return headerArray;
    },

    getData : function(rowsObjects, columnsObjects){

        var dataArray = new Array() ;
        var communCarac = 0;

        for (var i = 0; i < rowsObjects.length; i++) {
        	var stringRows = rowsObjects[i],
        		splitStringRows = stringRows.split("");
        	for (var j = 0; j < columnsObjects.length; j++) {
        		var stringColumn = columnsObjects[i],
        			splitStringColumn = stringColumn.split("");
        		
        		for (var k = 0; k < splitStringRows.length; k++) {
        			for (var n = 0; n < splitStringColumn.length; n++) {
        				if (splitStringColumn[n] == splitStringRows[k]) {
        					communCarac++;
        				};
        			};
        		};

        	};
        	dataArray.push(communCarac);
        };
        console.log("toto");
        return dataArray;
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
        var rowArray = new Array();
        rowArray.push(
            this._createRenderedJSON(
                rowObject,
                rowObject,
                rowObject,
                2,
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th", rowObject),
                    "id",
                    this.template.getAttribute("rowHeader","idPrefix") + rowNumber
                ), 
                true,
                true
            )
        );
        return rowArray;
    },

    renderColumn : function(columnObject, columnNumber) {
        var columnArray = new Array();
        columnArray.push(
            this._createRenderedJSON(
                columnObject,
                columnObject,
                columnObject,
                2,
                this.renderer.addAttribute(
                    this.renderer.createElementWithText("th", columnObject),
                    "id",
                    this.template.getAttribute("columnHeader","idPrefix") + columnNumber
                ), 
                true,
                true
            )
        );
        return columnArray;
    },

    renderCell : function(rowsNumbers, columnsNumbers, cellData, eventsCallBacks){
        if (cellData && cellData.length > 0) {
            var cell = this.renderer.createElementWithText("td", cellData[0]);
            this.renderer.addAttribute(cell, "data-toggle", "popover");
            this.renderer.addAttribute(cell, "data-original-title", "Summary (first relation)");
            this.renderer.addAttribute(cell, "data-content", this._getSummaryHoverCell(cellData));
            this.renderer.addAttribute(cell, "data-html", "true");
            this.renderer.addAttribute(cell, "data-container", "body");

        }
        else {
            var cell = this.renderer.createElement("td");
        }

        cell = this.addEventsToRendering(cell, eventsCallBacks);

        for (var row in rowsNumbers){
            this.renderer.addClasses(cell, [this.template.getAttribute("rowHeader", "classPrefix") + rowsNumbers[row]]);
        }

        for (var column in columnsNumbers){
            return this.renderer.addClasses(cell, [this.template.getAttribute("columnHeader", "classPrefix") + columnsNumbers[column]]);
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
            elements = document.getElementsByClassName(classes[i]);

            for (var j = 0; j < elements.length; j++){
                if (elements[j].tagName == "TD")
                    this.component.renderer.setCSSProperty("background-color", elements[j], "#e3e3e3");
                else if (elements[j].tagName == "TH")
                    this.component.renderer.setCSSProperty("background-color", elements[j], "#d77b18");
            }
        }
        this.component.renderer.setCSSProperty("background-color", event.target, "#d77b18");
    },

    onCellOut : function(event){
        info_debug("onCellHover");
        var classes = event.target.className.split(" ");
        var elements = new Array();
        console.log($(event.target));
        for (i = 0; i < classes.length; i++){
            elements = document.getElementsByClassName(classes[i]);

            for (var j = 0; j < elements.length; j++){
                if (elements[j].tagName == "TD")
                    this.component.renderer.emptyCSSProperty("background-color", elements[j]);
                else if (elements[j].tagName == "TH")
                    this.component.renderer.emptyCSSProperty("background-color", elements[j]);
            }
        }
        this.component.renderer.emptyCSSProperty("background-color",
            event.target, "#d77b18");
    },

    onCellClick : function(event, cellData){
        alert("there is " + cellData[0] + " characters shared");
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

var Aggregator = {

    initialize : function(parent){
        this.component = parent;
    },

    aggregateData : function(rowsObjects, columnsObjects) {
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
ij.hideSummaries = true;

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
