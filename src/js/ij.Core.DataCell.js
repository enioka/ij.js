var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {

        /**
         * @class
         * @memberof enioka.ij.Core
         * @classdesc DataHeader will be used to store cells at intersections.
         */
        var DataCell = {
            initialize : function() {
            },

            /**
             * @member
             * @memberof enioka.ij.DataCell
             */
            row : null,
            /**
             * @member
             * @memberof enioka.ij.DataCell
             */
            column : null,
            /**
             * @member
             * @memberof enioka.ij.DataCell
             */
            object : null,
            /**
             * @member
             * @memberof enioka.ij.DataCell
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
        eniokaij.DataCell = DataCell;

        return eniokaij;
    }(enioka.ij || {})
);
