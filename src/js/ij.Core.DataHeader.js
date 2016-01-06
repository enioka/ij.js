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
            
        };
        //Instanciate the DataHeader Class into an object
        DataHeader = Class.create(DataHeader);

        //set the DataHeader available to the user
        eniokaij.DataHeader = DataHeader;

        return eniokaij;
    }(enioka.ij || {})
);
