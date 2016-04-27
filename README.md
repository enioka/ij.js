[![Build Status](https://travis-ci.org/enioka/ij.js.svg?branch=master)](https://travis-ci.org/enioka/ij.js)
# ij.js 
An open source html viewer that lets you browse graph or pivot table matrix data in row/columns.

ij.js handles for you the display and navigation in a matrix representation of your data. Your data can be graph based data to represent paths between two sets of nodes, or multidimensionnal data with dimensions as rows and columns.

ij.js lets you fully free of the organisation of your data, of its rendering in the matrix, as well as the interactions with this data on the matrix. This is implemented through object delegates to provide to ij.js at init time. These delegates obey three main interface definitions :
* IijDataProvider : provides data for columns, rows, and cells for a given row/col. Does compute aggregation as well per lines and columns.
* IijRenderer : renders columns headers fragments,
* IijController : provides all GUI interaction (buttons, filters, whatever the application wants to provide  control of the application. Some GUI interactions are built in ij.js core to handle events on the displayed elements.

ij.js provides predefined abstract implementations of these interfaces as well as partial implementations to let you implement minimal work in your application, whilst letting you fully free to implement the required glue without actual copy of your application's data.

Based on renderer's results, ij.js builds hierarchies on rows and or columns, with associated summarizations of underlying data (displayed with or without underlying data).
##Project structure
```
+-- src
|   +-- js
|   |   +-- defaultImplementations (contains default implementation of rendered/dataprovider interfaces)
|   |   +-- *.js (source files of the library)
|   +--css
|   |   +-- *.css (default style sheets)
+-- doc
|   |   +-- *.html (api documentation)
+-- examples
|   |   +-- <exampleDirectory> (renamed with the example name)
|   |   |   +-- index.html
|   |   |   +-- example.js (renamed with the example name)
|   |   |   ... (example resources)
+-- specs
|   |   +-- index.html (index specs file)
|   |   +-- *.js (specs files)
|   |   +-- jasmine (directory containing jasmine library)
+-- dist
|   +-- <version> (replaced by the version code)
|   |   +-- ij.js (library at the version specified)
|   |   +-- withDefaultImplementations
|   |   |   +-- ij.js (library with default implementations at the version)
+-- min
|   +-- ij.min.js (current version of the library uglified)
|   +-- withDefaultImplementations
|   |   +-- ij.js (current version of the library with defaultImplementations uglified)
+-- lib
|   +-- inheritance.js (for oop ruby style classes)
|   +-- logger.js (for enhanced logs)
+-- Gruntfile.js 
+-- .travis.yml
+-- package.json
```
##Include

You may have to include the `min/ij.min.js` which include every default interface configuration or create your own by downloading the repo and `uglify` the main interfaces

##Current default implementation available

* dsvDataProvider : Import your delimiter separated values file into ij.js
* defaultHTMLRenderer : Default HTML (w/ bootstrap) renderer implementation. You'll have to code functions for renderRow, renderColumn and renderCell.

##Examples previews

* hierarchicalExample : With some configuration you can achieve a hierarchical array with summaries and aggregations.
![hierarchical Example preview](http://i.imgur.com/AItqlzI.png)

* dsvDataProviderExample : You can load your file from an ajax request (csv, tsv, dsv).
![dsv Data Provider Example](http://i.imgur.com/BXoUTtE.png)
