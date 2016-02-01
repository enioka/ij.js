var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {
        /**
         * @class
         * @description Handle functions to add/create Classe/Attribute/node
         * @memberof enioka.ij.IIJRenderer
         * @classdesc Will generate html with predefined functions
         */
        var HTMLRenderer = {
            initialize : function() {

            },

            /**
             * @function
             * @description Add classe(s) to the element given in parameter
             * @param {HTMLElement} element an HTMLElement with class, attribute, etc...
             * @param {Array} classes an array containing classe(s) to be added
             * @param {Boolean} reset if reset is specified, all classes are going to be removed before applying new ones
             * @return {HTMLElement} element with new classe(s) added
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

            /**
             * @function
             * @description Add an attribute with a value at an element
             * @param {HTMLElement} element the element whose we add an attribute
             * @param {string} attributeName the name of the attribute to be added
             * @param {string} attributeValue the value given to the attribute
             * @return {HTMLElement} element with new attribute
             */
            addAttribute : function(element, attributeName, attributeValue) {
                element.setAttribute(attributeName, attributeValue);
                return element;
            },

            /**
             * @function
             * @description Add a CSS property to an element given in parameter
             * @param {HTMLElement} element the element whose we add a parameter
             * @param {string} attributeName the name of the attribute to be added
             * @param {string} attributeValue the value given to the attribute
             * @return {HTMLElement} element with new CSS property
             */
            addCSS : function(element, attributeName, attributeValue) {
                element.style[attributeName] = attributeValue;
                return element;
            },
            /**
             * @function
             * @description Create HTML element with text inside
             * @param {HTMLElement} element HTML statement
             * @param {string} text to be added in the HTML statement
             * @param {Array} classes as an array of HTML classe(s)
             * @return {HTMLElement} htmlElement with HTMl classe(s) and text inside
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
             * @param {HTMLElement} element HTML statement
             * @param {Array} classes as an array of HTMl classes
             * @return {HTMLElement} htmlElement with HTMl classe(s)
             */
            createElement : function(element, classes){
                var htmlElement = document.createElement(element);
                if (classes)
                    this.addClasses(htmlElement, classes);
                return htmlElement;
            },

            /**
             * @function
             * @description Add a childnode at a pre-existent node
             * @param {HTMLElement} element HTML statement
             * @param {Element|string} child as a node add to element
             * @param {Boolean} prepend specify if child has to be prepend or if child will be
             * append
             * @retrun {HTMLElement} element with the text of child
             */
            appendChild : function(element, child, prepend){
                var children = new Array();
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
