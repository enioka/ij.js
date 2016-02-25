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
            //HTML / or ohter type interface that can provide values and use predefined
            //functions to modify ij through the controller
            ui : null,

            core : null,

            initialize : function(core){
                this.core = core;
            },

            setUI : function(ui) {
                this.ui = ui;
                this.ui.controller = this;
            },

            setRenderer : function(Renderer) {
                this.core.setRenderer(new Renderer());
            },

            setDataProvider : function(DataProvider) {
                this.core.setDataProvider(new DataProvider());
            },

            /**
             * @function
             * @description on cellHover
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellHover : function(event, cellData){
            },

            /**
             * @function
             * @description on cellClick
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellClick : function(event, cellData){
            },

            /**
             * @function
             * @description on cellOut
             * @param event HTMLEvent
             * @param cellData cellData as provided by the DataProvider
             */
            onCellOut : function(event, cellData){
            },

            /**
             * @function
             * @description
             * @param event HTMLEvent
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderHover : function(event, headerNode){
            },

            /**
             * @function
             * @description
             * @param event HTMLEvent
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderOut : function(event, headerNode){
            },

            /**
             * @function
             * @description
             * @param event
             * @param headerNode {Object} provided by the core (properties can be accessed by calling core functions)
             */
            onHeaderClick : function(event, headerNode){
            },
            /**
             * @function
             * @description
             * @param filter {String}
             */
            onGraphicalRowFilter : function(filter) {
            },

            refresh : function(type, params) {
                this.core.refresh(type, params);
            },

            getWorkspace : function(){
                return this.core.getWorkspace();
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
