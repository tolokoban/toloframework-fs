"use strict";
var FS = require("fs");
var Path = require("path");


var TMP = Path.normalize( Path.resolve( Path.dirname(__filename), "..", "tmp" ) );
if( !FS.existsSync( TMP ) ) {
  FS.mkdirSync( TMP );
}

exports.path = TMP;

exports.clear = function() {
  clear( TMP );
};


function clear( path ) {
  var stats = FS.statSync( path );
  if( stats.isDirectory() ) {
    var children = FS.readdirSync( path );
    children.forEach(function (child) {
      clear( Path.resolve( path, child ) );
    });
    console.log(">> UNLINK: ", path);
    FS.unlinkSync( path );
  } else {
    console.log(">> UNLINK: ", path);
    FS.unlinkSync( path );
  }
}
