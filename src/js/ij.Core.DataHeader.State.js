var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij
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
        eniokaij.State = State;

        return eniokaij;
    }(enioka.ij || {})
);
