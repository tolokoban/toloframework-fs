"use strict";

var FS = require("fs");

var Private = require("./_private");


module.exports = function( virtualPath ) {
  var that = this;

  return new Promise(function (resolve, reject) {
    try {
      var src = virtualPath.split('/');
      var dst = [];
      var currentVirtualPath = src.shift();
      
      var next = function() {
        if( src.length === 0 ) {
          resolve();
        } else {
          currentVirtualPath += "/" + src.shift();
          var absPath = Private.getAbsPath(that, currentVirtualPath);
          if( FS.existsSync( absPath ) ) {
            next();
          } else {
            FS.mkdir( absPath, next );
          }
        }
      };
      next();
    }
    catch( ex ) {
      reject( ex );
    }
  });
};
