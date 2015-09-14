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
                var rows = Math.floor(Math.random() * 100);
                var columns = Math.floor(Math.random() * 100);
                var matrix = [];
                for (var i = 0; i < rows; i++){
                    matrix.push(new Array());
                    for (var j = 0; j < columns; j++){
                        var pathNumber = Math.floor(Math.random() * 21) - 10;
                        if (pathNumber > 0)
                            matrix[i][j] = pathNumber;
                    }
                }
                return matrix;
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
