var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @memberof enioka.ij.IIJRenderer
         * @classdesc Will generate html with predefined functions
         */
        var HTMLRenderer = {
            initialize : function() {

            },

            /**
             * @function
             * @description Add classes to the element given in parameter
             * @param element html element to add the class to
             * @param classes as an array
             * @return element with new classes
             */
            addClasses : function(element, classes, reset){
                if (reset)
                    element.className = "";
                if (classes)
                    for (var i = 0; i < classes.length;i++){
                        element.classList.add(classes[i]);
                    }
                return element;
            },

            addAttribute : function(element, attributeName, attributeValue) {
                element.setAttribute(attributeName, attributeValue);
                return element;
            },

            /**
             * @param element
             * @param attributeName
             * @param attributeValue
             */
            addCSS : function(element, attributeName, attributeValue) {
                element.style[attributeName] = attributeValue;
                return element;
            },
            /**
             * @function
             * @description Create HTML element with text inside
             * @param element name of the HTML statement
             * @param text to add in the HTML statement
             * @param classes as an array
             * @return element
             */
            createElementWithText : function(element, text, classes){
                var htmlElement = this.createElement(element, classes),
                    htmlText = document.createTextNode(text);
                htmlElement.appendChild(htmlText);
                return htmlElement;
            },

            /**
             * @function
             * @description Create HTML element
             * @param element name of the HTML statement
             * @param classes as an array
             * @return element
             */
            createElement : function(element, classes){
                var htmlElement = document.createElement(element);
                if (classes)
                    this.addClasses(htmlElement, classes);
                return htmlElement;
            },

            appendChild : function(element, child, prepend){
                var children = [];
                //prepend function
                if (prepend) {
                    while (element.firstChild) {
                        children.push(element.firstChild);
                        element.removeChild(element.firstChild);
                    }
                    element.appendChild(child);
                    for (var i = 0; i < children.length; i++){
                        element.appendChild(children[i]);
                    }
                    return element;
                }
                return element.appendChild(child);
            }
        };
        HTMLRenderer = Class.create(HTMLRenderer);

        //Load subclasses for MatrixRenderer
        eniokaij.HTMLRenderer = HTMLRenderer;

        return eniokaij;
    }(enioka.ij || {})
);
