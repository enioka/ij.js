var enioka = (enioka || {});

enioka.ij = (
    function (eniokaij) {

        /**
         * @class
         * @memberof enioka.ij
         * @classdesc  This is the interface to handle data retrieving for CSV file and will work
         * through only three methods calling callbacks.
         * <br/>
         * <br/>
         */
        var DSVataProvider = {
            initialize : function(url, separator, rowsHeadersDepth, columnsHeadersDepth) {
                var xmlhttp = new XMLHttpRequest(),
                    dsvDataProvider = this;

                //default behavior
                this.rowDepth = rowsHeadersDepth || 1;
                this.columnDepth = columnsHeadersDepth || 1;

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        console.log("DSV file received");
                        var fileLines = dsvDataProvider._parseDSV(xmlhttp.responseText, separator);
                        console.log("data parsed");
                        dsvDataProvider.matrix = dsvDataProvider._chewData(fileLines);
                        console.log("data chewed");
                    }
                }

                xmlhttp.open("GET", url, false);
                xmlhttp.send();
            },

            /**
             * @function
             * @description getData will retrieve a sparse matrix given by dataCallBack function
             * @return path
             */
            getData : function(rowsObjects, columnsObjects, filter){
                var returned = new Array();
                for (var row = 0; row < rowsObjects.length; row++){
                    for (var column = 0; column < columnsObjects.length; column++){
                        returned.push(this.matrix[rowsObjects[row]][columnsObjects[column]]);
                    }
                }
                return returned;
            },

            /**
             * @function
             * @description getRows will retrieve an array of objects that will be instanciated
             * as DataHeader
             * @return rows.
             */
            getRows : function(){
                return this.rows;
            },

            /**
             * @function
             * @description getColumns will retrieve an array of objects that will be
             * instanciated as DataHeader
             * @return columns.
             */
            getColumns : function(){
                return this.columns;
            },

            _parseDSV : function(fileContent, separator){
                var lines = fileContent.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    // Ignore empty line
                    if (lines[i]){
                        y = lines[i].split(separator);
                        lines[i] = y;
                    } else {
                        delete lines[i];
                        lines.length--;
                    }
                }
                return lines;
            },

            _chewData : function(lines) {
                this.rows = new Array;
                this.columns = new Array();
                var matrix = new Array();
                //for each line
                for (var r = this.columnDepth; r < lines.length; r++) {
                    //line object name
                    var row = new Array();
                    for (var i = 0; i < this.rowDepth; i++) {
                        row.push(lines[r][i]);
                    }
                    row = row.join(",");
                    this.rows.push(row);
                    for (var c = this.rowDepth; c < lines[r].length; c++){
                        var column = new Array();
                        for (var i = 0; i < this.columnDepth; i++) {
                            column.push(lines[i][c]);
                        }
                        column = column.join(",");
                        this.columns[c - this.rowDepth] = column;
                        if (!matrix[row])
                            matrix[row] = new Array();
                        matrix[row][column] = lines[r][c] || null;
                    }
                }
                return matrix;
            }
        };
        DSVataProvider = Class.extend(enioka.ij.IIJDataProvider, DSVataProvider);

        eniokaij.DSVataProvider = DSVataProvider;

        // That's all folks
        return eniokaij;
    }(enioka.ij || {})
);
