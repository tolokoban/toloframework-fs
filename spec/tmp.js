"use strict";
var FS = require("fs");
var Path = require("path");


var TMP = Path.normalize( Path.resolve( Path.dirname(__filename), "..", "tmp" ) );
console.info("[tmp] TMP=", TMP);
if( !FS.existsSync( TMP ) ) {
  FS.mkdirSync( TMP );
}

exports.path = TMP;

exports.clean = function() {
  clean( TMP );
};


function clean( path ) {
  var stats = FS.statSync( path );
  if( stats.isDirectory() ) {
    var children = FS.readdirSync( path );
    children.forEach(function (child) {
      clean( child );
    });
  } else {
    FS.unlinkSync( path );
  }
}
