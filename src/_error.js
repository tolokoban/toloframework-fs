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
  var msg = "[toloframework-fs] " + args.join( "\n" );

  throw { id: id, msg: msg };
}


fatal.MISSING_ARGUMENT = "fs-1";
fatal.BAD_ROOT_DEFINITION = "fs-2";
fatal.DIRECTORY_NOT_FOUND = "fs-3";
fatal.UNKNOW_ROOT = "fs-4";


/**
 * @export fatal
 */
module.exports = fatal;
