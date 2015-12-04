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
             * @param {Array} rowsObjects
             * @param {Array} columnsObjects
             * @param {String} filter
             * @returns {Array} data
             */
            aggregateData : function(rowsObjects, columnsObjects, filter) {
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        Aggregator = Class.create(Aggregator);

        eniokaij.Aggregator = Aggregator;


        return eniokaij;
    }(enioka.ij || {})
);
