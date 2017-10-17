"use strict";

var FS = require("fs");

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
 * Create a directory and all the missing parents directories.
 * @param {string} virtualPath - The directory to create.
 * @return {Promise} `resolve()` and `reject(err)`.
 */
Index.prototype.mkdir = require("./index.mkdir");

/**
 * @member Index.existsSync
 * @param {string} virtualPath - Virtual path of the file/directory to
 * check for existence. For roots with  several real paths, we find in
 * each path sequentially.
 */
Index.prototype.existsSync = function(virtualPath) {
  var paths = Private.getAllAbsPaths( this, virtualPath );
  while( paths.length > 0 ) {
    var path = paths.shift();
    if( FS.existsSync( path ) ) return true;
  }
  return false;
};

/**
 * @member Index.clear
 * @param {string} virtualPath - Directory in which you want to delete
 * all files and subdirectories.
 * @return {Promise} `resolve()` and `reject(err)`.
 */
Index.prototype.clear = require("./index.clear");

/**
 * @member Index.readString
 * @param {string} virtualPath - Path of the file to read.
 * @param {string} encoding='utf8' - File encoding.
 * @return {Promise} `resolve(textContent)` and `reject(err)`.
 */
Index.prototype.readString = function(virtualPath, encoding) {
  if( typeof encoding === 'undefined' ) encoding = 'utf8';

  return new Promise(function (resolve, reject) {
    try {
      var absPath = Private.getExistingAbsPath( this, virtualPath );
      if( absPath === null ) throw Err(
        Err.FILE_NOT_FOUND,
        "Unable to find `" + virtualPath + "`!"
      );
      FS.readFile( absPath, { flag: "r", encoding: encoding }, function( err, data ) {
        if( err ) {
          return reject( Err.normalize( err, "This error occurs in readString()." ) );
        }
        resolve( data.toString() );
      });
    }
    catch( ex ) {
      reject( Err.normalize( ex, "This error occurs in readString()." ) );
    }
  });
};

/**
 * @member Index.writeString
 * @param {string} virtualPath - Path of the file to write.
 * @param {string} encoding='utf8' - File encoding.
 * @return {Promise} `resolve()` and `reject(err)`.
 */
Index.prototype.writeString = function(virtualPath, encoding) {
  var that = this;
  if( typeof encoding === 'undefined' ) encoding = 'utf8';

  return new Promise(function (resolve, reject) {
    try {
      that.mkdir( that.getParent( virtualPath ) );
      var absPath = Private.getAbsPath( this, virtualPath );
      FS.readFile( absPath, { flag: "r", encoding: encoding }, function( err, data ) {
        if( err ) {
          return reject( Err.normalize( err, "This error occurs in readString()." ) );
        }
        resolve( data.toString() );
      });
    }
    catch( ex ) {
      reject( Err.normalize( ex, "This error occurs in readString()." ) );
    }
  });
};

/**
 * @member Index.getParent
 * @param  {string} virtualPath  - The  path  we want  to extract  the
 * parent from.
 * @return {string}  Virtual path  of the parent  folder of  a virtual
 * path.
 */
Index.prototype.getParent = function( virtualPath ) {
  var k = virtualPath.lastIndexOf( "/" );
  if( k === -1 ) return virtualPath;
  return virtualPath.substr( 0, k );
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
