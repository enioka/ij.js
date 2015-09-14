var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.IDataProvider
         * @classdesc Will handle aggregation for rows, columns & cells. This is data part
         */
        var Aggregator = {

            /**
             * @function
             */
            initialize : function() {
                this.HTMLRenderer = new eniokamatrix.HTMLRenderer();
                this.HTMLEventHandler = new eniokamatrix.HTMLEventHandler();
                this.HTMLTemplate = new eniokamatrix.HTMLTemplate();
            }
        };
        //Instanciate the IMatrixRenderer Class into an object
        Aggregator = Class.create(Aggregator);

        eniokaij.Aggregator = Aggregator;


        return eniokaij;
    }(enioka.ij || {})
);
