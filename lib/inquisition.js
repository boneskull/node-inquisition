'use strict';

/**
 * @description
 * @module inquisition
 */

var esprima = require('esprima'),
  Type = require('type-of-is'),
  format = require('util').format,
  _ = require('lodash-node'),
  objectWalk = require('object-walk');

var SIGNATURE = '_$BEGIN_DUMMY$_INQUISITION_$END_DUMMY$_';
var FN_PREFIX = '_$BEGIN_FUNCTION$_';
var FN_SUFFIX = '_$END_FUNCTION$_';

var escape$ = function escape$(str) {
  return str.replace(/\$/g, '\\$');
};

var functionify_rx = new RegExp(format('"%s(.+?)%s"', escape$(FN_PREFIX),
  escape$(FN_SUFFIX)), 'gm');

var stringify = function stringify(thing) {
  // some weirdness here in the docs; says I should get "Undefined", but I get "undefined"
  if (Type.string(thing).toLowerCase() === 'undefined') {
    return 'undefined';
  }
  else if (Type.string(thing) === 'RegExp') {
    return thing.toString();
  }
  return format('%s%s%s', FN_PREFIX,
    thing.toString()
      .trim()
      // eliminate newlines
      .replace(/[\r\n]/g, '')
      // replace tabs with spaces and consecutive spaces with single spaces
      .replace(/(\t|\s{2,})/g, ' '),
    //TODO concat strings?
    FN_SUFFIX);
};

var functionify = function functionify(str) {
  return str.replace(functionify_rx, '$1');
};

var analyze = function analyze(data) {
  var root = data.body.declarations[0];
  if (root.id.name !== SIGNATURE) {
    throw new Error('something went terribly wrong');
  }
};

var toCode = function toCode(thing) {
  var type = Type.string(thing),
    value, proto;
  switch (type) {
    case 'Function':
    case 'RegExp':
      value = stringify(thing);
      break;
    case 'Array':
    case 'Object':
      proto = JSON.stringify(Object.getPrototypeOf(thing));
      //TODO handle Object.create(null)
      //TODO or in general, decide what to do with objects.
//      if(type === 'Object' && proto !== '{}' && thing.constructor !== '[Function: Object]') {
//
//      }
      objectWalk(thing, function (value, prop, obj) {
        var type = Type.string(value);
        if (type === 'Function' || type === 'RegExp') {
          obj[prop] = stringify(value);
        }
      });
    /* falls through */
    default:
      value = JSON.stringify(thing);
  }

  return functionify(format('var %s = %s;', SIGNATURE, value));
};

var query = function query(thing) {
  var data = esprima.parse(toCode(thing));
  return analyze(data);
};

module.exports = {
  query: query,
  _toCode: toCode,
  _SIGNATURE: SIGNATURE
};
