"use strict";

var FS = require("fs");
var Path = require("path");
var Promise = require("promise");

var Err = require("./_error");
var Private = require("./_private");


module.exports = function(virtualPath) {
  var that = this;

  return new Promise(function (resolve, reject) {
    try {
      var absPath = Private.getAbsPath( that, virtualPath );
      readdir(absPath)
        .then( process( that ) )
        .then( resolve )
        .catch( reject );
    }
    catch( ex ) {
      reject( ex );
    }
  });
};


/**
 * List the files/directories in a directory and return a Promise.
 * @return {Promise} `resolve( files )`,  where `files` is an array of
 * absolute paths.
 */
function readdir( absPath ) {
  return new Promise(function (resolve, reject) {
    FS.readdir( absPath, function( err, files ) {
      if( err ) return reject(Err(
        Err.IO,
        "Unable to read content of directory `" + absPath + "`:",
        err
      ));

      resolve( files.map(function(f) {
        return Path.resolve( absPath, f );
      }));
    });
  });
}


function process( that, fringe ) {
  return new Promise(function (resolve, reject) {
    processNextFile.bind( that, fringe, resolve, reject );
  });
}


function processNextFile( that, fringe, resolve, reject ) {
  if( fringe.length === 0 ) return resolve();

  var file = fringe.pop();
  isDirectory( file )
    .then(function( isDir ) {
      if( isDir ) {
        readdir( file )
          .then( removeDir.bind( that, fringe, file ) )
          .catch( reject );
      } else {
        unlink( file )
          .then( processNextFile.bind( that, fringe, resolve, reject ) )
          .catch( reject );
      }
    }).catch( reject );
}


function unlink( absPath ) {
  return new Promise(function (resolve, reject) {
    FS.unlink( absPath, function( err ) {
      if( err ) return reject(Err(
        Err.IO, "Unable to delete file `" + err + "`:", absPath
      ));
      resolve();
    });
  });
}


function removeDir( fringe, absPath, files ) {
  return new Promise(function (resolve, reject) {
    if( files.length > 0 ) {
      fringe.push.apply( fringe, files );
      // Add the directory  in the fringe again because  next time, it
      // will be empty then deleted.
      fringe.push( absPath );
    } else {
      unlink( absPath ).then( resolve, reject );
    }
  });
}


function isDirectory( absPath ) {
  return new Promise(function (resolve, reject) {
    FS.stat( absPath, function( err, stats ) {
      if( err ) {
        reject(Err(
          Err.IO,
          "Unable to read stats of `" + absPath + "`:",
          err
        ));
      } else {
        resolve( stats.isDirectory() );
      }
    });
  });
}
