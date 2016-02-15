var DefaultHTMLRenderer = {

    initialize : function(parent){
        this.component = parent;
        this.renderer = new enioka.ij.HTMLRenderer();
        this.template = new enioka.ij.HTMLTemplate();
    },

    renderRowsContainer : function(){
        return this.renderer.createElement("tbody");
    },

    applyRowSpan : function(renderedObject, property){
        this.renderer.addAttribute(renderedObject,
            "rowspan",
            property);
        return renderedObject;
    },

    applyColSpan : function(renderedObject, property){
        this.renderer.addAttribute(renderedObject,
            "colspan",
            property);
        return renderedObject;
    },

    renderRowContainer : function(){
        var row = this.renderer.createElement("tr");
        return row;
    },

    renderSubTotalHeader : function(label){
        return this.renderer.createElementWithText("th", label + " summary");
    },

    renderLeftUpperCorner : function(){
        return this.renderer.createElement("th");
    },

    renderColumnsLevelContainer : function(){
        return this.renderer.createElement("tr");
    },

    renderColumnsContainer : function(){
        return this.renderer.createElement("thead");
    },

    renderSummary : function(renderedObject, type){
        var renderedSummary = this._createRenderedJSON(
            renderedObject.id + "__summary__",
            null,
            renderedObject.label + "__summary__",
            30,
            this.renderer.addAttribute(
                this.renderer.createElementWithText("th", renderedObject.label + "__summary__"),
                "id",
                this.template.getAttribute(type,"idPrefix") + renderedObject.id
            ),
            (renderedObject.open || true),
            (renderedObject.hidden || false)
        );
        renderedSummary.summary = true;
        renderedSummary.type = type;
        return renderedSummary;
    },

    appendChild : function(element, child) {
        return this.renderer.appendChild(element, child);
    },

    renderIntoWorkspace : function(element, child) {
        return this.renderer.appendChild(element, child);
    },

    _createRenderedJSON : function(id, object, label, order, rendering, open, hidden, hasSummary, cannotReRoot){
        return {
            "id" : id,
            "object" : object,
            "label" : label,
            "order" : order,
            "rendering" : rendering,
            "open" : open,
            "hidden" : hidden,
            "hasSummary" : (hasSummary || false),
            "cannotReRoot" : (cannotReRoot || true)
        };
    },

    renderContainer : function(){
        return this.renderer.createElement("table",["table","table-bordered"]);
    },

    setCSSProperty : function(property, element, propertyValue){
        return element.style.setProperty(property, propertyValue);
    },

    emptyCSSProperty : function(property, element){
        return element.style.setProperty(property, "");
    },

    clearOutput : function(output) {
        while (output.firstChild) {
            output.removeChild(output.firstChild);
        }
    },

    _getSummaryHoverCell : function(cellData) {
        return this.renderer.createElementWithText("p","There is " + cellData + " characters shared").outerHTML;
    },


    addClasses : function(element, elementType, classes, properties){
        var classPrefix = this.template.getAttribute(elementType, "classPrefix");
        for (var i = 0; i < classes.length; i++){
            classes[i] = classPrefix + classes[i];
        }
        return this.renderer.addClasses(element, classes, properties);
    },

    addEventsToRendering : function(rendering, events){
        var HeaderEvents = rendering.cloneNode(true);
        for (var event in events){
            HeaderEvents.addEventListener(event, events[event]);
        }
        return HeaderEvents;
    },

    clearOutput : function(output) {
        while (output.lastChild){
            output.removeChild(output.lastChild);
        }
        return output;
    },

    reRenderColumn : function(renderedColumn, events){
        if (!renderedColumn.children) {
            var vtext = this.renderer.createElement("div",
                                                    ["vtext"]);
            var vtextInner = this.renderer.createElementWithText("div",
                                                                 renderedColumn.label,
                                                                 ["vtext__inner"]);
            renderedColumn.rendering.textContent = "";
            this.appendChild(vtext,
                             vtextInner);
            this.appendChild(renderedColumn.rendering,
                             vtext);
        }
        renderedColumn.rendering = this.addEventsToRendering(renderedColumn.rendering,
                                                             events);
        return renderedColumn;
    },

    reRenderRow : function(renderedRow, events){
        renderedRow.rendering = this.addEventsToRendering(renderedRow.rendering,
                                                          events);
        return renderedRow;
    }
};

DefaultHTMLRenderer = Class.extend(enioka.ij.IIJRenderer, DefaultHTMLRenderer);
