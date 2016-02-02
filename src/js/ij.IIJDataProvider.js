var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {

        /**
         * @class
         * @memberof enioka.ij
         * @classdesc  This is the interface to handle data retrieving and will work
         * through only three methods calling callbacks.
         * <br/>
         * <br/>
         */
        var IIJDataProvider = {
            initialize : function(parent) {
            },

            /**
             * @function
             * @description getData will provide data at each intersection (i,j) that's where
             * the name of this library come from if you were wondering
             * @param {Array} rowsObjects the object content in the row
             * @param {Array} columnObjects the object content in the column
             * @return {*} relations an Array with the data cell
             */
            getData : function(rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description getRows will return an array of objects (rows)
             * @return {Array}
             */
            getRows : function(){
            },

            /**
             * @function
             * @description getColumns will return an array of objects (columns)
             * @return {Array}
             */
            getColumns : function(){
            },

        };
        IIJDataProvider = Class.create(IIJDataProvider);

        eniokaij.IIJDataProvider = IIJDataProvider;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
