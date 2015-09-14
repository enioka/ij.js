var enioka = (enioka || {});

enioka.ij = (
    function(eniokaij){

        /**
         * @class
         * @memberof enioka.ij
         * @classdesc Handle any interactions with external component by a list of predefined API
         * like create, update, etc.
         * <br/>
         */
        var IIJController = {
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
        IIJController = Class.create(IIJController);


        eniokaij.IIJController = IIJController;


        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
