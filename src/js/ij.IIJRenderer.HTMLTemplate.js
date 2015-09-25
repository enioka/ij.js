var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.IIJRenderer
         * @classdesc HTMLTemplate module is part of HTMLRenderer to allow customisation
         * to the user, add classes to cells, table, headers, etc.
         * <br/>
         */
        var HTMLTemplate = {
            initialize : function() {
                this.template = {};
            },

            /**
             * @function
             * @description add classes to a html element or to another predefined statements
             * @param elementType either HTML statement or one of the predefined statements
             * @param classes as an array
             */
            addClassPrefix : function(elementType, classPrefix){
                if (!this.template[elementType])
                    this.template[elementType] = {};
                this.template[elementType].classPrefix = classPrefix;
            },

            /**
             * @function
             * @description add an id pattern for a html element or to another predefined
             * statement
             * @param elementType either HTML statement or one of the predefined statements
             * @param pattern is an id pattern (has to be defined)
             */
            addIdPrefix : function(elementType, idPrefix){
                if (!this.template[elementType])
                    this.template[elementType] = {};
                this.template[elementType].idPrefix = idPrefix;
            },

            getAttribute : function(elementType, propertyName){
                if (this.template[elementType])
                    return this.template[elementType][propertyName];
                else
                    return null;
            }
        };
        //Instanciate the HTMLTemplate Class into an object
        HTMLTemplate = Class.create(HTMLTemplate);

        eniokaij.HTMLTemplate = HTMLTemplate;

        return eniokaij;
    }(enioka.ij || {})
);
