var Component = {
    initialize : function(parent){
        this.minNumber;
        this.maxNumber;
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
        var cpt = Math.floor(Math.random() * (51 - 11 ) + 11);
        var cpt1 = Math.floor(Math.random() * (21 - 11 ) + 11);

    	for (var i = 0; i < cpt; i++) {
            for (var j = 0; j < cpt1; j++){
                text+= possible.charAt(Math.floor(Math.random() * possible.length));       
            }
            headerArray.push(text);
            console.log(text);
    		text = '';
    	}
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
                if (this.component.minNumber == undefined || this.component.minNumber > communCarac){
                    this.component.minNumber = communCarac;
                };
                if (this.component.maxNumber == undefined || this.component.maxNumber < communCarac){
                    this.component.maxNumber = communCarac;
                };

        	};
        	dataArray.push(communCarac);
        };
        console.log("tobu", this.component.maxNumber);
        console.log("tobu", this.component.minNumber);
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
 
        var cell = this.renderer.createElementWithText("td", cellData[0]);
        cell = this.addEventsToRendering(cell, eventsCallBacks);

        for (var row in rowsNumbers){
            this.renderer.addClasses(cell, [this.template.getAttribute("rowHeader", "classPrefix") + rowsNumbers[row]]);
        }

        for (var column in columnsNumbers){
            this.setCSSProperty("background-color", cell, this.renderColorCell(cellData) );
            return this.renderer.addClasses(cell, [this.template.getAttribute("columnHeader", "classPrefix") + columnsNumbers[column]]);

        }

    },



    renderColorCell : function(dataNumber){

        var colorCell = '',
            minNumber = this.component.minNumber,
            maxNumber = this.component.maxNumber,
            rangeNumber = maxNumber - minNumber,
            colorRed,
            cpt = 0;

        for (var i = minNumber; i < maxNumber; i++) {
            colorRed = Math.floor(255 / rangeNumber);
            if (dataNumber == i) {
                colorRed = colorRed * cpt;
                colorCell = 'rgb(colorRed, 255, 0)';
                cpt ++;
            };
        };


        /*if (dataNumber == 0) {
            colorCell = '#ffff00';
        };
        if (dataNumber == 1) {
            colorCell = '#ffe500';
        };
        if (dataNumber == 2) {
            colorCell = '#ffcc00';
        };
        if (dataNumber == 3) {
            colorCell = '#ffb200';
        };
        if (dataNumber == 4) {
            colorCell = '#ff9900';
        };
        if (dataNumber == 5) {
            colorCell = '#ff7f00';
        };
        if (dataNumber == 6) {
            colorCell = '#ff6600';
        };
        if (dataNumber == 7) {
            colorCell = '#ff4c00';
        };
        if (dataNumber == 8) {
            colorCell = '#ff3300';
        };
        if (dataNumber == 9) {
            colorCell = '#ff1900';
        };
        if (dataNumber == 10) {
            colorCell = '#ff0000';
        };*/
        return colorCell;
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
        info_debug("onCellOut");
        var classes = event.target.className.split(" ");
        var elements = new Array();
        console.log($(event.target));
        for (i = 0; i < classes.length; i++){
            elements = document.getElementsByClassName(classes[i]);

            for (var j = 0; j < elements.length; j++){
                if (elements[j].tagName == "TD"){
                    this.component.renderer.emptyCSSProperty("background-color", 
                        elements[j]);
                console.log(elements[j]);
                console.log("Trautu");}
                else if (elements[j].tagName == "TH")
                    this.component.renderer.emptyCSSProperty("background-color", 
                        elements[j]);
            }
        }
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
