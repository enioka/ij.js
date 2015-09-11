# ij.js
An open source html viewer that lets you browse graph or pivot table matrix data in row/columns.

ij.js handles for you the display and navigation in a matrix representation of your data. Your data can be graph based data to represent paths between two sets of nodes, or multidimensionnal data with dimensions as rows and columns.

ij.js lets you fully free of the organisation of your data, of its rendering in the matrix, as well as the interactions with this data on the matrix. This is implemented through object delegates to provide to ij.js at init time. These delegates obey three main interface definitions : IijDataProvider, IijRenderer, Iij

ij.js provides predefined abstract implementations of these interfaces as well as partial implementations to let you implement minimal work in your application, whilst letting you fully free to implement the required glue without actual copy of your application's data.

Based on renderer's results, ij.js builds hierarchies on rows and or columns, with associated summarizations of underlying data (displayed with or without underlying data). 

