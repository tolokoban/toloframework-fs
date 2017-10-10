"use strict";

var Fs = require("fs");
var Path = require("path");

var Err = require("./_error");


/**
 * @export .getAllAbsPaths
 * Return an array of absolute paths.
 * @param  {Index} obj  - An  instance of  Index providing  a `_roots`
 * attribute.
 * @param {string} path - Relative path to one of the available roots.
 * @return {array} Array of absolute paths.
 */
exports.getAllAbsPaths = function( obj, virtualPath ) {
  var [root, path] = exports.splitPath( obj, virtualPath );
  return root.map(function( prefix ) {
    return Path.resolve( prefix, path );
  });
};

/**
 * @export .getAbsPath
 * Return the first absolute path.
 * @see exports.getAllAbsPaths
 */
exports.getAbsPath = function( obj, virtualPath ) {
  var [root, path] = exports.splitPath( obj, virtualPath );
  return Path.resolve( root[0], path );
};

/**
 * @export .splitPath
 * All paths used in this file system are absolute to a root and posix
 * paths. Hence, they must start with a root name. Then, this function
 * will split the path upon the first slash.
 * @param  {object}  obj  -  An  object with  at  least  the  `_roots`
 * attribute.
 * @param  {object} obj._roots  - All  attributes must  be the  string
 * representation if absolute paths.
 * @param   {string}  composedPath   -   Virtual   path  using   POSIX
 * delimiters. The first part of this path is the root.
 * @return {array}
 * @param {array} [0] - Array of absolute paths for the root.
 * @param {string} [1] - Relative path in the root.
 */
exports.splitPath = function( obj, composedPath ) {
  // Cleaning path. Remove all heading "/".
  composedPath = composedPath.trim();
  while( composedPath.charAt(0) === '/' ) composedPath = composedPath.substr( 1 ).trim();
  
  var slashPos = composedPath.indexOf( "/" );
  if( slashPos === -1 ) return [composedPath, "."];
  var root = composedPath.substr(0, slashPos);
  var path = composedPath.substr( slashPos + 1 );
  
  var rootPath = obj._roots[root];
  if( !Array.isArray( rootPath ) ) {
    Err(
      Err.UNKNOW_ROOT,
      "Unknown root \"" + root + "\" in path \"" + composedPath + "\"!"
    );
  }
  return [rootPath, path];
};


/**
 * @export .checkRootsDefinitions
 * Perform  few   validation  checks  on  roots   definition.  If  the
 * validation fails, an exception is thrown.
 * @param {object}  roots - The  values must  be strings os  arrays of
 * strings.
 * @throws Err.BAD_ROOT_DEFINITION 
 * @throws Err.DIRECTORY_NOT_FOUND 
 */
exports.checkRootsDefinitions = function( roots ) {
  var rootName, rootDir, k, directories, directory;
  for( rootName in roots ) {
    rootDir = roots[rootName];
    if( typeof rootDir !== 'string' && !Array.isArray( rootDir ) ) {
      Err( 
        Err.BAD_ROOT_DEFINITION, 
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
        Err( 
          Err.DIRECTORY_NOT_FOUND, 
          "Error in the definition of root `" + rootName + "`!",
          "This directory does not exist:",
          "  " + directory
        );
      }
      directories[k] = directory;
    }
  }
};
