var enioka = (enioka || {});

enioka.matrix = (
    function (eniokamatrix) {
        /**
         * @class
         * @memberof enioka.matrix
         * @classdesc state object containing everything related to graphical
         * interpretation
         */
        var State = {
            initialize : function() {
            }
        };
        //Instanciate the State Class into an object
        State = Class.create(State);

        //set the State available to the user
        eniokamatrix.State = State;



        return eniokamatrix;
    }(enioka.matrix || {})
);
