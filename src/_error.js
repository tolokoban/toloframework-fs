"use strict";


/**
 * @function fatal
 * Throw  a toloframework  style  exception. All  such exceptions  are
 * object with at  least the `id` attribute.  The first  argument is a
 * the `id`.  All other arguments are  lines of the `msg` attribute of
 * the thrown exception.
 * @param {string} id - The `id` attribute of the thrown exception.
 * @param {...string} [messages] -  Messages will be concatenated with
 * a new line as delimiter and  the result will be the `msg` attribute
 * of the thrown exception.
 */
function fatal( id, messages ) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  var msg = "[toloframework-fs::" + id + "] " + args.join( "\n" );

  throw { id: id, msg: msg };
}


/**
 * @export .MISSING_ARGUMENT
 * @const MISSING_ARGUMENT = "fs-1"
 * At least one argument is missing in the constructor.
 */
fatal.MISSING_ARGUMENT = "fs-1";
/**
 * @export .BAD_ROOT_DEFINITION
 * @const BAD_ROOT_DEFINITION = "fs-2"
 * A root is defined with a string or an array of strings.
 */
fatal.BAD_ROOT_DEFINITION = "fs-2";
/**
 * @export .DIRECTORY_NOT_FOUND
 * @const DIRECTORY_NOT_FOUND = "fs-3"
 * A directory has not been found.
 */
fatal.DIRECTORY_NOT_FOUND = "fs-3";
/**
 * @export .UNKNOWN_ROOT
 * @const UNKNOWN_ROOT = "fs-4"
 */
fatal.UNKNOWN_ROOT = "fs-4";
/**
 * @export .POSIX_EXPECTED
 * @const POSIX_EXPECTED = "fs-5"
 * Virtual  paths  must  follow  the   POSIX  standard:  `/`  as  path
 * delimiters.
 */
fatal.POSIX_EXPECTED = "fs-5";
/**
 * @export .OUT_OF_BOUNDS
 * @const OUT_OF_BOUNDS = "fs-6"
 * You've tried to reach a location out of the scope of a root.
 */
fatal.OUT_OF_BOUNDS = "fs-6";
/**
 * @export .FILE_NOT_FOUND
 * @const FILE_NOT_FOUND = "fs-7"
 * A file has not been found.
 */
fatal.FILE_NOT_FOUND = "fs-7";
/**
 * @export .IO
 * @const IO = "fs-8"
 * I/O exception while accessing a file or directory.
 */
fatal.IO = "fs-8";
/**
 * @export .UNKNOWN
 * @const UNKNOWN = "?"
 * This error is from an unknown source. This is a low level exception
 * that has not been properly catched.
 */
fatal.UNKNOWN = "?";


/**
 * @export .normalize
 * @function
 * Normalized  errors  are  objects   providing  the  `id`  and  `msg`
 * attributes. This function converts any  error passed as argument in
 * such a normalized  error. Extra strings can be added  to the end of
 * the error message.
 * @param {any} err - An input error.
 * @param {...string}  extraMessages - If  any, these strings  will be
 * added at the end of the resulting error's message.
 * @return {string} A normalized error.
 */
fatal.normalize = function( err, extraMessages ) {
  var extra = "\n" + Array.slice.call(arguments).shift().join("\n");
  if( typeof err === 'string' ) {
    return {
      id: fatal.UNKNOWN,
      msg: (err + extra).trim()
    };
  }
  if( typeof err.id === 'undefined' ) err.id = fatal.UNKNOWN;
  err.msg = ((err.msg || '') + extra).trim();
  return err;
};


/**
 * @export fatal
 */
module.exports = fatal;
