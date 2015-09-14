var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.IMatrixRenderer
         * @classdesc HTMLTemplate module is part of HTMLRenderer to allow customisation
         * to the user, add classes to cells, table, headers, etc.
         * <br/>
         */
        var HTMLTemplate = {
            initialize : function() {
            },

            /**
             * @function
             * @description add classes to a html element or to another predefined statements
             * @param elementType either HTML statement or one of the predefined statements
             * @param classes as an array
             */
            addClasses : function(elementType, classes){
            },

            /**
             * @function
             * @description add an id pattern for a html element or to another predefined
             * statement
             * @param elementType either HTML statement or one of the predefined statements
             * @param pattern is an id pattern (has to be defined)
             */
            addIdPattern : function(elementType, pattern){
            },

            /**
             * @function
             * @description add an attribute for a html element or to another predefined
             * statement
             * @param elementType either HTML statement or one of the predefined statements
             * @param attribute attributes as a JSON with name : value
             */
            addAttribute : function(elementType, attributes){
            }
        };
        //Instanciate the HTMLTemplate Class into an object
        HTMLTemplate = Class.create(HTMLTemplate);

        eniokaij.HTMLTemplate = HTMLTemplate;

        return eniokaij;
    }(enioka.ij || {})
);
