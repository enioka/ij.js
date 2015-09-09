var enioka = (enioka || {});

enioka.matrix = (
    function (eniokamatrix) {

        /**
         * @class
         * @memberof enioka.matrix
         * @classdesc DataHeader will be used to store cells at intersections.
         */
        var DataCell = {
            initialize : function() {
            },

            /**
             * @member
             * @memberof enioka.matrix.DataCell
             */
            row : null,
            /**
             * @member
             * @memberof enioka.matrix.DataCell
             */
            column : null,
            /**
             * @member
             * @memberof enioka.matrix.DataCell
             */
            object : null,
            /**
             * @member
             * @memberof enioka.matrix.DataCell
             */
            state : null,

            /**
             * @function
             */
            setState : function(state){
                this.state = state;
            },

            /**
             * @function
             */
            getState : function(){
                return this.state;
            }
        };
        //Instanciate the DataCell Class into an object
        DataCell = Class.create(DataCell);

        //set the DataCell available to the user
        eniokamatrix.DataCell = DataCell;

        return eniokamatrix;
    }(enioka.matrix || {})
);
