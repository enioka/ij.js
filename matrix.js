// Copyright 2015 enioka. All rights reserved
// Distributed under the GNU LESSER GENERAL PUBLIC LICENSE V3
// Except the Class implementation distributed under the new BSD licence
// Authors: Marin Procureur (marin.procureur@enioka.com)

/**
 * @namespace enioka
 * @see <a href="http://www.enioka.com"/> enioka </a>
 */
var enioka = (enioka || {});

enioka.matrix = (
    function (eniokamatrix) {
        // Following code borrowed to Alex Arnell
        // Some class mechanism was needed to make possible
        // to subclass the RuleFact class by client applications
        // somewhat of an overkill here...

        /*
          Class, version 2.7
          Copyright (c) 2006, 2007, 2008, Alex Arnell <alex@twologic.com>
          Licensed under the new BSD License. See end of file for full license terms.
        */

        function info_debug(text,object) {
            if (eniokamatrix.info_debug) {
                eniokamatrix.info_debug(text,object);
            } else {
                console.log(text,object);
            }
        }
        function info_warn(text,object) {
            if (eniokamatrix.info_warn) {
                eniokamatrix.info_warn(text,object);
            } else {
                console.log(text,object);
            }
        }
        function info_error(text,object) {
            if (eniokamatrix.info_error) {
                eniokamatrix.info_error(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_debug(text,object) {
            if (eniokamatrix.user_debug) {
                eniokamatrix.user_debug(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_warn(text,object) {
            if (eniokamatrix.user_warn) {
                eniokamatrix.user_warn(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_error(text,object) {
            if (eniokamatrix.user_error) {
                eniokamatrix.user_error(text,object);
            } else {
                console.log(text,object);
            }
        }

        var Class = (function() {
            var __extending = {};

            return {
                extend: function(parent, def) {
                    if (arguments.length == 1) { def = parent; parent = null; }
                    var func = function() {
                        if (arguments[0] ==  __extending) { return; }
                        this.initialize.apply(this, arguments);
                    };
                    if (typeof(parent) == 'function') {
                        func.prototype = new parent( __extending);
                    }
                    var mixins = [];
                    if (def && def.include) {
                        if (def.include.reverse) {
                            // methods defined in later mixins should override prior
                            mixins = mixins.concat(def.include.reverse());
                        } else {
                            mixins.push(def.include);
                        }
                        delete def.include; // clean syntax sugar
                    }
                    if (def) Class.inherit(func.prototype, def);
                    for (var i = 0; (mixin = mixins[i]); i++) {
                        Class.mixin(func.prototype, mixin);
                    }
                    return func;
                },
                mixin: function (dest, src, clobber) {
                    clobber = clobber || false;
                    if (typeof(src) != 'undefined' && src !== null) {
                        for (var prop in src) {
                            if (clobber || (!dest[prop] && typeof(src[prop]) == 'function')) {
                                dest[prop] = src[prop];
                            }
                        }
                    }
                    return dest;
                },
                inherit: function(dest, src, fname) {
                    if (arguments.length == 3) {
                        var ancestor = dest[fname], descendent = src[fname], method = descendent;
                        descendent = function() {
                            var ref = this.parent; this.parent = ancestor;
                            var result = method.apply(this, arguments);
                            ref ? this.parent = ref : delete this.parent;
                            return result;
                        };
                        // mask the underlying method
                        descendent.valueOf = function() { return method; };
                        descendent.toString = function() { return method.toString(); };
                        dest[fname] = descendent;
                    } else {
                        for (var prop in src) {
                            if (dest[prop] && typeof(src[prop]) == 'function') {
                                Class.inherit(dest, src, prop);
                            } else {
                                dest[prop] = src[prop];
                            }
                        }
                    }
                    return dest;
                },
                singleton: function() {
                    var args = arguments;
                    if (args.length == 2 && args[0].getInstance) {
                        var klass = args[0].getInstance(__extending);
                        // we're extending a singleton swap it out for it's class
                        if (klass) { args[0] = klass; }
                    }

                    return (function(args){
                        // store instance and class in private variables
                        var instance = false;
                        var klass = Class.extend.apply(args.callee, args);
                        return {
                            getInstance: function () {
                                if (arguments[0] == __extending) return klass;
                                if (instance) return instance;
                                return (instance = new klass());
                            }
                        };
                    })(args);
                }
            };
        })();

        // finally remap Class.create for backward compatability with prototype
        Class.create = function() {
            return Class.extend.apply(this, arguments);
        };

        /*
          Redistribution and use in source and binary forms, with or without modification, are
          permitted provided that the following conditions are met:
          * Redistributions of source code must retain the above copyright notice, this list
          of conditions and the following disclaimer.
          * Redistributions in binary form must reproduce the above copyright notice, this
          list of conditions and the following disclaimer in the documentation and/or other
          materials provided with the distribution.
          * Neither the name of typicalnoise.com nor the names of its contributors may be
          used to endorse or promote products derived from this software without specific prior
          written permission.
          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
          EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
          THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
          SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
          OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
          HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
          TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */

        var Core = {
            /**
             * @class
             * The Core class
             * @description Core module for the matrix library. This is the central node for all
             * components. This is from this component that the matrix is displayed. It will
             * ensure good working with each dependency. It holds, dataprovider, html renderer,
             * and controller. Moreover, it contains two data handler which will ensure good
             * understanding over data (for rows and columns).
             * <br/>
             * <br/>
             * To ensure good working, you have to user either our components, or yours. You can
             * check in our documentations about APIs for each component.
             * <br/>
             * <br/>
             * This will also contain cache for data in a relativly near future
             */


            /**
             * *DATAPROVIDER : This is an interface and its role is to gather data through
             * callbacks given by the user. It will have to give data as a predefined shape.
             * For more information check the interface description
             * <br/>
             * *CONTROLLER : This will hold on API calls from the user.
             * <br/>
             * *RENDERER : This is the HTML renderer, it is the component that will generate
             * html from a template
             * <br/>
             * *WORKSPACE : This is the div (or space) where the matrix will be displayed by the
             * CORE.
             */
            dataProvider : null,
            controller : null,
            renderer : null,
            cache : null,
            workspace : null,

            /**
             * @function initialize
             * @description Initialize object and set the controller property with the
             * controller that initialized it.
             */
            initialize : function(properties){
                if (!properties){
                    this.setController(new eniokamatrix.IController());
                    this.setCache(new eniokamatrix.Cache());
                    return;
                } else {
                    for (var prop in properties){
                        this[prop] = properties[prop];
                    }
                }
            },

            /**
             * @function
             * @description Set the workspace where the matrix will be displayed.
             * @param workspace javascript object of the workspace.
             * @return this object itself to allow chaining methods.
             */
            setWorkspace : function(workspace){
                this.workspace = workspace;
                return this;
            },

            /**
             * @function
             * @description Get the workspace where the matrix will be displayed.
             * @return workspace where the matrix will be displayed
             */
            getWorkspace : function(){
                return this.workspace;
            },

            /**
             * @function
             * @param dataProvider data provider object that should contain generics methods
             * to gather data necessary to display elements.
             * @return dataProvider implementer.
             */
            setDataProvider : function(dataProvider){
                if (dataProvider)
                    this.dataProvider = dataProvider;
                else
                    this.dataProvider = new eniokamatrix.IDataProvider(this);
                return this.dataProvider;
            },

            /**
             * @function
             * @param controller data provider object that should contain generics methods
             * to call Core API.
             * @return controller implemented.
             */
            setController : function(controller){
                if (controller)
                    this.controller = controller;
                else
                    this.controller = new eniokamatrix.IController(this);
                return this.controller;
            },

            /**
             * @function
             * @param cache implemented to getData
             * @return controller implemented.
             */
            setCache : function(cache){
                if (cache)
                    this.cache = cache;
                else
                    this.controller = new eniokamatrix.Cache();
                return this.cache;
            },

            /**
             * @function
             * @param renderer data provider object that should contain generics methods
             * to render objects.
             * @return renderer implemented.
             */
            setRenderer : function(renderer){
                if (renderer)
                    this.renderer = renderer;
                else
                    this.renderer = new eniokamatrix.IMatrixRenderer(this);
                return this;
            },

            /**
             * @function
             * @description Check for dependencies :
             * DataProvider, Controller or Renderer
             * @return true or false if dependencies are wheter or not set
             */
            _checkDependencies : function() {
                console.log("Something is missing : ");
                console.log("Checking DataProvider : ", this.dataProvider);
                console.log("Checking controller : ", this.controller);
                console.log("Checking DataProvider : ", this.renderer);
                console.log("Checking Workspace : ", this.workspace);
                console.log("Checking DataHandler : ", this.dataHandler);
                console.log("Checking Cache : ", this.Cache);
                if (!this.renderer ||
                    !this.dataProvider ||
                    !this.dataHandler ||
                    !this.controller ||
                    !this.workspace) {
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * @function
             * @description get the columns through DataProvider interface and instanciate them
             * as DataHeader objects
             */
            getColumns : function(){
                return this.dataProvider.getColumns();
            },

            /**
             * @function
             * @description get the rows through DataProvider interface and instanciate them a
             * DataHeader objects
             */
            getRows : function(){
                return this.dataProvider.getRows();
            },

            /**
             * @function
             * @description get the cells through DataProvider interface and instanciate them as
             * DataCell objects
             */
            getData : function(){
                return this.dataProvider.getData();
            },

            /**
             * @function
             * @description Display columns
             */
            displayColumns : function(){
                var columns = this.getColumns();
                for (var column in columns){
                    this._displayColumn(column);
                }
            },

            /**
             * @function
             * @description Display rows
             */
            displayRows : function(){
                this.getWorkspace().appendChild(
                    this.renderer.renderRows(this.getRows())
                );
            },

            /**
             * @function
             * @description Fill cells with a value
             */
            displayCells : function(){
                this.renderer.renderCells(this.getData());
            },

            /**
             * @function
             * @description Display gather all other display and print it
             */
            display : function(){
                this.displayRows();
                this.displayColumns();
                this.displayCells();
            },

            /**
             * @function
             * @description Update matrix & headers. This does a full update, and recollect data
             * through the data provider callbacks
             */
            update : function(){
            },

            /**
             * @function
             * @description export matrix to a CSV
             * @return true if exported, false if no
             */
            exportToCSV : function(){
            },

            /**
             * @function
             * @description export matrix to a javascript table
             * @return true if exported, false if no
             */
            exportMatrix : function(){
            }
        };
        //instanciate Core class into an object
        Core = Class.create(Core);

        //set the Core available for the user
        eniokamatrix.Core = Core;

        var Cache = {
            /**
             * @class
             * The Cache class
             * <br/>
             * @description Cache will be implemented in another version but for now, it will
             * only store Objects as DataHeader and DataCells.
             * <br/>
             */

            columns : [],
            rows : [],
            cells : [],

            initialize : function(properties) {
                if (properties){
                    for (var key in properties){
                        this[key] = properties[key];
                    }
                }
            },

            addColumn : function(object){
            },

            addRow : function(object){
            },

            setColumns : function(columns){
                this.columns = columns;
            },

            setRows : function(rows){
                this.rows = columns;
            },

            setCells : function(cells){
                this.cells = columns;
            },

            getColumns : function(){
                return this.columns;
            },

            getRows : function(){
                return this.rows;
            },

            getCells : function(){
                return this.cells;
            }
        }
        Cache = Class.create(Cache);

        eniokamatrix.Cache = Cache;

        var DataHandler = {
            /**
             * @class
             * The DataHandler class
             * <br/>
             * @description DataHanler module will ensure good understanding of the data
             * gathered. This gives, name, attributes, and test values (for cells and headers).
             * Furthermore it is this component that will get fathers and sons. It also
             * helps to handle data gather. It will make the transition in DataHeader and
             * DataCell.
             * <br/>
             */
            initialize : function(properties) {
            },

            /**
             * @function
             * @description test if the parameter is numeric or not
             * @param test value to test
             * @return true or false
             */
            isNumeric : function(test){
                return "number" == typeof test ?
                    true : false;
            },

            /**
             * @function
             * @description test if the parameter is a string or not
             * @param test value to test
             * @return true or false
             */
            isString : function(test){
                return "string" == typeof test ?
                    true : false;
            },

            /**
             * @function
             * @description test if the parameter is an object or not
             * @param test value to test
             * @return true or false
             */
            isObject : function(test){
                return "object" == typeof test ?
                    true : false;
            },

            /**
             * @function
             * @description test if the parameter is an array or not
             * @param test value to test
             * @return true or false
             */
            isArray : function(test){
                return "[object Array]" == Object.prototype.toString.call(test) ?
                    true : false;
            },

            /**
             * @function
             * @description get the father of current object for row or column
             * @param child is the child from whome we want to get the father
             * @return father object being the father of the one given in the parameters
             */
            getFather : function(child){
            },

            /**
             * @function
             * @description Get the column object specified as a DataHeader object
             * @param object from which we want the DataHeader column object
             * @return dataheader DataHeader object
             */
            getDataHeaderColumn : function(object){
            },

            /**
             * @function
             * @description Get the row object specified as a DataHeader object
             * @param object from which we want the DataHeader row object
             * @return dataheader DataHeader object
             */
            getDataHeaderRow : function(object){
            },

            /**
             * @function
             * @description Get the cell specified as a DataCell object
             * @param object from which we want the DataCell object
             * @return cell DataCell object
             */
            getDataCell : function(cell){
            },

            /**
             * @function
             * @description Set the column object specified as a DataHeader object
             * @param object to set as a DataHeader column object
             * @return dataheader DataHeader object
             */
            setDataHeaderColumn : function(object){
            },

            /**
             * @function
             * @description Set the object specified as a DataHeader object
             * @param object to set as a DataHeader row object
             * @return dataheader DataHeader object
             */
            setDataHeaderRow : function(object){
            },

            /**
             * @function
             * @description Set the cell specified as a DataCell object
             * @param object to set as a DataCell object
             * @return datacell DataCell object
             */
            setDataCell : function(object){
            },

            /**
             * @function
             * @description get the children of current object for row or column
             * @param father is the father from whome we want to get the father
             * @return children objects being as an array the father of the one given in the
             * parameters
             */
            getSons : function(father){
            },

            /**
             * @function
             * @param object from which we want the name
             * @return object.name we want to display (can possibly be any property)
             * TODO : not a clear idea how to do it
             */
            getObjectName : function(object){
                return object.name;
            }
        };
        //Instanciate the datahandler Class into an object
        DataHandler = Class.create(DataHandler);

        //set the DataHandler available to the user
        eniokamatrix.DataHandler = DataHandler;

        var DataHeader = {
            /**
             * @class
             * The DataHeader class
             * <br/>
             * @description DataHeader will be used to store headers for rows and columns after
             * being retrieved by the DataProvider module and instanciated by the Core.
             * <br/>
             */
            initialize : function() {
            },

            /**
             * *OBJECT is the object related to the header
             * *FATHER is the father of the current object. Stay as null if there is no
             * *CHILDREN is the children array containing references to children objects
             * *STATE is the state specific to the DataHeader
             */
            object : null,
            father : null,
            children : [],
            state : null,

            setState : function(state){
                this.state = state;
            },

            getState : function(){
                return this.state;
            }
        };
        //Instanciate the DataHeader Class into an object
        DataHeader = Class.create(DataHeader);

        //set the DataHeader available to the user
        eniokamatrix.DataHeader = DataHeader;

        var DataCell = {
            /**
             * @class
             * The DataCell class
             * <br/>
             * @description DataHeader will be used to store cells at intersections.
             * <br/>
             */
            initialize : function() {
            },

            /**
             * *OBJECT is the object as an intersection
             * *ROW is the row object as a DataHeader
             * *COLUMN is the column object as a DataHeader
             * *STATE is the DataCell specific object
             */
            row : null,
            column : null,
            object : null,
            state : null,

            setState : function(state){
                this.state = state;
            },

            getState : function(){
                return this.state;
            }
        };
        //Instanciate the DataCell Class into an object
        DataCell = Class.create(DataCell);

        //set the DataCell available to the user
        eniokamatrix.DataCell = DataCell;

        var State = {
            /**
             * @class
             * The State class
             * <br/>
             * @description .
             * <br/>
             */
            initialize : function() {
            }
        };
        //Instanciate the State Class into an object
        State = Class.create(State);

        //set the State available to the user
        eniokamatrix.State = State;

        var DataHeaderState = {
            /**
             * @class
             * The DataHeader class
             * <br/>
             * @description
             * <br/>
             */

            /**
             * @function
             * Check if the header is closed or open
             * @return true or false
             */
            isClosed : function(){
            }
        };

        DataHeaderState = Class.extend(State, DataHeaderState);

        var DataCellState = {
            /**
             * @class
             * The DataCellState class
             * <br/>
             * @description
             * <br/>
             */
        };

        DataCellState = Class.extend(State, DataCellState);

        var HTMLEvent = {
            /**
             * @class
             * The HTMLEvent class
             * <br/>
             * @description HTMLEvent is a class that will be instanciated to store events
             * listened by the HTMLEventHandler.
             * <br/>
             */

            /**
             * *ID unique identifier
             * *CALLBACK is the function executed as the event is fired
             * *SELECTOR is selector to know which element is targeted by the event
             * *TYPE is the type of event listened to (ex : click, mouseover, etc.)
             */
            initialize : function(properties) {
                this.id = null;
                this.callback = null;
                this.selector = null;
                this.type = null;
                if (properties)
                for (var prop in properties){
                    this[prop] = properties[prop];
                }
            }
        };
        //Instanciate the HTMLEvent Class into an object
        HTMLEvent = Class.create(HTMLEvent);

        var HTMLEventHandler = {
            /**
             * @class
             * The HTMLEventHandler class
             * <br/>
             * @description HTMLEventHandler module is part of the interface IMatrixRenderer to
             * ensure callback calls efficient on event selected.
             * <br/>
             */

            /**
             * *EVENTS : Events currently bind as an array of HTMLEvent objects
             */
            events : [],

            initialize : function(properties) {
                this.events = [];
                if (properties)
                for (var prop in properties){
                    this[prop] = properties[prop];
                }
            },

            /**
             * @function
             * @description Create an event listener
             * @param selector is the selector to find DOM objects for the event binding
             * @param eventType (ex : click, mouseover, etc.)
             * @param callback is the function that will be executed
             * @return id of the event we starts listening to, or null
             */
            addEventListener : function(selector, eventType, callback){
            },

            /**
             * @function
             * @description Handle events
             * @param selector
             * @param eventType
             * @param callback
             * @return true or false (deleted or not)
             */
            removeEvent : function(id){
            }
        };
        //Instanciate the HTMLEventHandler Class into an object
        HTMLEventHandler = Class.create(HTMLEventHandler);

        //set the HTMLEvetHandler available to the user
        eniokamatrix.HTMLEventHandler = HTMLEventHandler;

        var HTMLTemplate = {
            /**
             * @class
             * The HTMLTemplate class
             * <br/>
             * @description HTMLTemplate module is part of HTMLRenderer to allow customisation
             * to the user, add classes to cells, table, headers, etc.
             * <br/>
             */

            /**
             * *TEMPLATE is a property with JSON format referencing all properties needed to
             * customise the matrix table
             */
            initialize : function(properties) {
                this.template = {};
                if (properties)
                for (var prop in propreties){
                    this[prop] = properties[prop];
                }
            },

            /**
             * @function
             * @description add classes to a html element or to another predefined statements
             * @param elementType either HTML statement or one of the predefined statements
             * @param classes as an array
             */
            addClasses : function(elementType, classes){
            },

            /**
             * @function
             * @description add an id pattern for a html element or to another predefined
             * statement
             * @param elementType either HTML statement or one of the predefined statements
             * @param pattern is an id pattern (has to be defined)
             */
            addIdPattern : function(elementType, pattern){
            },

            /**
             * @function
             * @description add an attribute for a html element or to another predefined
             * statement
             * @param elementType either HTML statement or one of the predefined statements
             * @param attribute attributes as a JSON with name : value
             */
            addAttribute : function(elementType, attributes){
            }
        };
        //Instanciate the HTMLTemplate Class into an object
        HTMLTemplate = Class.create(HTMLTemplate);

        var HTMLRenderer = {
            /**
             * @class
             * The HTML Renderer class
             * <br/>
             * @description Will generate html with predefined functions
             * <br/>
             */
            initialize : function() {
            },

            /**
             * @function
             * @description Add classes to the element given in parameter
             * @param element html element to add the class to
             * @param classes as an array
             * @return element with new classes
             */
            addClasses : function(element, classes){
                if (classes)
                    for (var c in classes){
                        element.className += " " + classes[c];
                    }
                return element;
            },

            /**
             * @function
             * @description Create HTML element with text inside
             * @param element name of the HTML statement
             * @param text to add in the HTML statement
             * @param classes as an array
             * @return element
             */
            createElementWithText : function(element, text, classes){
                var htmlElement = this.createElement(element, classes),
                    htmlText = document.createTextNode(text);
                htmlElement.appendChild(htmlText);
                return htmlElement;
            },

            /**
             * @function
             * @description Create HTML element
             * @param element name of the HTML statement
             * @param classes as an array
             * @return element
             */
            createElement : function(element, classes){
                var htmlElement = document.createElement(element);
                this.addClasses(element, classes);
                return htmlElement;
            }
        };
        HTMLRenderer = Class.create(HTMLRenderer);

        //Load subclasses for MatrixRenderer
        eniokamatrix.HTMLRenderer = HTMLRenderer;
        eniokamatrix.HTMLEventHandler = HTMLEventHandler;
        eniokamatrix.HTMLTemplate = HTMLTemplate;
        eniokamatrix.HTMLEvent = HTMLEvent;

        /**
         * @interface MatrixRenderer
         * @description will handle HTML rendering with two modules, HTMLRenderer and
         * HTMLEventHandler. It generates an HTML table with an HTMLTemplate to design
         * classes, attributes, and style for each important parts of the table.
         */
        var IMatrixRenderer = {
            /**
             * @class
             * The Matrix Renderer interface
             * @description will handle HTML rendering with two modules, HTMLRenderer and
             * HTMLEventHandler. It generates an HTML table with an HTMLTemplate to design
             * classes, attributes, and style for each important parts of the table.
             * <br/>
             * Moreover, this class is also an entry point for matrix html event manager. You
             * have at your disposal the HTMLEventHandler.
             * <br/>
             */
            initialize : function() {
                this.HTMLRenderer = new eniokamatrix.HTMLRenderer();
                this.HTMLEventHandler = new eniokamatrix.HTMLEventHandler();
                this.HTMLTemplate = new eniokamatrix.HTMLTemplate();
            },

            /**
             * @function
             * @description Create the html table
             * @param classes you want to append to your table
             * @return html table that has been created
             */
            renderTable : function(classes){
                if (!classes) var classes = [];
                classes.push("matrix");
                return this.HTMLRenderer.createElement("table", classes);
            },

            renderRow : function(label, level, columnCount){
                var row;
                for (var i = 0; i < level; i++){
                    row
                }
                return this.HTMLRenderer.createElementWithText("td",label);
            },

            /**
             * @function
             * Render Cells
             * @description Inserts paths in intersection, type of cell has to be specified by
             * CellData Object
             * @param cell DataCell object
             * @return html table that has been created
             */
            renderCells : function(cells){
            },

            /**
             * @function
             * Create HTML columns from an array
             * @param columns as an array containing DataHeader objects
             * @return table created
             */
            renderRows : function(rows){
            },

            /**
             * @function
             * Create HTML columns from an array
             * @param columns as an array containing DataHeader objects
             * @return table created
             */
            renderColumns : function(columns){
            },

            /**
             * @function
             * Create HTML column level from an array
             * @return table created
             */
            renderColumnLevel : function(columns){
            },

            /**
             * @function
             * Create HTML columns container from an array
             * @return table created
             */
            renderColumnContainer : function(){
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        IMatrixRenderer = Class.create(IMatrixRenderer);

        eniokamatrix.IMatrixRenderer = IMatrixRenderer;

        var Aggregator = {
            /**
             * @class
             * The Aggregator class
             * @description is used to aggregate cells when closing groups
             * <br/>
             */
            initialize : function(properties) {
            },

            aggregateNumbers : function(numbers){
            },

            aggregateStrings : function(strings){
            },

            aggregateObjects : function(objects){
            },

            aggregateArrays : function(arrays){
            }
        };

        Aggregator = Class.create(Aggregator);

        eniokamatrix.Aggregator = Aggregator;

        var IController = {
            /**
             * @class
             * The Controller class
             * @description Handle any interactions with external by a list of predefined API
             * like init, create, update, etc.
             * <br/>
             */
            initialize : function(properties) {
            },

            /**
             * @function
             * @description init the matrix and set the Core and the DataProvider
             * @param column contain column object
             * @return html table header containing object name
             */
            init : function(){
                this.core = new eniokamatrix.Core({
                    "controller" : this
                });
                return this.core;
            },

            /**
             * @function
             * @description Create the matrix
             * @return this object to allow chaining methods
             */
            create : function(){
            },

            /**
             * @function
             * @description Update the matrix
             * @return this object to allow chaining methods
             */
            update : function(){
            },

            /**
             * @function
             * @description refresh the graphical components only
             * @return this object to allow chaining methods
             */
            refresh : function(){
            },

            /**
             * @function
             * @description export the matrix
             * @param type select and specify the type for the export CSV or JS Array
             * @return this object to allow chaining methods
             */
            export : function(type){
            },

            /**
             * @function
             * @param dataProvider
             * @return this object to allow chaining methods
             */
            setCoreDataProvider : function(dataProvider){
                return this.core.setDataProvider(dataProvider);
            },

            /**
             * @function
             * @param renderer
             * @return this object to allow chaining methods
             */
            setCoreMatrixRenderer : function(renderer){
                return this.core.setRenderer(renderer);
            }
        };
        IController = Class.create(IController);

        /**
         * DATA PROVIDER PART
         */
        var IDataProvider = {
            /**
             * @class
             * The DataProvider
             * @description This is the interface to handle data retrieving and will work
             * through only three methods calling callbacks.
             * <br/>
             * <br/>
             */
            initialize : function() {
            },

            /**
             * @function
             * @description getData will retrieve a sparse matrix given by dataCallBack function
             * @return sparse matrix containing paths.
             */
            getData : function(){
            },

            /**
             * @function
             * @description getRows will retrieve an array of objects that will be instanciated
             * as DataHeader
             * @return rows.
             */
            getRows : function(){
            },

            /**
             * @function
             * @description getColumns will retrieve an array of objects that will be
             * instanciated as DataHeader
             * @return columns.
             */
            getColumns : function(){
            },

            /**
             * @function
             * @description Will retrieve an intersection objects. This method implementation is optional.
             * @param row object
             * @param column object
             * @return objects in intersection.
             */
            getIntersection : function(row, column){
            },

            /**
             * @function
             * @description Will retrieve father id of an object.
             * @param object from which we want to get sons from.
             * @return object sons.
             */
            getParentId : function(object){
            },

            /**
             * @function
             * @description Will retrieve id of an object.
             * @param object from which we want to get sons from.
             * @return object sons.
             */
            getId : function(object){
            }
        };
        IDataProvider = Class.create(IDataProvider);

        eniokamatrix.IMatrixRenderer = IMatrixRenderer;
        eniokamatrix.IDataProvider = IDataProvider;
        eniokamatrix.IController = IController;

        eniokamatrix.Core = Core;

        // And the capability to extend these predefined classes
        eniokamatrix.extend = Class.extend;

        // That's all folks
        return eniokamatrix;
    }(enioka.matrix || {})
);
