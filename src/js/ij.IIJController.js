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

            /**
             * @function
             * @param
             */
            initialize : function(parent, core){
            },

            /**
             * @function
             * @description event on cell click
             * @param {HTMLEvent} event
             * @param {*} cellData contains data correponding to the cell
             * @param {Array} rowsObjects rows objects of this cell
             * @param {Array} columnsObjects columns objects of this cell
             */
            onCellClick : function(event, cellData, rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description event when cursor is in the cell
             * @param {HTMLEvent} event
             * @param {*} cellData contains data correponding to the cell
             * @param {Array} rowsObjects rows objects of this cell
             * @param {Array} columnsObjects columns objects of this cell
             */
            onCellHover : function(event, cellData, rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description event when cursor is out of the cell
             * @param {HTMLEvent} event
             * @param {*} cellData contains data correponding to the cell
             * @param {Array} rowsObjects rows objects of this cell
             * @param {Array} columnsObjects columns objects of this cell
             */
            onCellOut : function(event, cellData, rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description event when cursor fly hover a header
             * @param {HTMLEvent} event
             * @param {*} cellData contains data correponding to the cell
             * @param {Array} rowsObjects rows objects of this cell
             * @param {Array} columnsObjects columns objects of this cell
             */
            onHeaderHover : function(event, headerNode){
            },

            /**
             * @function
             * @description event when cursor fly out of a header
             * @param {HTMLEvent} event
             */
            onHeaderOut : function(event, headerNode){
            },

            /**
             * @function
             * @description initialize the prerogative for change the header,
             * when a event is coming
             * @param {HTMLElement} event
             * @param {Object} headerNode provided by the core
             */
            onHeaderClick : function(event, headerNode){
            },

        };
        IIJController = Class.create(IIJController);


        eniokaij.IIJController = IIJController;


        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
