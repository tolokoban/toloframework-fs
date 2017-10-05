"use strict";

var Fs = require("fs");
var Path = require("path");
var Promise = require("promise");

// Error numbers for toloframework exceptions.
var ERR_MISSING_ARGUMENT = 1;
var ERR_BAD_ROOT_DEFINITION = 2;
var ERR_DIRECTORY_NOT_FOUND = 3;


/**
 * @param {object} args.roots  - Object defining all the  roots of our
 * file system. A root is a full  path or an array of full pathes. All
 * pathes  used in  this  file  system must  start  with  one of  this
 * roots. The behaviour of the arrays  depends on the operation you do
 * on the file  system. See the documentation of the  methods for more
 * information.
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
 * Perform few validation checks on roots definition.
 */
function checkRootsDefinitions( roots ) {
  var rootName, rootDir, k, directories, directory;
  for( rootName in roots ) {
    rootDir = roots[rootName];
    if( typeof rootDir !== 'string' && !Array.isArray( rootDir ) ) {
      fatal( 
        ERR_BAD_ROOT_DEFINITION, 
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
      if( !Fs.existsSync( directory ) ) {
        fatal( 
          ERR_DIRECTORY_NOT_FOUND, 
          "Error in the definition of root `" + rootName + "`!",
          "This directory does not exist:",
          "  " + directory
        );
      }
    }
  }
}

/**
 * Throw an exception explaining how to use this class.
 */
function throwUsage() {
  fatal(
    ERR_MISSING_ARGUMENT,
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
  var id = "fs-" + args.shift();
  var msg = "[toloframework-fs] " + args.join( "\n" );

  throw { id: id, msg: msg };
}


module.exports = Index;
