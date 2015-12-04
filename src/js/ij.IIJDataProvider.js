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
        IIJDataProvider = Class.create(IIJDataProvider);

        eniokaij.IIJDataProvider = IIJDataProvider;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
