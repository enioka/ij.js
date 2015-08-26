var enioka = (enioka || {});

enioka.matrix = (
    function (eniokamatrix) {
            /**
             * @class
             * @memberof enioka.matrix.IMatrixRenderer
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
            addClasses : function(element, classes){
                if (classes)
                    for (var c in classes){
                        element.className += " " + classes[c];
                    }
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
                this.addClasses(element, classes);
                return htmlElement;
            }
        };
        HTMLRenderer = Class.create(HTMLRenderer);

        //Load subclasses for MatrixRenderer
        eniokamatrix.HTMLRenderer = HTMLRenderer;
    }(enioka.matrix || {})
);
