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
            initialize : function(core){
            },

            /**
             * @function
             * @description on cellHover
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellHover : function(event, cellData){
            },

            /**
             * @function
             * @description on cellClick
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellClick : function(event, cellData){
            },

            /**
             * @function
             * @description on cellOut
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellOut : function(event, cellData){
            },

            /**
             * @function
             * @description
             * @param event HTMLEvent
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderHover : function(event, headerNode){
            },

            /**
             * @function
             * @description
             * @param event HTMLEvent
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderOut : function(event, headerNode){
            },

            /**
             * @function
             * @description
             * @param event
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderClick : function(event, headerNode){
            },
            /**
             * @function
             * @description
             * @param filter {String}
             */
            onGraphicalRowFilter : function(filter) {
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
