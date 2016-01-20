var Component = {
    initialize : function(parent){
        this.minNumber;
        this.maxNumber;
        this.rangeNumber;
        this.dataColumnHead;
        this.dataRowHead;
    },

    getRange : function(){

        var dataRowHead = this.dataRowHead,
            dataColumnHead = this.dataColumnHead,        
            communCarac = 0,
            stringRow,
            splitStringRow,
            stringColumn,
            splitStringColumn;

        for (var i = 0; i < dataColumnHead.length; i++) {
            stringColumn = dataColumnHead[i];
            splitStringColumn = stringColumn.split("");

            for (var j = 0; j < dataRowHead.length; j++) {
                stringRow = dataRowHead[j];
                splitStringRow = stringRow.split("");

                for (var k = 0; k < splitStringRow.length; k++) {
                    for (var n = 0; n < splitStringColumn.length; n++) {
                        if (splitStringColumn[n] == splitStringRow[k]) {
                            communCarac++;

                        };
                    };
                };
                if (this.minNumber == undefined || this.minNumber > communCarac){
                    this.minNumber = communCarac;
                };
                if (this.maxNumber == undefined || this.maxNumber < communCarac){
                    this.maxNumber = communCarac;
                };
                communCarac = 0;
            };

        };
        this.rangeNumber = this.maxNumber - this.minNumber;

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
        this.component.dataColumnHead = this.dataHeader();
        return this.component.dataColumnHead;
    },

    getRows : function(){
    	this.component.dataRowHead = this.dataHeader();
        return this.component.dataRowHead;
    },

    dataHeader : function () {
    	var headerArray = new Array();
    	var text = '';
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var cpt = Math.floor(Math.random() * (41 - 11 ) + 11);
        var cpt1 = Math.floor(Math.random() * (21 - 11 ) + 11);

    	for (var i = 0; i < cpt; i++) {
            for (var j = 0; j < cpt1; j++){
                text+= possible.charAt(Math.floor(Math.random() * possible.length));       
            }
            headerArray.push(text);
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
        	};
        	dataArray.push(communCarac);
        };
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
            this.setCSSProperty("background-color", cell, this.renderColorCell(cellData, this.component.minNumber, this.component.maxNumber) );
            return this.renderer.addClasses(cell, [this.template.getAttribute("columnHeader", "classPrefix") + columnsNumbers[column]]);

        }

    },



    renderColorCell : function(dataNumber, minNumber, maxNumber){

        var colorCell = '',
            colorGreen,
            cpt = 0;

            if (this.component.rangeNumber == undefined) {
            this.component.getRange();
            console.log("rangeNumber : ", this.component.rangeNumber);
            console.log("maxNumber : ", this.component.maxNumber);
            console.log("minNumber : ", this.component.minNumber);
            console.log("sortis du getRange");
            };

            minNumber = this.component.minNumber;
            maxNumber = this.component.maxNumber;
            rangeNumber = this.component.rangeNumber

        for (var i = minNumber; i <= maxNumber; i++) {
            colorGreen = Math.floor(255 / rangeNumber);
            
            if (dataNumber == i) {
                
                colorGreen = 255 - colorGreen * (i - minNumber);
                colorCell = 'rgb(255, '+ colorGreen +' , 0)';
                cpt ++;
                return colorCell;
                
            };
        };
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
                }
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
