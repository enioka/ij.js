var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.Core
         * @classdesc DataHeader will be used to store headers for rows and columns after
         * being retrieved by the DataProvider module and instanciated by the Core.
         */
        var DataHeader = {
            initialize : function() {
            },

            /**
             * @function
             * @description Set a new state for the object
             * @param {State} state - State object
             */
            setState : function(state){
                this.state = state;
            },

            /**
             * @function
             * @description get the current object state
             * @return {State}
             */
            getState : function(){
                return this.state;
            }
        };
        //Instanciate the DataHeader Class into an object
        DataHeader = Class.create(DataHeader);

        //set the DataHeader available to the user
        eniokaij.DataHeader = DataHeader;

        return eniokaij;
    }(enioka.ij || {})
);
