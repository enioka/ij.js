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
             * @description getData will recovered the data of the row's header, and the column's
             * header, calculate the nomber of commun character between the two headers, and set 
             * in the approppriate cell. This functions return the Array with the cell's data.
             * @param {Array} rowsObjects the object content in the row
             * @param {Array} columnObjects the object content in the column
             * @return {Array} relations an Array with all the cell's data
             */
            getData : function(rowsObjects, columnsObjects){
            },

            /**
             * @function
             * @description getRows will retrieve an array of objects that will be instanciated
             * as DataHeader by the function getrows in the component
             * @return {Array}
             */
            getRows : function(){
            },

            /**
             * @function
             * @description getColumns will retrieve an array of objects that will be
             * instanciated as DataHeader by the function getColumns in the component
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
