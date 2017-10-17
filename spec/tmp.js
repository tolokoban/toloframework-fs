"use strict";
var FS = require("fs");
var Path = require("path");


var TMP = Path.normalize( Path.resolve( Path.dirname(__filename), "..", "tmp" ) );
if( !FS.existsSync( TMP ) ) {
  FS.mkdirSync( TMP );
}

exports.path = TMP;

exports.clear = function() {
  var children = FS.readdirSync( TMP );
  children.forEach(function (file) {
    clear( Path.resolve( TMP, file ) );
  });
};


function clear( path ) {
  var stats = FS.statSync( path );
  if( stats.isDirectory() ) {
    var children = FS.readdirSync( path );
    children.forEach(function (child) {
      clear( Path.resolve( path, child ) );
    });
    try {
      FS.rmdirSync( path );
    }
    catch( ex ) {
      console.error("Unable to rmdir ", path, "\n", ex);
    }
  } else {
    console.log("unlink", path);
    try {
      FS.unlinkSync( path );
    }
    catch( ex ) {
      console.error("Unable to unlink ", path, "\n", ex);
    }
  }
}
