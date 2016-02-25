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
        var IIJControllerUI = {

            //Workspace will define where to work !
            workspace : null,

            /**
             * @memberof enioka.ij.IIJControllerUI
             * @member {interface} controller
             */
            controller : null,

            initialize : function(controller, workspace, params){
                if (controller) {
                    this.controller = controller;
                    this.renderer = this.controller.core.renderer.renderer;
                } else {
                    return;
                }
                if (workspace)
                    this.workspace = workspace;
                for (var f in params) {
                    if (typeof this[f] == "function") {
                        element = this._buildUIElement(f, params[f]);
                        this.renderer.appendChild(this.workspace, element);
                    }
                }
            },

            _buildUIElement : function(func, params){
                var element = this.renderer.createElement("div",
                                                          ["form-group"]);
                if (!params.type) {
                    this.renderer.appendChild(element,
                                              this._buildUIButton(func, params));
                } else {
                    switch (params.type) {
                    case "select" :
                        var elements = this._buildUISelect(func, params);
                        for (var i = 0; i < elements.length; i++) {
                            this.renderer.appendChild(element,
                                                      elements[i]);
                        }
                        break;
                    }
                }
                console.log(element);
                return element;
            },

            _buildUIButton : function(func, params){
                var button = this.renderer.createElementWithText("button",
                                                                 params.label,
                                                                 params.classes);
                button.addEventListener("click", this[func].bind(this));
                return button;
            },

            _buildUISelect : function(func, params){
                //create label
                var label = this.renderer.createElementWithText("label", params.label);
                this.renderer.addAttribute(label, "for", params.label);
                //create select
                var select = this.renderer.createElement("select",params.classes);
                this.renderer.addAttribute(select, "id", params.label);
                //append select to form group
                for (var i = 0; i < params.options.length; i++){
                    var option = this.renderer.createElementWithText("option",
                                                                     params.options[i]);
                    this.renderer.appendChild(select, option);
                }
                select.addEventListener("change", this[func].bind(this, params.values));
                return [label, select];
            },

            setWorkspace : function(workspace){
            },

            updateRenderer : function(params, event, renderer){
                console.log(params, event);
                this.controller.setRenderer(params[event.currentTarget.selectedIndex]);
            },

            updateDataProvider : function(params, event, dataprovider){
                console.log(params, event);
                this.controller.setDataProvider(params[event.currentTarget.selectedIndex]);
            },

            zoomIn : function(event, number){
                var workspace = this.controller.getWorkspace(),
                    currentZoom = workspace.style.zoom;
                console.log(currentZoom);
                if (currentZoom == "" || !currentZoom) {
                    workspace.style.zoom = 1;
                    return;
                }
                if (number) {
                    console.log(number);
                    workspace.style.zoom = parseFloat(currentZoom) + parseFloat(number);
                }
                else {
                    console.log("no number");
                    workspace.style.zoom = parseFloat(currentZoom) + parseFloat(0.1);
                }
                console.log(currentZoom, workspace.style.zoom);
            },

            resetZoom : function(event, number){
                var workspace = this.controller.getWorkspace();
                workspace.style.zoom = 1;
                return;
            },

            zoomOut : function(event, number){
                var workspace = this.controller.getWorkspace(),
                    currentZoom = workspace.style.zoom;
                if (currentZoom == "" || ! currentZoom)
                    currentZoom = 1;
                if (number)
                    workspace.style.zoom = currentZoom - number;
                else
                    workspace.style.zoom = parseFloat(currentZoom) - parseFloat(0.1);
            },

            refresh : function(event, type, dataFilter){
                if (this.controller && this.controller.refresh)
                    this.controller.refresh(type, dataFilter);
            }
        };
        IIJControllerUI = Class.create(IIJControllerUI);


        eniokaij.IIJControllerUI = IIJControllerUI;


        // And the capability to extend these predefined classes
        eniokaij.extend = Class.extend;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
