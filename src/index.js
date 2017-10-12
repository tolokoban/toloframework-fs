"use strict";

var Fs = require("fs");
var Path = require("path");
var Promise = require("promise");

var Err = require("./_error");
var Private = require("./_private");


/**
 * @class Index
 * @constructor
 * @param {object} args.roots  - Object defining all the  roots of our
 * file system. A root is a full  path or an array of full pathes. All
 * pathes  used in  this  file  system must  start  with  one of  this
 * roots. The behaviour of the arrays  depends on the operation you do
 * on the file  system. See the documentation of the  methods for more
 * information. But  in anycase, onely the  first path of an  array is
 * writable.
 */
var Index = function( args ) {
  // Checking argument.
  if( typeof args === 'undefined' ) throwUsage();
  if( typeof args.roots !== 'object' ) throwUsage();
  if( Array.isArray( args.roots ) ) throwUsage();

  // Checking roots definitions.
  Private.checkRootsDefinitions( args.roots );

  this._roots = args.roots;
};

/**
 * @member Index.mkdir
 * @param path
 */
Index.prototype.mkdir = function(path) {
  return new Promise(function (resolve, reject) {
    try {
      path = Private.normalizePath( path );
      var src = path.split('/');
      var dst = [];

      var next = function( resolve, reject ) {
        if( src.length === 0 ) {
          resolve();
        } else {
          
        }
      };
      next();

      var absPath = Private.getAbsPath(this, path);
    }
    catch( ex ) {
      reject( ex );
    }
  });
};



/**
 * Throw an exception explaining how to use this class.
 */
function throwUsage() {
  Err(
    Err.MISSING_ARGUMENT,
    "Mandatory argument is missing!",
    "Expected something like this:",
    "  var FS = require('toloframework-fs');",
    "  var myFileSystem = new FS({",
    "    src: [",
    "      '/home/tolokoban/projects/foobar/src',",
    "      '/usr/share/common_libraries'",
    "    ],",
    "    dst: '/var/www/foobar'",
    "  });"
  );
}


/**
 * @export Index
 */
module.exports = Index;
