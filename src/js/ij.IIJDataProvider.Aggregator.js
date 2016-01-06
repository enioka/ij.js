var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.IIJDataProvider
         * @classdesc Will handle aggregation for rows, columns & cells. This is data part
         */
        var Aggregator = {

            /**
             * @function
             */
            initialize : function() {
            },

            /**
             * @function
             * @description
             * @param {Array} rowsObjects content all the object of the row head 
             * @param {Array} columnsObjects content all the object of the column head
             * @returns {Array} result the concatenation of th ID column and ID row for each cell
             */
            aggregateData : function(rowsObjects, columnsObjects) {
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        Aggregator = Class.create(Aggregator);

        eniokaij.Aggregator = Aggregator;


        return eniokaij;
    }(enioka.ij || {})
);
