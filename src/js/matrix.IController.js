var enioka = (enioka || {});

enioka.matrix = (
    function(eniokamatrix){

        /**
         * @class
         * @memberof enioka.matrix
         * @classdesc Handle any interactions with external component by a list of predefined API
         * like create, update, etc.
         * <br/>
         */
        var IController = {
            initialize : function(properties) {
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
             * @description handle on click event on DOM elements
             * @param object
             */
            beforeHeaderClick : function(object){
            },

            //////////////
            /// EVENTS ///
            //////////////

            /**
             * @function
             * @description handle hover on DOM elements
             * @param object {object}
             */
            headerClick : function(object){
            },

            afterHeaderClick : function(object){
            },

            beforeCellClick : function(object){
            },

            cellClick : function(object){
            },

            afterCellClick : function(object){
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
