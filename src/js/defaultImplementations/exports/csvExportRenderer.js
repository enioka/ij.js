var csvExportRenderer = {

    initialize : function(parent){
        this.component = parent;
        this.renderer = new enioka.ij.HTMLRenderer();
        this.template = new enioka.ij.HTMLTemplate();
    },

    renderRowsContainer : function(){
        return "";
    },

    applyRowSpan : function(renderedObject, property){
        return renderedObject;
    },

    applyColSpan : function(renderedObject, property){
        return renderedObject;
    },

    renderRowContainer : function(){
        return "\n";
    },

    renderLeftUpperCorner : function(){
        return " ";
    },

    renderColumnsLevelContainer : function(){
        return "\n";
    },

    renderColumnsContainer : function(){
        return "";
    },

    renderSummary : function(renderedObject, type){
        var renderedSummary = this._createRenderedJSON(
            renderedObject.id + "__summary__",
            null,
            renderedObject.label + "__summary__",
            30,
            renderedObject.label,
            (renderedObject.open || true),
            (renderedObject.hidden || false)
        );
        renderedSummary.summary = true;
        renderedSummary.type = type;
        return renderedSummary;
    },

    appendChild : function(element, child) {
        if (element === "\n" &&
            child === " ")
            return child;
        else if (element === "\n" ||
            element === "" ||
            child === "\n" ||
            child === "")
            return element + child;
        return element + ";" + child;
    },

    renderIntoWorkspace : function(workspace, container) {
        window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(container));
        return container;
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
        return "";
    },

    setCSSProperty : function(property, element, propertyValue){
        return element;
    },

    emptyCSSProperty : function(property, element){
        return element;
    },

    clearOutput : function(output) {
        return "";
    },

    addClasses : function(element, elementType, classes, properties){
        return element;
    },

    addEventsToRendering : function(rendering, events){
        return rendering;
    },

    clearOutput : function(output) {
        while (output.lastChild){
            output.removeChild(output.lastChild);
        }
        return output;
    },

    reRenderColumn : function(renderedColumn, events){
        return renderedColumn;
    },

    reRenderRow : function(renderedRow, events){
        return renderedRow;
    }
};

csvExportRenderer = Class.extend(enioka.ij.IIJRenderer, csvExportRenderer);
