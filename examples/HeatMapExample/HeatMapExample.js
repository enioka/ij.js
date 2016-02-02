var Component = {
    initialize : function(parent){
        this.minNumber;
        this.maxNumber;
        this.rangeNumber;
        this.dataColumnHead;
        this.dataRowHead;
        this.rangeNumbersHead = new Array();
    },

    getRange : function(rowsObjects, columnsObjects){

        var dataRowHead = this.dataRowHead,
            dataColumnHead = this.dataColumnHead,
            communCarac = 0,
            stringRow,
            splitStringRow,
            stringColumn,
            splitStringColumn,
            valReturnCarac,
            lengthRangeArray,
            exist = 0;

        for (var i = 0; i < dataColumnHead.length; i++) {
            stringColumn = dataColumnHead[i];
            splitStringColumn = stringColumn.split("");

            for (var j = 0; j < dataRowHead.length; j++) {
                stringRow = dataRowHead[j];
                splitStringRow = stringRow.split("");

                for (var k = 0; k < splitStringRow.length; k++) {
                    for (var n = 0; n < splitStringColumn.length; n++) {
                        if (splitStringColumn[n] == splitStringRow[k]) {
                            communCarac++; //init of the all dataCell (for comparaison)
                        };
                    };
                };

                if(this.rangeNumbersHead != undefined){
                    for (var r = 0; r < this.rangeNumbersHead.length; r++) {
                        if(this.rangeNumbersHead[r] == communCarac){
                            exist = 1; //defined of the pre-existence of a data, for the range
                        }
                    };
                }
                if(exist == 0){ //if the data doesn't exist in the Array
                    this.rangeNumbersHead.push(communCarac);
                }
                exist = 0;

                if (this.minNumber == undefined || this.minNumber > communCarac){
                    this.minNumber = communCarac; //init of the minimum data cell
                };
                if (this.maxNumber == undefined || this.maxNumber < communCarac){
                    this.maxNumber = communCarac; //init of the maximum data cell
                };

                if(valReturnCarac == undefined && rowsObjects == dataRowHead[j] && columnsObjects == dataColumnHead[i]){
                    console.log(dataRowHead[j], dataColumnHead[i]);
                    valReturnCarac = communCarac; //init of the first datacell
                }

                communCarac = 0;
            };

        };
        this.rangeNumber = this.rangeNumbersHead.length; //return of the first datacell
        return valReturnCarac;
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
        var cpt = Math.floor(Math.random() * (100 - 11) + 11);

    	for (var i = 0; i < cpt; i++) {
            var cpt1 = Math.floor(Math.random() * (5 - 1) + 1);
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

        if(!this.component.rangeNumber){ //init of the range Number and of the first DataCell
            communCarac = this.component.getRange(rowsObjects, columnsObjects);
            dataArray.push(communCarac);
        }
        else{ //generation of all other's dataCell
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
        }
        return dataArray; //return of the data cell
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
        if (!cellData[0])
            var cell = this.renderer.createElement("td");
        else
            var cell = this.renderer.createElementWithText("td", cellData[0]);
        cell = this.addEventsToRendering(cell, eventsCallBacks);

        for (var row in rowsNumbers){
            this.renderer.addClasses(cell, [this.template.getAttribute("rowHeader", "classPrefix") + rowsNumbers[row]]);
        }

        for (var column in columnsNumbers){
            this.setCSSProperty("background-color", cell, this.renderColorCell(cellData, this.component.minNumber, this.component.maxNumber) ); //applied of the color, function of the datacell
            return this.renderer.addClasses(cell, [this.template.getAttribute("columnHeader", "classPrefix") + columnsNumbers[column]]);

        }

    },



    renderColorCell : function(dataNumber){

        var colorCell = '',
            colorGreen,
            cpt = 0;

        minNumber = this.component.minNumber;
        maxNumber = this.component.maxNumber;
        rangeNumber = this.component.rangeNumber

        this.component.rangeNumbersHead.sort(function (a, b) { //crescent sort of all the range data

            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        colorGreen = Math.floor(255 / rangeNumber); //init of the rangecolor

        for (var i = 0; i < rangeNumber; i++) { //creation of the color function of the data cell

            if (dataNumber == this.component.rangeNumbersHead[i]) {

                colorGreen = 255 - colorGreen * i;
                colorCell = 'rgb(255, '+ colorGreen +' ,0)';
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
//var start = new Date();
ij.display();
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var orig_code = "... JS code here";
var ast = jsp.parse(orig_code); // parse code and get the initial AST
ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
var final_code = pro.gen_code(ast); // compressed code here
alert(ast);
//alert("displayed : " + (new Date() - start));
