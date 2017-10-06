"use strict";

var Fs = require("fs");
var Path = require("path");
var Promise = require("promise");



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
  checkRootsDefinitions( args.roots );

  this._roots = args.roots;
};

/**
 * @member Index.mkdir
 * @param path
 */
Index.prototype.mkdir = function(path) {
  console.info("[index] getAllAbsPaths(path)=", getAllAbsPaths(this, path));
};


/**
 * Return an array of absolute paths.
 * @param  {Index} obj  - An  instance of  Index providing  a `_roots`
 * attribute.
 * @param {string} path - Relative path to one of the available roots.
 */
function getAllAbsPaths( obj, virtualPath ) {
  var [root, path] = splitPath( virtualPath );
  
}

/**
 * All paths used in this file system are absolute to a root and posix
 * paths. Hence, they must start with a root name. Then, this function
 * will split the path upon the first slash.
 */
function splitPath( path ) {
  // Cleaning path. Remove all heading "/".
  path = path.trim();
  while( path.charAt(0) === '/' ) path = path.substr( 1 ).trim();
  
  var slashPos = path.indexOf( "/" );
  if( slashPos === -1 ) return [path, "."];
  return [path.substr(0, slashPos), path.substr( slashPos + 1 )];
}


/**
 * Perform few validation checks on roots definition.
 */
function checkRootsDefinitions( roots ) {
  var rootName, rootDir, k, directories, directory;
  for( rootName in roots ) {
    rootDir = roots[rootName];
    if( typeof rootDir !== 'string' && !Array.isArray( rootDir ) ) {
      fatal( 
        Index.ERR_BAD_ROOT_DEFINITION, 
        "Bad root definition for `" + rootName + "`!", 
        "Must be a string or an array of strings." 
      );
    }
    if( !Array.isArray( rootDir ) ) {
      // Force every root to be an array, even if with only one element.
      roots[rootName] = [rootDir];
    }
    // Check if the directories exist.
    directories = roots[rootName];
    for( k = 0 ; k < directories.length ; k++ ) {
      directory = directories[k];
      directory = Path.resolve( ".", directory );
      directory = Path.normalize( directory );
      if( !Fs.existsSync( directory ) ) {
        fatal( 
          Index.ERR_DIRECTORY_NOT_FOUND, 
          "Error in the definition of root `" + rootName + "`!",
          "This directory does not exist:",
          "  " + directory
        );
      }
      directories[k] = directory;
    }
  }
  console.info("[index] roots=", roots);
}

/**
 * Throw an exception explaining how to use this class.
 */
function throwUsage() {
  fatal(
    Index.ERR_MISSING_ARGUMENT,
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
 * Throw  a toloframework  style  exception. All  such exceptions  are
 * object with at  least the `id` attribute.  The first  argument is a
 * number which when prefixed with  "fs-" becomes the `id`.  All other
 * arguments are lines of the `msg` attribute of the thrown exception.
 */
function fatal() {
  var args = Array.prototype.slice.call(arguments);
  var id = args.shift();
  var msg = "[toloframework-fs] " + args.join( "\n" );

  throw { id: id, msg: msg };
}


// Error ids for toloframework exceptions.
Index.ERR_MISSING_ARGUMENT = "fs-1";
Index.ERR_BAD_ROOT_DEFINITION = "fs-2";
Index.ERR_DIRECTORY_NOT_FOUND = "fs-3";

/**
 * @export Index
 */
module.exports = Index;

