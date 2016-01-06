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

            /**
             * @function
             * @description
             * @param modelet
             */
            initialize : function(parent, core){
            },

            /**
             * @function
             * @description onCellClick display an alert if a event are applicable
             * @param {HTMLEvent} event
             * @param {Array} cellData data provide by the DataProvider (logic)
             */
            onCellClick : function(event, cellData){
            },

            /**
             * @function
             * @description onCellHover applied new color at TD element and TH element when 
             * a event are applicable
             * @param {HTMLEvent} event 
             */
            onCellHover : function(event){
            },

            /**
             * @function
             * @description on cellOut applied original color at TD element and TH element when 
             * a event stop
             * @param {HTMLEvent} event
             */
            onCellOut : function(event){
            },

            /**
             * @function
             * @description give an information when a event is applicable
             * @param {HTMLEvent} event
             */
            onHeaderHover : function(event){
            },

            /**
             * @function
             * @description give an information when a event is stop
             * @param {HTMLEvent} event
             */
            onHeaderOut : function(event){
            },

            /**
             * @function
             * @description allows to change the content of the header (replace all the objects
             * and the their cummun first letter just by the commun first letter), and vice versa
             * @param {HTMLElement} event
             * @param {Element} headerNode provided by the core (properties can be accessed by
             * calling core functions)
             */
            onHeaderClick : function(event, headerNode){
            },

        };
        IIJController = Class.create(IIJController);


        eniokaij.IIJController = IIJController;


        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
