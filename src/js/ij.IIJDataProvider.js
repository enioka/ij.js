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
             * @description getData will retrieve a sparse matrix given by dataCallBack function
             * @param {Array} rowsObjects the object content in the row
             * @param {Array} columnObjects the object content in the column
             * @return {Array} relations matrix containing paths.
             */
            getData : function(rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description getRows will retrieve an array of objects that will be instanciated
             * as DataHeader
             * @return {Array}
             */
            getRows : function(){
            },

            /**
             * @function
             * @description getColumns will retrieve an array of objects that will be
             * instanciated as DataHeader
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
