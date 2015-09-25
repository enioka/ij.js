var enioka = (enioka || {});

enioka.ij = (
    function(eniokaij){

        /**
         * @class
         * @memberof enioka.ij
         * @classdesc Handle any interactions with external component by a list of predefined API
         * like create, update, etc.
         * <br/>
         */
        var IIJController = {
            initialize : function(properties) {
            },

            onCellHover : function(event){
            },

            onCellClick : function(event){
            },

            onCellOut : function(event){
            },

            onHeaderHover : function(event){
            },

            onHeaderOut : function(event){
            }
        };
        IIJController = Class.create(IIJController);


        eniokaij.IIJController = IIJController;


        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
