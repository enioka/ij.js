var enioka = (enioka || {});

enioka.matrix = (
    function(eniokamatrix){

        /**
         * @class
         * @memberof enioka.matrix
         * @classdesc Handle any interactions with external by a list of predefined API
         * like init, create, update, etc.
         * <br/>
         */
        var IController = {
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


        eniokamatrix.IController = IController;


        // And the capability to extend these predefined classes
        eniokamatrix.extend = Class.extend;

        // That's all folks
        return eniokamatrix;
    }(enioka.matrix || {})
);
